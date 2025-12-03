import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Estilos from "./Estilos/Estilos";
import {
  SolicitudTecnico,
  useSolicitudesTecnico,
} from "../Page/SolicitudesTecnico";

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
  onAccept: (id: string) => void;
}) => {
  const statusStyle = item.accepted ? Estilos.statusDone : Estilos.statusPending;
  const statusLabel = item.accepted ? "Aceptada" : "Pendiente";

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={Estilos.text}>{item.title}</Text>
        <Text style={Estilos.dateText}>{formatDate(item.date)}</Text>
        <Text style={statusStyle}>{statusLabel}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          item.accepted ? styles.buttonDisabled : styles.buttonPrimary,
        ]}
        disabled={item.accepted}
        onPress={() => onAccept(item.id)}
      >
        <Text style={styles.actionText}>
          {item.accepted ? "Tomada" : "Aceptar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default function SolicitudesTecnico() {
  const { solicitudes, loading, aceptarSolicitud, recargarSolicitudes } =
    useSolicitudesTecnico();
  const [refreshing, setRefreshing] = useState(false);

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
            <View style={styles.emptyState}>
              <Text style={Estilos.sub}>Sin solicitudes pendientes</Text>
              <Text style={Estilos.dateText}>
                Cuando los usuarios creen solicitudes, apareceran aqui.
              </Text>
            </View>
          }
          contentContainerStyle={
            pendientes.length === 0 ? styles.emptyContainer : undefined
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderLeftWidth: 6,
    borderLeftColor: "#1ABC9C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
    gap: 10,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#1ABC9C",
  },
  buttonDisabled: {
    backgroundColor: "#BDC3C7",
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
