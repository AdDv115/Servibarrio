import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Estilos from "./Estilos/Estilos";
import EstilosSolicitudes from "./Estilos/Tecnico";
import {
  SolicitudTecnico,
  useSolicitudesTecnico,
} from "../Page/SolicitudesTecnico";
import { StackNavigation } from "./App";
import AsyncStorage from "@react-native-async-storage/async-storage";

const formatDate = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SolicitudItem = ({
  item,
  onAccept,
}: {
  item: SolicitudTecnico;
  onAccept: (id: string) => Promise<void> | void;
}) => {
  const statusStyle = item.accepted ? Estilos.statusDone : Estilos.statusPending;
  const statusLabel = item.estado
    ? item.estado.charAt(0).toUpperCase() + item.estado.slice(1)
    : item.accepted
    ? "Aceptada"
    : "Pendiente";

  return (
    <View style={EstilosSolicitudes.card}>
      <View style={Estilos.flex1}>
        <Text style={Estilos.text}>{item.title}</Text>
        <Text style={Estilos.dateText}>{formatDate(item.date)}</Text>
        <Text style={statusStyle}>{statusLabel}</Text>
        {item.tecnicoCorreo ? (
          <Text style={Estilos.dateText}>Tecnico: {item.tecnicoCorreo}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[
          EstilosSolicitudes.actionButton,
          item.accepted
            ? EstilosSolicitudes.buttonDisabled
            : EstilosSolicitudes.buttonPrimary,
        ]}
        disabled={item.accepted}
        onPress={() => onAccept(item.id)}
      >
        <Text style={EstilosSolicitudes.actionText}>
          {item.accepted ? "Tomada" : "Aceptar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default function SolicitudesTecnico() {
  const navigation = useNavigation<StackNavigation>();
  const { solicitudes, loading, aceptarSolicitud, recargarSolicitudes } =
    useSolicitudesTecnico();
  const [refreshing, setRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [usuario, setUsuario] = useState<{
    id: string;
    correo: string;
    foto?: string;
    esTecnico?: boolean;
    esAdmin?: boolean;
    usuario?: string;
  } | null>(null);

  const cargarSesionLocal = async () => {
    try {
      const raw = await AsyncStorage.getItem("SB_USER_SESSION");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setUsuario({
        id: parsed.id,
        correo: parsed.correo,
        foto: parsed.foto,
        esTecnico: parsed.esTecnico,
        esAdmin: parsed.esAdmin,
        usuario: parsed.usuario,
      });
    } catch {
      setUsuario(null);
    }
  };

  React.useEffect(() => {
    cargarSesionLocal();
  }, []);

  const handleBack = () => {
    navigation.replace("Inicio");
  };

  const renderAvatar = () => {
    const uri = usuario?.foto;
    if (uri) {
      return (
        <Image
          source={{ uri }}
          style={Estilos.avatar}
        />
      );
    }
    const inicial =
      usuario?.usuario?.[0]?.toUpperCase() ||
      usuario?.correo?.[0]?.toUpperCase() ||
      "U";
    return (
      <View style={Estilos.avatarFallback}>
        <Text style={Estilos.avatarInitial}>{inicial}</Text>
      </View>
    );
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem("SB_USER_SESSION");
    navigation.replace("Inicio");
  };

  const pendientes = useMemo(() => {
    return [...solicitudes].sort(
      (a, b) => +new Date(a.date) - +new Date(b.date)
    );
  }, [solicitudes]);

  const onRefresh = async () => {
    setRefreshing(true);
    await recargarSolicitudes();
    setRefreshing(false);
  };

  return (
    <View style={Estilos.container}>
      <View style={Estilos.rowBetween}>
        <TouchableOpacity onPress={() => setShowMenu((v) => !v)}>{renderAvatar()}</TouchableOpacity>
        <TouchableOpacity onPress={handleBack}>
          <Text style={Estilos.sub}>{"<- Volver"}</Text>
        </TouchableOpacity>
      </View>
      {showMenu ? (
        <View style={Estilos.menuContainer}>
          <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate("Perfil"); }}>
            <Text style={Estilos.sub}>Perfil</Text>
          </TouchableOpacity>
          {usuario?.esAdmin ? (
            <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate("Admin"); }}>
              <Text style={Estilos.sub}>Admin</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate("Tablero"); }}>
            <Text style={Estilos.sub}>Tablero</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setShowMenu(false); cerrarSesion(); }}>
            <Text style={Estilos.sub}>Cerrar sesion</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Text style={Estilos.title}>Solicitudes para tecnico</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1ABC9C" />
      ) : (
        <FlatList
          data={pendientes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SolicitudItem item={item} onAccept={aceptarSolicitud} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={EstilosSolicitudes.emptyState}>
              <Text style={Estilos.sub}>Sin solicitudes pendientes</Text>
              <Text style={Estilos.dateText}>
                Cuando los usuarios creen solicitudes, apareceran aqui.
              </Text>
            </View>
          }
          contentContainerStyle={
            pendientes.length === 0
              ? EstilosSolicitudes.emptyContainer
              : undefined
          }
        />
      )}
    </View>
  );
}
