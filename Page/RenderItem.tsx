import estilos from "../Componentes/Estilos/Estilos";
import { View, Text, TouchableOpacity } from "react-native";

interface PeticionServicio {
  id: string;
  title: string;
  done: boolean;
  date: Date | string;
  notificationId?: string;
}

interface ItemProps {
  item: PeticionServicio;
  markDone: (task: PeticionServicio) => void;
  deleteFuntion: (task: PeticionServicio) => void;
}

export default function RenderItem({ item, markDone, deleteFuntion }: ItemProps) {
  
    const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;

    return d.toLocaleDateString("es-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <View style={estilos.itemcontainer}>
      <TouchableOpacity onPress={() => markDone(item)}>
        <Text style={item.done ? estilos.textDone : estilos.text}>
          {item.title}
        </Text>
        <Text>{formatDate(item.date)}</Text>
      </TouchableOpacity>
      {item.done && (
        <TouchableOpacity
          style={estilos.removeBoton}
          onPress={() => deleteFuntion(item)}
        >
          <Text>Eliminar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
