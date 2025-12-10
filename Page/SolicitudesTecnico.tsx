import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Rol = "usuario" | "tecnico" | "admin";

interface UserSession {
  id: string;
  correo: string;
  rol: Rol;
  esTecnico: boolean;
  esMiembro: boolean;
  foto?: string;
  usuario?: string;
  esAdmin?: boolean;
}

export interface SolicitudTecnico {
  id: string;
  title: string;
  date: Date | string;
  accepted: boolean;
  usuarioId: string;
  descripcion?: string;
  rolAsignado?: string;
  estado?: string;
  tecnicoId?: string;
  tecnicoCorreo?: string;
}

const STORAGE_KEY = "SB_USER_SESSION";
const BASE_URL = "https://api-appless.vercel.app";

async function cargarSesion(): Promise<UserSession | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

async function fetchSolicitudesTecnico(): Promise<SolicitudTecnico[]> {
  const resp = await fetch(`${BASE_URL}/tareas-tecnico`);
  const txt = await resp.text();
  let data: any = [];
  try {
    data = txt ? JSON.parse(txt) : [];
  } catch {
    data = [];
  }
  if (!resp.ok) {
    const msg = data?.message || `Error ${resp.status}`;
    throw new Error(msg);
  }
  const arr = (Array.isArray(data) ? data : data?.tareas || []).map((t: any) => {
    const fecha = t.fecha || t.createdAt;
    const parsedDate = fecha ? new Date(fecha) : new Date();
    const date = Number.isNaN(+parsedDate) ? new Date() : parsedDate;
    const estado = t.estado || (t.accepted ? "aceptada" : "pendiente");
    const accepted =
      estado === "aceptada" ||
      t.accepted === true ||
      t.aceptada === true ||
      t.status === "aceptada" ||
      t.estado === "tomada";
    return {
      id: t.id || t._id || "",
      title: t.titulo || t.descripcion || "Sin titulo",
      date,
      accepted,
      estado,
      usuarioId: t.usuarioId || t.userId || "",
      descripcion: t.descripcion,
      rolAsignado: t.rolAsignado || t.rol || "usuario",
      tecnicoId: t.tecnicoId,
      tecnicoCorreo: t.tecnicoCorreo,
    } as SolicitudTecnico;
  });
  return arr;
}

export function useSolicitudesTecnico() {
  const [solicitudes, setSolicitudes] = useState<SolicitudTecnico[]>([]);
  const [loading, setLoading] = useState(true);

  const aceptarSolicitud = useCallback(async (id: string) => {
    const sess = await cargarSesion();
    if (!sess) return;
    try {
      const resp = await fetch(`${BASE_URL}/tareas/${id}/aceptar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tecnicoId: sess.id,
          tecnicoCorreo: sess.correo,
        }),
      });
      const bodyTxt = await resp.text();
      let data: any = {};
      try {
        data = bodyTxt ? JSON.parse(bodyTxt) : {};
      } catch {
        data = { message: bodyTxt };
      }
      if (!resp.ok) {
        throw new Error(data?.message || `Error ${resp.status}`);
      }
      const tarea = data.tarea || data;
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                accepted: true,
                estado: tarea.estado || "aceptada",
                tecnicoId: tarea.tecnicoId || sess.id,
                tecnicoCorreo: tarea.tecnicoCorreo || sess.correo,
              }
            : s
        )
      );
    } catch {
      // sin cambios si falla
    }
  }, []);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const sess = await cargarSesion();
      if (!sess || !sess.esTecnico) {
        setSolicitudes([]);
      } else {
        const lista = await fetchSolicitudesTecnico();
        setSolicitudes(lista);
      }
    } catch {
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const recargarSolicitudes = useCallback(async () => {
    await cargar();
  }, [cargar]);

  return {
    solicitudes,
    loading,
    aceptarSolicitud,
    recargarSolicitudes,
  };
}
