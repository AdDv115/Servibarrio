import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AdminUser } from "../Page/Admin";
import Estilos from "./Estilos/Estilos";
import EstilosAdmin from "./Estilos/Admin";

const BASE_URL = "https://api-appless.vercel.app";

type ServicioAdmin = {
  id: string;
  title: string;
  descripcion?: string;
  estado?: string;
  usuarioId?: string;
  tecnicoId?: string;
  tecnicoCorreo?: string;
  fecha?: Date;
  direccion?: string;
};

type Props = {
  usuarios: AdminUser[];
  tecnicos: AdminUser[];
  userMap: Record<string, AdminUser>;
};

const safeJson = (txt: string) => {
  try {
    return txt ? JSON.parse(txt) : null;
  } catch {
    return null;
  }
};

const normalizarServicio = (t: any): ServicioAdmin => {
  const fecha = t?.fecha || t?.createdAt;
  const parsedFecha = fecha ? new Date(fecha) : undefined;
  return {
    id: t?.id || t?._id || "",
    title: t?.titulo || t?.descripcion || "Sin titulo",
    descripcion: t?.descripcion,
    estado: t?.estado || "pendiente",
    usuarioId: t?.usuarioId || t?.userId,
    tecnicoId: t?.tecnicoId,
    tecnicoCorreo: t?.tecnicoCorreo,
    direccion: t?.direccion,
    fecha: parsedFecha,
  };
};

