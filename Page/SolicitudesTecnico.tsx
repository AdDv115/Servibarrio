import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PeticionServicio } from "../Componentes/Tablero";

export interface SolicitudTecnico extends PeticionServicio {
  accepted?: boolean;
  acceptedAt?: string;
}

export const useSolicitudesTecnico = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudTecnico[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizarSolicitudes = (items: any[]): SolicitudTecnico[] => {
    return items.map((item) => ({
      ...item,
      date: new Date(item.date),
      accepted: item.accepted ?? false,
      acceptedAt: item.acceptedAt,
    }));
  };

  const cargarSolicitudes = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("PS");
      if (stored) {
        const data = JSON.parse(stored);
        setSolicitudes(normalizarSolicitudes(data));
      } else {
        setSolicitudes([]);
      }
    } catch (error) {
      console.log("No se pudieron cargar las solicitudes", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const persistirSolicitudes = async (items: SolicitudTecnico[]) => {
    setSolicitudes(items);
    try {
      await AsyncStorage.setItem("PS", JSON.stringify(items));
    } catch (error) {
      console.log("No se pudieron guardar los cambios", error);
    }
  };

  const aceptarSolicitud = async (id: string) => {
    const actualizadas = solicitudes.map((solicitud) =>
      solicitud.id === id
        ? {
            ...solicitud,
            accepted: true,
            acceptedAt: new Date().toISOString(),
          }
        : solicitud
    );

    await persistirSolicitudes(actualizadas);
  };

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  return {
    solicitudes,
    loading,
    aceptarSolicitud,
    recargarSolicitudes: cargarSolicitudes,
  };
};
