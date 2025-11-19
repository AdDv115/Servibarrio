import estilos from "../Componentes/Estilos/Estilos";
import { View,
        Text,
        TouchableOpacity} from 'react-native';
import { Task } from "../Componentes/Tablero";
interface ItemProps{
    item:Task,
    markDone:(task:Task)=>void,
    deleteFuntion:(task:Task)=>void
}
export default function RenderItem({item, markDone, deleteFuntion}:ItemProps){
    const formatDate = (date:Date) => {
        const d = typeof date === 'string' ? new Date(date):date

        return date.toLocaleDateString('es-ES',{
            day:'2-digit',
            month:'2-digit',
            year:'numeric',
            hour:'2-digit',
            minute:'2-digit'
        })
    }

    return (
        <View style={estilos.itemcontainer}>
            <TouchableOpacity onPress={()=>markDone(item)}>
                <Text style={item.done ? estilos.textDone:estilos.text}>{item.title}</Text>
                <Text>{formatDate(item.date)}</Text>
            </TouchableOpacity>
            {
                item.done &&
                (<TouchableOpacity 
                style={estilos.removeBoton}
                onPress={()=>deleteFuntion(item)}>
                    <Text>
                        Eliminar
                    </Text>
                </TouchableOpacity>)
            }
        </View>
    )
}

// DateTimePicker