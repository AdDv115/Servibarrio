import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "SB_USER_SESSION";
const BASE_URL = "https://api-appless.vercel.app";

export interface AdminUser {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  rol: string;
  foto: string;
}

export function useAdminUsuarios() {
  const [usuarios, setUsuarios] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/usuarios`);
      const txt = await resp.text();
      let data: any = [];
      try {
        data = txt ? JSON.parse(txt) : [];
      } catch {
        data = [];
      }
      if (!resp.ok) {
        throw new Error(data?.message || `Error ${resp.status}`);
      }
      const arr = (Array.isArray(data) ? data : []).map((u: any) => ({
        id: u._id || u.id || "",
        nombre: u.Usuario || "",
        correo: u.Correo || "",
        telefono: u.Telefono ? String(u.Telefono) : "",
        rol: u.Rol || "",
        foto: u.Foto || "",
      }));
      setUsuarios(arr);
    } finally {
      setLoading(false);
    }
  }, []);

  const guardarUsuario = useCallback(
    async (user: AdminUser) => {
      setSavingId(user.id);
      try {
        const resp = await fetch(`${BASE_URL}/usuarios/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Usuario: user.nombre.trim(),
            Correo: user.correo.trim(),
            Telefono: user.telefono.trim(),
            Foto: user.foto.trim(),
            Rol: user.rol.trim().toLowerCase(),
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
        const actualizado = data.user || data;
        setUsuarios((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? {
                  id: actualizado._id || u.id,
                  nombre: actualizado.Usuario || user.nombre,
                  correo: actualizado.Correo || user.correo,
                  telefono: actualizado.Telefono ? String(actualizado.Telefono) : user.telefono,
                  rol: actualizado.Rol || user.rol,
                  foto: actualizado.Foto || user.foto,
                }
              : u
          )
        );

        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const sess = JSON.parse(raw);
          if (sess.id === user.id) {
            const nuevaSesion = {
              ...sess,
              correo: actualizado.Correo || user.correo,
              usuario: actualizado.Usuario || user.nombre,
              telefono: actualizado.Telefono || user.telefono,
              foto: actualizado.Foto || user.foto,
              rol: actualizado.Rol || user.rol,
              esAdmin: (actualizado.Rol || user.rol) === "admin",
              esTecnico: (actualizado.Rol || user.rol) === "tecnico",
              esMiembro: (actualizado.Rol || user.rol) === "usuario",
            };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevaSesion));
          }
        }
      } finally {
        setSavingId(null);
      }
    },
    []
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  return {
    usuarios,
    loading,
    savingId,
    setUsuarios,
    recargar: cargar,
    guardarUsuario,
  };
}
