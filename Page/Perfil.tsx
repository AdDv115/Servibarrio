import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "SB_USER_SESSION";
const BASE_URL = "https://api-appless.vercel.app";

export interface PerfilState {
  nombre: string;
  correo: string;
  telefono: string;
  foto: string;
}

interface Session {
  id: string;
  correo: string;
  rol: string;
  esTecnico: boolean;
  esMiembro: boolean;
  foto?: string;
  usuario?: string;
  telefono?: string;
}

export function usePerfil() {
  const [perfil, setPerfil] = useState<PerfilState>({
    nombre: "",
    correo: "",
    telefono: "",
    foto: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const cargarSesion = useCallback(async (): Promise<Session | null> => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  }, []);

  const cargarPerfil = useCallback(async () => {
    setLoading(true);
    try {
      const sess = await cargarSesion();
      if (!sess) {
        setLoading(false);
        return;
      }
      const resp = await fetch(`${BASE_URL}/usuarios/${sess.id}`);
      const txt = await resp.text();
      let data: any = {};
      try {
        data = txt ? JSON.parse(txt) : {};
      } catch {
        data = {};
      }
      if (!resp.ok) {
        throw new Error(data?.message || `Error ${resp.status}`);
      }
      setPerfil({
        nombre: data.Usuario || "",
        correo: data.Correo || "",
        telefono: data.Telefono ? String(data.Telefono) : "",
        foto: data.Foto || "",
      });
    } finally {
      setLoading(false);
    }
  }, [cargarSesion]);

  const guardarPerfil = useCallback(
    async (values: PerfilState) => {
      const sess = await cargarSesion();
      if (!sess) return;
      setSaving(true);
      try {
        const resp = await fetch(`${BASE_URL}/usuarios/${sess.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Usuario: values.nombre.trim(),
            Correo: values.correo.trim(),
            Telefono: values.telefono.trim(),
            Foto: values.foto.trim(),
          }),
        });
        const txt = await resp.text();
        let data: any = {};
        try {
          data = txt ? JSON.parse(txt) : {};
        } catch {
          data = { message: txt };
        }
        if (!resp.ok) {
          throw new Error(data?.message || `Error ${resp.status}`);
        }

        const updated = data.user || data;
        const nuevaSesion: Session = {
          id: updated._id || sess.id,
          correo: updated.Correo || values.correo,
          rol: sess.rol,
          esTecnico: sess.esTecnico,
          esMiembro: sess.esMiembro,
          foto: updated.Foto || values.foto,
          usuario: updated.Usuario || values.nombre,
          telefono: updated.Telefono || values.telefono,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevaSesion));
        setPerfil({
          nombre: nuevaSesion.usuario || values.nombre,
          correo: nuevaSesion.correo,
          telefono: nuevaSesion.telefono ? String(nuevaSesion.telefono) : "",
          foto: nuevaSesion.foto || "",
        });
        await cargarPerfil();
      } finally {
        setSaving(false);
      }
    },
    [cargarSesion, cargarPerfil]
  );

  useEffect(() => {
    cargarPerfil();
  }, [cargarPerfil]);

  return {
    perfil,
    setPerfil,
    loading,
    saving,
    guardarPerfil,
    recargar: cargarPerfil,
  };
}
