import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import estilos from "../Componentes/Estilos/Estilos";
import RenderItem from "../Page/RenderItem";
import DateTimePicker from "@react-native-community/datetimepicker";
import PushNotification from "react-native-push-notification";
import formularios from "./Estilos/Formularios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";

type Rol = "usuario" | "tecnico" | "admin";

interface PeticionServicio {
  id: string;
  title: string;
  done: boolean;
  date?: Date;
  notificationId?: string;
  rolAsignado?: Rol;
  usuarioId?: string;
  descripcion?: string;
  estado?: string;
  tecnicoId?: string;
  tecnicoCorreo?: string;
}

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

const STORAGE_KEY = "SB_USER_SESSION";
const BASE_URL = "https://api-appless.vercel.app";

export default function PeticionesServicioScreen({ navigation }: any) {
  const [descripcion, setDescripcion] = useState("");
  const [solicitudes, setSolicitudes] = useState<PeticionServicio[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [modalOn, setModalOn] = useState(false);
  const [tipoServicio, setTipoServicio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<UserSession | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  function alertaError(err: unknown, titulo = "Error") {
    const mensaje = err instanceof Error ? err.message : "Algo salio mal con la peticion.";
    Alert.alert(titulo, mensaje);
  }

  async function cargarSesion(): Promise<UserSession | null> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      return null;
    }
  }

  async function fetchSolicitudes(usuarioId: string) {
    const resp = await fetch(`${BASE_URL}/tareas/${usuarioId}`);
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
    const arr = (Array.isArray(data) ? data : data?.tareas || []).map((t: any) => ({
      id: t.id || t._id,
      title: t.titulo || t.descripcion || "Sin titulo",
      descripcion: t.descripcion,
      done: false,
      date: t.createdAt ? new Date(t.createdAt) : new Date(),
      rolAsignado: t.rolAsignado || t.rol || "usuario",
      usuarioId: t.usuarioId || t.userId,
      estado: t.estado,
      tecnicoId: t.tecnicoId,
      tecnicoCorreo: t.tecnicoCorreo,
    }));
    return arr as PeticionServicio[];
  }

  async function nuevaSolicitud(opts: {
    titulo: string;
    descripcion?: string;
    usuarioId: string;
    rolAsignado: Rol;
    fecha: Date;
  }) {
    const resp = await fetch(`${BASE_URL}/tareas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: opts.titulo.trim(),
        descripcion: opts.descripcion?.trim() || undefined,
        usuarioId: opts.usuarioId,
        rolAsignado: opts.rolAsignado,
        fecha: opts.fecha,
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
    const t = data.tarea || data;
    return {
      id: t.id || t._id,
      titulo: t.titulo || opts.titulo,
      descripcion: t.descripcion || opts.descripcion,
      usuarioId: t.usuarioId || opts.usuarioId,
      rolAsignado: t.rolAsignado || opts.rolAsignado,
    };
  }

  async function inicializar() {
    try {
      setLoading(true);
      const sess = await cargarSesion();
      if (!sess) {
        Alert.alert("Sesión requerida", "Por favor inicia sesión.", [
          { text: "Ok", onPress: () => navigation.replace("Inicio") },
        ]);
        return;
      }
      setUsuario(sess);
      const lista = await fetchSolicitudes(sess.id);
      setSolicitudes(lista);
    } catch (err) {
      alertaError(err, "No se pudo cargar solicitudes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    PushNotification.configure({
      onNotification: () => {},
      requestPermissions: Platform.OS === "ios",
    });
    PushNotification.createChannel(
      {
        channelId: "task-reminders",
        channelName: "Recordatorio de tareas",
        channelDescription: "Notificaciones programadas",
        playSound: true,
        importance: 4,
        vibrate: true,
      },
      () => {}
    );
    inicializar();
  }, []);

  function scheduleNotif(s: PeticionServicio): string | undefined {
    if (!s.date) return;
    const ahora = new Date();
    if (s.date > ahora) {
      const nid = Math.floor(Math.random() * 1000000).toString();
      PushNotification.localNotificationSchedule({
        id: nid,
        channelId: "task-reminders",
        title: "Recordatorio",
        message: `Hora de: ${s.title}`,
        date: s.date,
        allowWhileIdle: true,
      });
      return nid;
    }
  }

  function cancelarNotif(id: string) {
    PushNotification.cancelLocalNotification(id);
  }

  function onDateChange(ev: any, d?: Date) {
    if (Platform.OS !== "ios") setShowDate(false);
    if (ev?.type === "set" && d) {
      const nueva = new Date(d);
      nueva.setHours(fechaSeleccionada.getHours(), fechaSeleccionada.getMinutes());
      setFechaSeleccionada(nueva);
      setShowTime(true);
    }
  }

  function onTimeChange(ev: any, t?: Date) {
    if (Platform.OS !== "ios") setShowTime(false);
    if (ev?.type === "set" && t) {
      const ahora = new Date();
      const nueva = new Date(fechaSeleccionada);
      nueva.setHours(t.getHours());
      nueva.setMinutes(t.getMinutes());
      const mismaFecha = fechaSeleccionada.toDateString() === ahora.toDateString();
      if (mismaFecha && nueva < ahora) {
        Alert.alert("Hora inválida", "No puedes elegir una hora pasada.");
        return;
      }
      setFechaSeleccionada(nueva);
    }
  }

  function agregarSolicitud() {
    if (!usuario) {
      Alert.alert("Sesión requerida", "Inicia sesión para solicitar servicio.");
      navigation.replace("Inicio");
      return;
    }
    if (descripcion.trim() === "") {
      Alert.alert("Falta información", "Escribe una descripción del servicio.");
      return;
    }

    const base = descripcion.trim();
    const titulo = tipoServicio ? `${tipoServicio}: ${base}` : base;
    const rolAsignado: Rol = "usuario";

    nuevaSolicitud({
      titulo,
      descripcion: base,
      usuarioId: usuario.id,
      rolAsignado,
      fecha: fechaSeleccionada,
    })
      .then((tarea) => {
        const nueva: PeticionServicio = {
          id: tarea.id,
          title: tarea.titulo,
          descripcion: tarea.descripcion,
          done: false,
          date: fechaSeleccionada,
          rolAsignado: tarea.rolAsignado || rolAsignado,
          usuarioId: tarea.usuarioId,
        };
        const nid = scheduleNotif(nueva);
        if (nid) nueva.notificationId = nid;

        const copia = solicitudes.slice();
        copia.push(nueva);
        setSolicitudes(copia);

        setDescripcion("");
        setFechaSeleccionada(new Date());
        setModalOn(false);
        setTipoServicio(null);
      })
      .catch((err) => alertaError(err, "No se pudo crear la solicitud"));
  }

  function toggleDone(item: PeticionServicio) {
    const nuevoArray = solicitudes.map((t) => {
      if (t.id === item.id) {
        const u = { ...t, done: !t.done };

        if (u.done && u.notificationId) {
          cancelarNotif(u.notificationId);
          u.notificationId = undefined;
        } else if (!u.done) {
          const nid = scheduleNotif(u);
          if (nid) u.notificationId = nid;
        }
        return u;
      }
      return t;
    });
    setSolicitudes(nuevoArray);
  }

  function eliminarItem(item: PeticionServicio) {
    Alert.alert("Confirmar", "¿Eliminar solicitud?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          if (item.notificationId) cancelarNotif(item.notificationId);
          const filtrado = solicitudes.filter((t) => t.id !== item.id);
          setSolicitudes(filtrado);
        },
      },
    ]);
  }

  const solicitudesOrdenadas = useMemo(() => {
    return [...solicitudes].sort((a, b) => {
      const da = a.date ? +a.date : 0;
      const db = b.date ? +b.date : 0;
      return da - db;
    });
  }, [solicitudes]);

  async function cerrarSesion() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    navigation.replace("Inicio");
  }

  function renderAvatar() {
    const uri = usuario?.foto;
    if (uri) {
      return (
        <Image
          source={{ uri }}
          style={estilos.avatar}
        />
      );
    }
    const inicial =
      usuario?.usuario?.[0]?.toUpperCase() ||
      usuario?.correo?.[0]?.toUpperCase() ||
      "U";
    return (
      <View style={estilos.avatarFallback}>
        <Text style={estilos.avatarInitial}>{inicial}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[estilos.container, estilos.centered]}>
        <ActivityIndicator size="large" color="#1ABC9C" />
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.rowBetween}>
        <View style={estilos.rowCenter}>
          <TouchableOpacity onPress={() => setShowMenu((v) => !v)}>{renderAvatar()}</TouchableOpacity>
          <Text style={[formularios.text, estilos.userLabel]} numberOfLines={1}>
            {usuario?.usuario || usuario?.correo || "Usuario"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Inicio")}>
          <Text style={formularios.text}>{"<- Volver"}</Text>
        </TouchableOpacity>
      </View>
      {showMenu ? (
        <View style={estilos.menuContainer}>
          <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate("Perfil"); }}>
            <Text style={formularios.text}>Perfil</Text>
          </TouchableOpacity>
          {usuario?.esAdmin ? (
            <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate("Admin"); }}>
              <Text style={formularios.text}>Admin</Text>
            </TouchableOpacity>
          ) : null}
          {usuario?.esTecnico ? (
            <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate("SolicitudesTecnico"); }}>
              <Text style={formularios.text}>Solicitudes tecnico</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => { setShowMenu(false); cerrarSesion(); }}>
            <Text style={formularios.text}>Cerrar sesion</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Text style={estilos.title}>Solicitar Servicio</Text>

      <View style={estilos.inputcontainer}>
        <View style={estilos.fila}>
          <TouchableOpacity style={estilos.boton} onPress={() => { setTipoServicio("Fontaneria"); setModalOn(true); }}>
            <Text style={estilos.textB}>Fontanería</Text>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.boton} onPress={() => { setTipoServicio("Electricidad"); setModalOn(true); }}>
            <Text style={estilos.textB}>Electricidad</Text>
          </TouchableOpacity>
        </View>

        <View style={estilos.fila}>
          <TouchableOpacity style={estilos.boton} onPress={() => { setTipoServicio("Carpinteria"); setModalOn(true); }}>
            <Text style={estilos.textB}>Carpintería</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.boton} onPress={() => { setTipoServicio("Albanileria"); setModalOn(true); }}>
            <Text style={estilos.textB}>Albañilería</Text>
          </TouchableOpacity>
        </View>
        <View style={estilos.fila}>
          <TouchableOpacity style={estilos.boton} onPress={() => { setTipoServicio("Mecanica"); setModalOn(true); }}>
            <Text style={estilos.textB}>Mecánica</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.boton} onPress={() => { setTipoServicio("General"); setModalOn(true); }}>
            <Text style={estilos.textB}>General</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent animationType="slide" visible={modalOn} onRequestClose={() => setModalOn(false)}>
        <View style={estilos.modal}>
          <View style={estilos.mc}>
            <Text style={estilos.sub}>
              {tipoServicio ? `Solicitud: ${tipoServicio}` : "Nueva solicitud"}
            </Text>

            <TextInput
              placeholder="Describe el trabajo"
              style={estilos.inputmodal}
              value={descripcion}
              onChangeText={setDescripcion}
            />

            <TouchableOpacity onPress={() => setShowDate(true)} style={estilos.calendarioBoton || estilos.boton}>
              <Text style={estilos.fecha}>{fechaSeleccionada.toLocaleDateString("es-ES")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowTime(true)} style={estilos.calendarioBoton || estilos.boton}>
              <Text style={estilos.fecha}>{fechaSeleccionada.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</Text>
            </TouchableOpacity>

            <View style={estilos.botonesmo}>
              <TouchableOpacity style={estilos.boton} onPress={agregarSolicitud}>
                <Text style={estilos.textB}>Solicitar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={estilos.boton} onPress={() => setModalOn(false)}>
                <Text style={estilos.textB}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showDate && (
        <DateTimePicker
          value={fechaSeleccionada}
          mode="date"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={fechaSeleccionada}
          mode="time"
          onChange={onTimeChange}
          is24Hour={false}
          display="spinner"
        />
      )}

      <View style={estilos.listaContainer}>
        <Text style={estilos.sub}>Mis solicitudes ({solicitudes.length})</Text>
        <FlatList
          data={solicitudesOrdenadas}
          keyExtractor={(item, idx) => item.id + "-" + idx}
          renderItem={({ item }) => (
            <RenderItem
              item={item as any}
              onPress={() => toggleDone(item)}
              onDelete={() => eliminarItem(item)}
            />
          )}
        />
      </View>
    </View>
  );
}
