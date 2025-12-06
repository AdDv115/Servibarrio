import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import estilos from "../Componentes/Estilos/Estilos";

type Rol = "usuario" | "tecnico" | "admin";

interface PeticionServicio {
  id: string;
  title: string;
  done: boolean;
  date?: Date | string;
  notificationId?: string;
  rolAsignado?: Rol;
  usuarioId?: string;
  descripcion?: string;
  estado?: string;
  tecnicoCorreo?: string;
}

interface ItemProps {
  item: PeticionServicio;
  onPress: () => void;
  onDelete: () => void;
}

function formatDate(date?: Date | string) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RenderItem({ item, onPress, onDelete }: ItemProps) {
  const textStyle = item.done ? estilos.textDone : estilos.text;
  const statusStyle = item.done ? estilos.statusDone : estilos.statusPending;

  return (
    <View style={estilos.itemcontainer}>
      <TouchableOpacity onPress={onPress} style={estilos.flex1}>
        <Text style={textStyle}>{item.title}</Text>
        {item.descripcion ? (
          <Text style={estilos.text}>{item.descripcion}</Text>
        ) : null}
        <Text style={estilos.dateText}>{formatDate(item.date)}</Text>
        <Text style={statusStyle}>
          {item.estado ? item.estado : item.done ? "Completado" : "Pendiente"}
        </Text>
        {item.tecnicoCorreo ? (
          <Text style={estilos.dateText}>Tecnico: {item.tecnicoCorreo}</Text>
        ) : null}
      </TouchableOpacity>

      <TouchableOpacity style={estilos.removeBoton} onPress={onDelete}>
        <Text style={estilos.removeText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}
