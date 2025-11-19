
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Platform, Alert } from "react-native";
import Estilos from "../Componentes/Estilos/Estilos";
import RenderItem from "../Page/RenderItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

export interface PeticionServicio {
    title: string;
    done: boolean;
    date: Date;
}

export default function PeticionServicioP() {
    const [text, setText] = useState('');
    const [tasks, setTasks] = useState<PeticionServicio[]>([]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const storeData = async (value: PeticionServicio[]) => {
        try {
            await AsyncStorage.setItem('PS', JSON.stringify(value));
        } catch (e) {
            console.error("Error al guardar datos:", e);
        }
    }

    const getData = async () => {
        try{
            const value = await AsyncStorage.getItem('PS');
            if (value != null){
                const parsedTask = JSON.parse(value);
                const tasklocal: PeticionServicio[] = parsedTask.map((task: any) => ({
                    title: task.title,
                    done: task.done,
                    date: new Date(task.date)
                }));
                setTasks(tasklocal);
            }
        } catch (e){
            console.error("Error al cargar datos:", e);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const onDateChange = (event: any, selectedDate ?: Date) => {
        if (Platform.OS !== 'ios') setShowDatePicker(false);
        
        if (event.type === 'set' && selectedDate){
            setDate(selectedDate);
            if (Platform.OS !== 'ios') setShowTimePicker(true);
        }
    }

    const onTimeChange = (event: any, selectedTime ?: Date) => {
        setShowTimePicker(false);
        if (event.type === 'set' && selectedTime) {
            const newDate = new Date(date);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setDate(newDate);
        }
    }
    
    const addTask = () => {
        if (text.trim() === '') {
            Alert.alert('Falta Información', 'Por favor, describe el servicio que necesitas.');
            return;
        }

        const tmp = [...tasks];
        const NP: PeticionServicio = {
            title: text,
            done: false,
            date: date
        };

        tmp.push(NP);
        setTasks(tmp);
        storeData(tmp);
        setText('');
        setDate(new Date());
    }

    const markDone = (task: PeticionServicio) => {
      const tmp = [...tasks];
      const index = tmp.findIndex(el => el.title === task.title);
      if (index !== -1) {
          const todo = tmp[index];
          todo.done = !todo.done;
          setTasks(tmp);
          storeData(tmp);
      }
    }

    const deleteFuntion = (task: PeticionServicio) => {
      const tmp = [...tasks];
      const index = tmp.findIndex(el => el.title === task.title);
      if (index !== -1) {
          tmp.splice(index, 1);
          setTasks(tmp);
          storeData(tmp);
      }
    }
    
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }); 
    }

    return (
        <View style={Estilos.container}>
            <Text style={Estilos.title}>
                Solicitar Servicio 🛠️
            </Text>
            
            <View style={Estilos.inputcontainer}>
                <TextInput 
                    placeholder="Escribe la descripción del trabajo (Ej. 'Arreglar fuga en baño')"
                    style={Estilos.textinput}
                    value={text}
                    onChangeText={(t: string) => setText(t)}
                />

                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={Estilos.calendarioBoton || Estilos.boton}> 
                    <Text>🗓️</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={Estilos.boton} onPress={addTask}> 
                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Solicitar</Text> 
                </TouchableOpacity>
            </View>
            
            <Text style={Estilos.fecha}>
                 Fecha/Hora Elegida: {formatDate(date)}
            </Text>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    minimumDate={new Date()}
                />
            )}
            
            {showTimePicker && (
                <DateTimePicker
                    value={date}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onTimeChange}
                />
            )}
            
            <View style={Estilos.listaContainer}>
                <Text style={Estilos.sub}>Mis Solicitudes ({tasks.length})</Text>
                
                <FlatList 
                    renderItem={({ item }) =>
                        <RenderItem
                            item={item}
                            markDone={markDone}
                            deleteFuntion={deleteFuntion}
                        />}
                    data={tasks}
                    keyExtractor={(item, index) => `${item.title}-${index}`} 
                    style={{ flexGrow: 1 }}
                />
            </View>
        </View>
    );
}
