import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { StackNavigation } from "./App";
import Estilos from "./Estilos/Estilos";
import formularios from "./Estilos/Formularios";
import EstilosAdmin from "./Estilos/Admin";
import { AdminUser, useAdminUsuarios } from "../Page/Admin";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://api-appless.vercel.app";
const STORAGE_KEY = "SB_USER_SESSION";

type Seccion = "usuarios" | "servicios" | "tecnicos" | "solicitudes";

interface SolicitudAdmin {
  id: string;
  title: string;
  descripcion?: string;
  estado?: string;
  usuarioId?: string;
  tecnicoId?: string;
  tecnicoCorreo?: string;
  fecha?: Date;
  direccion?: string;
  rolAsignado?: string;
}

export default function Admin() {
  const navigation = useNavigation<StackNavigation>();
  const { usuarios, setUsuarios, loading, savingId, recargar, guardarUsuario } = useAdminUsuarios();
  const [autorizado, setAutorizado] = useState(false);
  const [checking, setChecking] = useState(true);
  const [seccion, setSeccion] = useState<Seccion>("usuarios");
  const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);
  const [asignaciones, setAsignaciones] = useState<Record<string, string>>({});
  const [asignandoId, setAsignandoId] = useState<string | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const [savingSolicitudId, setSavingSolicitudId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [modalServicio, setModalServicio] = useState(false);
  const [nuevoServicio, setNuevoServicio] = useState({
    title: "",
    descripcion: "",
    direccion: "",
    usuarioId: "",
  });
  const [creandoServicio, setCreandoServicio] = useState(false);

  const tecnicos = useMemo(
    () => usuarios.filter((u) => (u.rol || "").toLowerCase() === "tecnico"),
    [usuarios]
  );
  const usuariosFiltrados = useMemo(
    () => usuarios.filter((u) => (u.rol || "").toLowerCase() !== "tecnico"),
    [usuarios]
  );
  const userMap = useMemo(() => {
    const map: Record<string, AdminUser> = {};
    usuarios.forEach((u) => {
      map[u.id] = u;
    });
    return map;
  }, [usuarios]);

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    navigation.replace("Inicio");
  };

  useEffect(() => {
    AsyncStorage.getItem("SB_USER_SESSION")
      .then((raw) => {
        if (!raw) {
          navigation.replace("Inicio");
          return;
        }
        const sess = JSON.parse(raw);
        if (sess?.esAdmin) {
          setAutorizado(true);
        } else {
          navigation.replace("Inicio");
        }
      })
      .finally(() => setChecking(false));
  }, [navigation]);

  const actualizarCampo = (id: string, campo: keyof AdminUser, valor: string) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [campo]: valor } : u))
    );
  };

  const onGuardar = async (user: AdminUser) => {
    try {
      await guardarUsuario(user);
      Alert.alert("Guardado", "Usuario actualizado correctamente.");
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al actualizar.";
      Alert.alert("Error", mensaje);
    }
  };

  const cargarSolicitudes = useCallback(async () => {
    setLoadingSolicitudes(true);
    try {
      const resp = await fetch(`${BASE_URL}/tareas-tecnico`);
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
      const arr = (Array.isArray(data) ? data : data?.tareas || []).map((t: any) => {
        const fecha = t.fecha || t.createdAt;
        const parsed = fecha ? new Date(fecha) : undefined;
        return {
          id: t.id || t._id || "",
          title: t.titulo || t.descripcion || "Sin titulo",
          descripcion: t.descripcion,
          estado: t.estado || "pendiente",
          usuarioId: t.usuarioId || t.userId,
          tecnicoId: t.tecnicoId,
          tecnicoCorreo: t.tecnicoCorreo,
          fecha: parsed,
          direccion: t.direccion,
        } as SolicitudAdmin;
      });
      setSolicitudes(arr);
    } catch (err) {
      setSolicitudes([]);
      const mensaje = err instanceof Error ? err.message : "No se pudieron cargar las solicitudes.";
      Alert.alert("Solicitudes", mensaje);
    } finally {
      setLoadingSolicitudes(false);
    }
  }, []);

  const handleRecargar = useCallback(() => {
    recargar();
    cargarSolicitudes();
  }, [recargar, cargarSolicitudes]);

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  const actualizarSolicitudCampo = (id: string, campo: keyof SolicitudAdmin, valor: string) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [campo]: valor } : s))
    );
  };

  const crearServicio = async () => {
    if (!nuevoServicio.title.trim() || !nuevoServicio.usuarioId) {
      Alert.alert("Faltan datos", "Titulo y usuario son obligatorios.");
      return;
    }
    setCreandoServicio(true);
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
      let data: any = {};
      try {
        data = txt ? JSON.parse(txt) : {};
      } catch {
        data = { message: txt };
      }
      if (!resp.ok) {
        throw new Error(data?.message || `Error ${resp.status}`);
      }
      const tarea = data.tarea || data;
      setSolicitudes((prev) => [
        {
          id: tarea.id || tarea._id || "",
          title: tarea.titulo || nuevoServicio.title,
          descripcion: tarea.descripcion || nuevoServicio.descripcion,
          usuarioId: tarea.usuarioId || nuevoServicio.usuarioId,
          rolAsignado: tarea.rolAsignado,
          estado: tarea.estado || "pendiente",
          direccion: tarea.direccion || nuevoServicio.direccion,
        },
        ...prev,
      ]);
      setNuevoServicio({ title: "", descripcion: "", direccion: "", usuarioId: "" });
      Alert.alert("Creada", "Solicitud agregada.");
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "No se pudo crear.";
      Alert.alert("Error", mensaje);
    } finally {
      setCreandoServicio(false);
    }
  };

  const guardarSolicitud = async (s: SolicitudAdmin) => {
    setSavingSolicitudId(s.id);
    try {
      const resp = await fetch(`${BASE_URL}/tareas/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: s.title,
          descripcion: s.descripcion,
          estado: s.estado,
          tecnicoId: s.tecnicoId,
          tecnicoCorreo: s.tecnicoCorreo,
          direccion: s.direccion,
          fecha: s.fecha,
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
      const tarea = data.tarea || data;
      setSolicitudes((prev) =>
        prev.map((sol) =>
          sol.id === s.id
            ? {
                ...sol,
                title: tarea.titulo || sol.title,
                descripcion: tarea.descripcion ?? sol.descripcion,
                estado: tarea.estado ?? sol.estado,
                tecnicoId: tarea.tecnicoId ?? sol.tecnicoId,
                tecnicoCorreo: tarea.tecnicoCorreo ?? sol.tecnicoCorreo,
                direccion: tarea.direccion ?? sol.direccion,
              }
            : sol
        )
      );
      Alert.alert("Guardado", "Solicitud actualizada.");
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "No se pudo actualizar.";
      Alert.alert("Error", mensaje);
    } finally {
      setSavingSolicitudId(null);
    }
  };

  const asignarTecnico = async (solicitudId: string) => {
    const tecnicoId = asignaciones[solicitudId];
    const tecnico = tecnicos.find((t) => t.id === tecnicoId);
    if (!tecnico) {
      Alert.alert("Selecciona un tecnico", "Elige un tecnico para asignar la solicitud.");
      return;
    }
    setAsignandoId(solicitudId);
    try {
      const resp = await fetch(`${BASE_URL}/tareas/${solicitudId}/aceptar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tecnicoId: tecnico.id,
          tecnicoCorreo: tecnico.correo,
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
      const tarea = data.tarea || data;
      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id === solicitudId
            ? {
                ...s,
                tecnicoId: tecnico.id,
                tecnicoCorreo: tecnico.correo,
                estado: tarea.estado || "asignada",
              }
            : s
        )
      );
      Alert.alert("Asignado", `Solicitud asignada a ${tecnico.nombre || tecnico.correo}.`);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "No se pudo asignar.";
      Alert.alert("Error", mensaje);
    } finally {
      setAsignandoId(null);
    }
  };

  const eliminarSolicitud = async (id: string) => {
    setEliminandoId(id);
    try {
      const resp = await fetch(`${BASE_URL}/tareas/${id}`, { method: "DELETE" });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `Error ${resp.status}`);
      }
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "No se pudo eliminar.";
      Alert.alert("Error", mensaje);
    } finally {
      setEliminandoId(null);
    }
  };

  if (checking) {
    return (
      <View style={[Estilos.container, Estilos.centered]}>
        <ActivityIndicator size="large" color="#1ABC9C" />
      </View>
    );
  }

  if (!autorizado) {
    return null;
  }

  const renderUsuarios = () => {
    if (loading) return <ActivityIndicator size="large" color="#1ABC9C" />;
    return (
      <ScrollView style={EstilosAdmin.listContainer}>
        {usuariosFiltrados.map((u) => (
          <View key={u.id} style={EstilosAdmin.card}>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Nombre</Text>
              <TextInput
                style={EstilosAdmin.input}
                value={u.nombre}
                onChangeText={(t) => actualizarCampo(u.id, "nombre", t)}
              />
            </View>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Correo</Text>
              <TextInput
                style={EstilosAdmin.input}
                value={u.correo}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(t) => actualizarCampo(u.id, "correo", t)}
              />
            </View>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Telefono</Text>
              <TextInput
                style={EstilosAdmin.input}
                value={u.telefono}
                keyboardType="phone-pad"
                onChangeText={(t) => actualizarCampo(u.id, "telefono", t)}
              />
            </View>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Rol (usuario, tecnico, admin)</Text>
              <TextInput
                style={EstilosAdmin.input}
                value={u.rol}
                autoCapitalize="none"
                onChangeText={(t) => actualizarCampo(u.id, "rol", t)}
              />
              <Text style={EstilosAdmin.roleText}>Se guarda en minusculas.</Text>
            </View>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Foto (URL)</Text>
              <TextInput
                style={EstilosAdmin.input}
                value={u.foto}
                autoCapitalize="none"
                onChangeText={(t) => actualizarCampo(u.id, "foto", t)}
                placeholder="Foto de perfil"
              />
            </View>
            <TouchableOpacity
              style={EstilosAdmin.button}
              onPress={() => onGuardar(u)}
              disabled={savingId === u.id}
            >
              {savingId === u.id ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={EstilosAdmin.buttonText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderTecnicos = () => {
    if (loading) return <ActivityIndicator size="large" color="#1ABC9C" />;
    return (
      <ScrollView style={EstilosAdmin.listContainer}>
        {tecnicos.map((t) => (
          <View key={t.id} style={EstilosAdmin.card}>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Nombre</Text>
              <TextInput
                style={EstilosAdmin.input}
                value={t.nombre}
                onChangeText={(val) => actualizarCampo(t.id, "nombre", val)}
              />
            </View>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Correo</Text>
              <TextInput
                style={EstilosAdmin.input}
                value={t.correo}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(val) => actualizarCampo(t.id, "correo", val)}
              />
            </View>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Telefono</Text>
              <TextInput
                style={EstilosAdmin.input}
                value={t.telefono}
                keyboardType="phone-pad"
                onChangeText={(val) => actualizarCampo(t.id, "telefono", val)}
              />
            </View>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Rol</Text>
              <TextInput
                style={EstilosAdmin.input}
                value={t.rol}
                autoCapitalize="none"
                onChangeText={(val) => actualizarCampo(t.id, "rol", val)}
              />
              <Text style={EstilosAdmin.roleText}>Debe ser tecnico/usuario/admin.</Text>
            </View>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Foto (URL)</Text>
              <TextInput
                style={EstilosAdmin.input}
                value={t.foto}
                autoCapitalize="none"
                onChangeText={(val) => actualizarCampo(t.id, "foto", val)}
                placeholder="https://..."
              />
            </View>
            <TouchableOpacity
              style={EstilosAdmin.button}
              onPress={() => onGuardar(t)}
              disabled={savingId === t.id}
            >
              {savingId === t.id ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={EstilosAdmin.buttonText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
        {tecnicos.length === 0 ? (
          <View style={EstilosAdmin.placeholder}>
            <Text style={EstilosAdmin.placeholderText}>No hay tecnicos registrados.</Text>
          </View>
        ) : null}
      </ScrollView>
    );
  };

  const renderSolicitudes = () => {
    if (loadingSolicitudes) return <ActivityIndicator size="large" color="#1ABC9C" />;
    return (
      <ScrollView style={EstilosAdmin.listContainer}>
        {solicitudes.map((s) => (
          <View key={s.id} style={EstilosAdmin.card}>
            <Text style={EstilosAdmin.label}>{s.title}</Text>
            {s.descripcion ? <Text style={EstilosAdmin.roleText}>{s.descripcion}</Text> : null}
            {s.direccion ? <Text style={EstilosAdmin.roleText}>{s.direccion}</Text> : null}
            <Text style={EstilosAdmin.roleText}>Estado: {s.estado || "pendiente"}</Text>
            <Text style={EstilosAdmin.roleText}>
              Usuario: {s.usuarioId && userMap[s.usuarioId] ? userMap[s.usuarioId].correo : s.usuarioId || "N/D"}
            </Text>
            <Text style={EstilosAdmin.roleText}>
              Tecnico:{" "}
              {s.tecnicoId && userMap[s.tecnicoId]
                ? `${userMap[s.tecnicoId].nombre || "Tecnico"} (${userMap[s.tecnicoId].correo})`
                : s.tecnicoCorreo || "Sin tecnico"}
            </Text>
            <View style={EstilosAdmin.row}>
              <Text style={EstilosAdmin.label}>Asignar tecnico</Text>
              <Picker
                selectedValue={asignaciones[s.id] || ""}
                onValueChange={(val) =>
                  setAsignaciones((prev) => ({
                    ...prev,
                    [s.id]: val,
                  }))
                }
                style={{ backgroundColor: "#1b1b20", color: "#e8e8e8" }}
              >
                <Picker.Item label="Selecciona" value="" />
                {tecnicos.map((t) => (
                  <Picker.Item key={t.id} label={t.nombre || t.correo} value={t.id} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={EstilosAdmin.button}
              onPress={() => asignarTecnico(s.id)}
              disabled={asignandoId === s.id}
            >
              {asignandoId === s.id ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={EstilosAdmin.buttonText}>Asignar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[EstilosAdmin.button, { marginTop: 8, backgroundColor: "#f72585" }]}
              onPress={() => eliminarSolicitud(s.id)}
              disabled={eliminandoId === s.id}
            >
              {eliminandoId === s.id ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={EstilosAdmin.buttonText}>Eliminar</Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
        {solicitudes.length === 0 ? (
          <View style={EstilosAdmin.placeholder}>
            <Text style={EstilosAdmin.placeholderText}>No hay solicitudes.</Text>
          </View>
        ) : null}
      </ScrollView>
    );
  };

  return (
    <View style={Estilos.container}>
      <View style={[Estilos.rowBetween, EstilosAdmin.header]}>
        <TouchableOpacity onPress={cerrarSesion}>
          <Text style={formularios.text}>Cerrar sesion</Text>
        </TouchableOpacity>
        <View style={Estilos.rowCenter}>
          <Text style={[formularios.text, { marginRight: 12 }]}>Panel Admin</Text>
          <TouchableOpacity onPress={handleRecargar}>
            <Text style={formularios.text}>Recargar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => setSidebarVisible((v) => !v)}>
        <Text style={EstilosAdmin.title}>{sidebarVisible ? "Ocultar menu" : "Menu"}</Text>
      </TouchableOpacity>
      <View style={EstilosAdmin.smallGap} />

      <View style={EstilosAdmin.layout}>
        {sidebarVisible ? (
          <View style={EstilosAdmin.sidebar}>
            <TouchableOpacity
              style={[EstilosAdmin.navButton, seccion === "usuarios" && EstilosAdmin.navButtonActive]}
              onPress={() => setSeccion("usuarios")}
            >
              <Text
                style={[
                  EstilosAdmin.navButtonText,
                  seccion === "usuarios" && EstilosAdmin.navButtonTextActive,
                ]}
              >
                Usuarios
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[EstilosAdmin.navButton, seccion === "servicios" && EstilosAdmin.navButtonActive]}
              onPress={() => setSeccion("servicios")}
            >
              <Text
                style={[
                  EstilosAdmin.navButtonText,
                  seccion === "servicios" && EstilosAdmin.navButtonTextActive,
                ]}
              >
                Servicios
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[EstilosAdmin.navButton, seccion === "tecnicos" && EstilosAdmin.navButtonActive]}
              onPress={() => setSeccion("tecnicos")}
            >
              <Text
                style={[
                  EstilosAdmin.navButtonText,
                  seccion === "tecnicos" && EstilosAdmin.navButtonTextActive,
                ]}
              >
                Tecnicos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[EstilosAdmin.navButton, seccion === "solicitudes" && EstilosAdmin.navButtonActive]}
              onPress={() => setSeccion("solicitudes")}
            >
              <Text
                style={[
                  EstilosAdmin.navButtonText,
                  seccion === "solicitudes" && EstilosAdmin.navButtonTextActive,
                ]}
              >
                Solicitudes
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={[EstilosAdmin.content, sidebarVisible ? null : { marginLeft: 0 }]}>
          {seccion === "usuarios" ? renderUsuarios() : null}
          {seccion === "servicios" ? (
            <>
              <ScrollView style={EstilosAdmin.listContainer}>
                <View style={{ marginBottom: 12 }}>
                  <TouchableOpacity style={EstilosAdmin.button} onPress={() => setModalServicio(true)}>
                    <Text style={EstilosAdmin.buttonText}>Crear nueva solicitud</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[EstilosAdmin.button, { marginTop: 8 }]}
                    onPress={handleRecargar}
                  >
                    <Text style={EstilosAdmin.buttonText}>Recargar</Text>
                  </TouchableOpacity>
                </View>
                {solicitudes.map((s) => (
                  <View key={s.id} style={EstilosAdmin.card}>
                    <View style={EstilosAdmin.row}>
                      <Text style={EstilosAdmin.label}>Titulo</Text>
                      <TextInput
                        style={EstilosAdmin.input}
                        value={s.title}
                        onChangeText={(val) => actualizarSolicitudCampo(s.id, "title", val)}
                      />
                    </View>
                    <View style={EstilosAdmin.row}>
                      <Text style={EstilosAdmin.label}>Descripcion</Text>
                      <TextInput
                        style={EstilosAdmin.input}
                        value={s.descripcion || ""}
                        onChangeText={(val) => actualizarSolicitudCampo(s.id, "descripcion", val)}
                      />
                    </View>
                    <View style={EstilosAdmin.row}>
                      <Text style={EstilosAdmin.label}>Direccion</Text>
                      <TextInput
                        style={EstilosAdmin.input}
                        value={s.direccion || ""}
                        onChangeText={(val) => actualizarSolicitudCampo(s.id, "direccion", val)}
                      />
                    </View>
                    <View style={EstilosAdmin.row}>
                      <Text style={EstilosAdmin.label}>Estado</Text>
                      <Picker
                        selectedValue={s.estado || "pendiente"}
                        onValueChange={(val) => actualizarSolicitudCampo(s.id, "estado", val as string)}
                        style={{ backgroundColor: "#1b1b20", color: "#e8e8e8" }}
                      >
                        <Picker.Item label="Pendiente" value="pendiente" />
                        <Picker.Item label="Asignada" value="asignada" />
                        <Picker.Item label="Aceptada" value="aceptada" />
                        <Picker.Item label="Completada" value="completada" />
                      </Picker>
                    </View>
                    <Text style={EstilosAdmin.roleText}>
                      Usuario: {s.usuarioId && userMap[s.usuarioId] ? userMap[s.usuarioId].correo : s.usuarioId || "N/D"}
                    </Text>
                    <TouchableOpacity
                      style={[EstilosAdmin.button, { marginTop: 8, backgroundColor: "#4895ef" }]}
                      onPress={() => guardarSolicitud(s)}
                      disabled={savingSolicitudId === s.id}
                    >
                      {savingSolicitudId === s.id ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={EstilosAdmin.buttonText}>Guardar cambios</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[EstilosAdmin.button, { marginTop: 8, backgroundColor: "#f72585" }]}
                      onPress={() => eliminarSolicitud(s.id)}
                      disabled={eliminandoId === s.id}
                    >
                      {eliminandoId === s.id ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={EstilosAdmin.buttonText}>Eliminar</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : null}
          {seccion === "tecnicos" ? renderTecnicos() : null}
          {seccion === "solicitudes" ? renderSolicitudes() : null}
        </View>
      </View>

      <Modal transparent animationType="fade" visible={modalServicio} onRequestClose={() => setModalServicio(false)}>
        <View style={Estilos.modal}>
          <View style={Estilos.mc}>
            <Text style={Estilos.sub}>Nueva solicitud</Text>
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
                {usuariosFiltrados.map((u) => (
                  <Picker.Item key={u.id} label={u.nombre || u.correo} value={u.id} />
                ))}
              </Picker>
            </View>
            <View style={EstilosAdmin.row}>
              <TouchableOpacity style={EstilosAdmin.button} onPress={crearServicio} disabled={creandoServicio}>
                {creandoServicio ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={EstilosAdmin.buttonText}>Crear</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={[EstilosAdmin.button, { backgroundColor: "#f72585" }]} onPress={() => setModalServicio(false)}>
                <Text style={EstilosAdmin.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