export default function ServiciosSection({ usuarios, tecnicos, userMap }: Props) {
  const [servicios, setServicios] = useState<ServicioAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [creando, setCreando] = useState(false);
  const [nuevoServicio, setNuevoServicio] = useState({
    title: "",
    descripcion: "",
    direccion: "",
    usuarioId: "",
  });

  const estados = useMemo(
    () => [
      { label: "Pendiente", value: "pendiente" },
      { label: "Asignada", value: "asignada" },
      { label: "Aceptada", value: "aceptada" },
      { label: "Completada", value: "completada" },
    ],
    []
  );

  const cargarServicios = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${BASE_URL}/tareas-tecnico`);
      const txt = await resp.text();
      const data = safeJson(txt) || [];
      if (!resp.ok) {
        const mensaje = (data as any)?.message || `Error ${resp.status}`;
        throw new Error(mensaje);
      }
      const arr = Array.isArray(data) ? data : (data as any)?.tareas || [];
      setServicios(arr.map((t: any) => normalizarServicio(t)));
    } catch (error) {
      setServicios([]);
      const mensaje = error instanceof Error ? error.message : "No se pudieron cargar los servicios.";
      Alert.alert("Servicios", mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarServicios();
  }, [cargarServicios]);

  const actualizarCampo = (id: string, campo: keyof ServicioAdmin, valor: string) => {
    setServicios((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              [campo]: valor,
              ...(campo === "tecnicoId"
                ? { tecnicoCorreo: tecnicos.find((t) => t.id === valor)?.correo || s.tecnicoCorreo }
                : null),
            }
          : s
      )
    );
  };

  const guardarServicio = async (s: ServicioAdmin) => {
    setSavingId(s.id);
    try {
      const tecnicoCorreo = s.tecnicoCorreo || tecnicos.find((t) => t.id === s.tecnicoId)?.correo;
      const resp = await fetch(`${BASE_URL}/tareas/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: s.title,
          descripcion: s.descripcion,
          estado: s.estado,
          tecnicoId: s.tecnicoId,
          tecnicoCorreo,
          direccion: s.direccion,
          fecha: s.fecha,
        }),
      });
      const txt = await resp.text();
      const data = safeJson(txt) || {};
      if (!resp.ok) {
        const mensaje = (data as any)?.message || `Error ${resp.status}`;
        throw new Error(mensaje);
      }
      const tarea = (data as any)?.tarea || data;
      setServicios((prev) =>
        prev.map((serv) =>
          serv.id === s.id
            ? {
                ...serv,
                title: tarea?.titulo || serv.title,
                descripcion: tarea?.descripcion ?? serv.descripcion,
                estado: tarea?.estado ?? serv.estado,
                tecnicoId: tarea?.tecnicoId ?? serv.tecnicoId,
                tecnicoCorreo: tarea?.tecnicoCorreo ?? tecnicoCorreo ?? serv.tecnicoCorreo,
                direccion: tarea?.direccion ?? serv.direccion,
              }
            : serv
        )
      );
      Alert.alert("Guardado", "Servicio actualizado.");
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "No se pudo actualizar.";
      Alert.alert("Error", mensaje);
    } finally {
      setSavingId(null);
    }
  };

  const eliminarServicio = async (id: string) => {
    setDeletingId(id);
    try {
      const resp = await fetch(`${BASE_URL}/tareas/${id}`, { method: "DELETE" });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `Error ${resp.status}`);
      }
      setServicios((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "No se pudo eliminar.";
      Alert.alert("Error", mensaje);
    } finally {
      setDeletingId(null);
    }
  };

  const crearServicio = async () => {
    if (!nuevoServicio.title.trim() || !nuevoServicio.usuarioId) {
      Alert.alert("Faltan datos", "Titulo y usuario son obligatorios.");
      return;
    }
    setCreando(true);
    try {
      const resp = await fetch(`${BASE_URL}/tareas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: nuevoServicio.title.trim(),
          descripcion: nuevoServicio.descripcion.trim(),
          usuarioId: nuevoServicio.usuarioId,
          rolAsignado: "usuario",
          fecha: new Date(),
          direccion: nuevoServicio.direccion.trim(),
        }),
      });
      const txt = await resp.text();
      const data = safeJson(txt) || {};
      if (!resp.ok) {
        const mensaje = (data as any)?.message || `Error ${resp.status}`;
        throw new Error(mensaje);
      }
      setModalVisible(false);
      setNuevoServicio({ title: "", descripcion: "", direccion: "", usuarioId: "" });
      await cargarServicios();
      Alert.alert("Creada", "Solicitud agregada.");
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "No se pudo crear.";
      Alert.alert("Error", mensaje);
    } finally {
      setCreando(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={EstilosAdmin.listContainer}>
        <View style={{ marginBottom: 12 }}>
          <TouchableOpacity style={EstilosAdmin.button} onPress={() => setModalVisible(true)}>
            <Text style={EstilosAdmin.buttonText}>Crear nuevo servicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[EstilosAdmin.button, { marginTop: 8 }]} onPress={cargarServicios}>
            <Text style={EstilosAdmin.buttonText}>Recargar servicios</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1ABC9C" />
        ) : (
          <>
            {servicios.map((s) => (
              <View key={s.id} style={EstilosAdmin.card}>
                <View style={EstilosAdmin.row}>
                  <Text style={EstilosAdmin.label}>Titulo</Text>
                  <TextInput
                    style={EstilosAdmin.input}
                    value={s.title}
                    onChangeText={(val) => actualizarCampo(s.id, "title", val)}
                  />
                </View>
                <View style={EstilosAdmin.row}>
                  <Text style={EstilosAdmin.label}>Descripcion</Text>
                  <TextInput
                    style={EstilosAdmin.input}
                    value={s.descripcion || ""}
                    onChangeText={(val) => actualizarCampo(s.id, "descripcion", val)}
                  />
                </View>
                <View style={EstilosAdmin.row}>
                  <Text style={EstilosAdmin.label}>Direccion</Text>
                  <TextInput
                    style={EstilosAdmin.input}
                    value={s.direccion || ""}
                    onChangeText={(val) => actualizarCampo(s.id, "direccion", val)}
                  />
                </View>
                <View style={EstilosAdmin.row}>
                  <Text style={EstilosAdmin.label}>Estado</Text>
                  <Picker
                    selectedValue={s.estado || "pendiente"}
                    onValueChange={(val) => actualizarCampo(s.id, "estado", val as string)}
                    style={{ backgroundColor: "#1b1b20", color: "#e8e8e8" }}
                  >
                    {estados.map((e) => (
                      <Picker.Item key={e.value} label={e.label} value={e.value} />
                    ))}
                  </Picker>
                </View>
                <View style={EstilosAdmin.row}>
                  <Text style={EstilosAdmin.label}>Tecnico</Text>
                  <Picker
                    selectedValue={s.tecnicoId || ""}
                    onValueChange={(val) => actualizarCampo(s.id, "tecnicoId", val as string)}
                    style={{ backgroundColor: "#1b1b20", color: "#e8e8e8" }}
                  >
                    <Picker.Item label="Sin tecnico" value="" />
                    {tecnicos.map((t) => (
                      <Picker.Item key={t.id} label={t.nombre || t.correo} value={t.id} />
                    ))}
                  </Picker>
                </View>
                <Text style={EstilosAdmin.roleText}>
                  Usuario: {s.usuarioId && userMap[s.usuarioId] ? userMap[s.usuarioId].correo : s.usuarioId || "N/D"}
                </Text>
                <Text style={EstilosAdmin.roleText}>
                  Tecnico asignado:{" "}
                  {s.tecnicoId && userMap[s.tecnicoId]
                    ? `${userMap[s.tecnicoId].nombre || "Tecnico"} (${userMap[s.tecnicoId].correo})`
                    : "Sin tecnico"}
                </Text>
                <TouchableOpacity
                  style={[EstilosAdmin.button, { marginTop: 8, backgroundColor: "#4895ef" }]}
                  onPress={() => guardarServicio(s)}
                  disabled={savingId === s.id}
                >
                  {savingId === s.id ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={EstilosAdmin.buttonText}>Guardar cambios</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[EstilosAdmin.button, { marginTop: 8, backgroundColor: "#f72585" }]}
                  onPress={() => eliminarServicio(s.id)}
                  disabled={deletingId === s.id}
                >
                  {deletingId === s.id ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={EstilosAdmin.buttonText}>Eliminar</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
            {servicios.length === 0 ? (
              <View style={EstilosAdmin.placeholder}>
                <Text style={EstilosAdmin.placeholderText}>No hay servicios registrados.</Text>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>

      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={Estilos.modal}>
          <View style={Estilos.mc}>
            <Text style={Estilos.sub}>Nuevo servicio</Text>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Titulo</Text>
              <TextInput
                style={EstilosAdmin.input}
                value={nuevoServicio.title}
                onChangeText={(val) => setNuevoServicio((prev) => ({ ...prev, title: val }))}
              />
            </View>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Descripcion</Text>
              <TextInput
                style={EstilosAdmin.input}
                value={nuevoServicio.descripcion}
                onChangeText={(val) => setNuevoServicio((prev) => ({ ...prev, descripcion: val }))}
              />
            </View>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Direccion</Text>
              <TextInput
                style={EstilosAdmin.input}
                value={nuevoServicio.direccion}
                onChangeText={(val) => setNuevoServicio((prev) => ({ ...prev, direccion: val }))}
              />
            </View>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Usuario</Text>
              <Picker
                selectedValue={nuevoServicio.usuarioId}
                onValueChange={(val) => setNuevoServicio((prev) => ({ ...prev, usuarioId: val as string }))}
                style={{ backgroundColor: "#1b1b20", color: "#e8e8e8" }}
              >
                <Picker.Item label="Selecciona un usuario" value="" />
                {usuarios.map((u) => (
                  <Picker.Item key={u.id} label={u.nombre || u.correo} value={u.id} />
                ))}
              </Picker>
            </View>
            <View style={EstilosAdmin.row}>
              <TouchableOpacity style={EstilosAdmin.button} onPress={crearServicio} disabled={creando}>
                {creando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={EstilosAdmin.buttonText}>Crear</Text>}
              </TouchableOpacity>
              <TouchableOpacity
                style={[EstilosAdmin.button, { backgroundColor: "#f72585" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={EstilosAdmin.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
