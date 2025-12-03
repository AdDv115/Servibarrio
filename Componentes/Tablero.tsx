import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  AppState,
  AppStateStatus,
  Modal,
} from "react-native";
import Estilos from "../Componentes/Estilos/Estilos";
import RenderItem from "../Page/RenderItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import PushNotification from "react-native-push-notification";
import formularios from "./Estilos/Formularios";
import { StackNavigation } from "./App";

export interface PeticionServicio {
  id: string;
  title: string;
  done: boolean;
  date: Date;
  notificationId?: string;
}

type Props = {
  navigation: StackNavigation;
};

export default function PeticionServicioP({ navigation }: Props) {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState<PeticionServicio[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  

  const storeData = async (value: PeticionServicio[]) => {
    try {
      await AsyncStorage.setItem("PS", JSON.stringify(value));
    } catch {}
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("PS");
      if (value !== null) {
        const locals = JSON.parse(value);
        const tasksWithDates = locals.map((task: any) => ({
          ...task,
          date: new Date(task.date),
        }));
        setTasks(tasksWithDates);
      }
    } catch {}
  };

  const checkAndUpdateOverdueTask = async () => {
    try {
      const value = await AsyncStorage.getItem("PS");
      if (value !== null) {
        const stored = JSON.parse(value);
        const tasksWithDates = stored.map((task: any) => ({
          ...task,
          date: new Date(task.date),
        }));
        setTasks(tasksWithDates);
      }
    } catch {}
  };

  const handleAppStateChange = (next: AppStateStatus) => {
    if (next === "active") checkAndUpdateOverdueTask();
  };

  const scheduleNotification = (
    task: PeticionServicio
  ): string | undefined => {
    const now = new Date();
    if (task.date > now) {
      const id = Math.floor(Math.random() * 1000000).toString();

      PushNotification.localNotificationSchedule({
        id,
        channelId: "task-reminders",
        title: "Recordatorio",
        message: `Es hora de: ${task.title}`,
        date: task.date,
        allowWhileIdle: true,
      });

      return id;
    }
  };

  const cancelNotification = (id: string) => {
    PushNotification.cancelLocalNotification(id);
  };

  const generateTaskId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS !== "ios") setShowDatePicker(false);
    if (event?.type === "set" && date) {
      const newDate = new Date(date);
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setSelectedDate(newDate);
      setShowTimePicker(true);
    }
  };

 const onTimeChange = (event: any, time?: Date) => {
  if (Platform.OS !== "ios") setShowTimePicker(false);

  if (event?.type === "set" && time) {
    const now = new Date();
    const newDate = new Date(selectedDate);

    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());

    const isToday = selectedDate.toDateString() === now.toDateString();

    if (isToday && newDate < now) {
      Alert.alert("Hora inválida", "No puedes seleccionar una hora pasada.");
      return; 
    }
    setSelectedDate(newDate);
  }
};


  useEffect(() => {
    PushNotification.configure({
      onNotification: () => {},
      requestPermissions: Platform.OS === "ios",
    });

    PushNotification.createChannel(
      {
        channelId: "task-reminders",
        channelName: "Recordatorio de tareas",
        channelDescription: "Notificaciones Programadas",
        playSound: true,
        importance: 4,
        vibrate: true,
      },
      () => {}
    );

    getData();
    checkAndUpdateOverdueTask();

    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => sub.remove();
  });

  const addTask = () => {
    if (text.trim() === "") {
      Alert.alert("Falta Información", "Describe el servicio.");
      return;
    }

    const taskId = generateTaskId();
    const baseText = text.trim();
    const title =
      selectedService != null
        ? `${selectedService}: ${baseText}`
        : baseText;

    const newTask: PeticionServicio = {
      id: taskId,
      title,
      done: false,
      date: selectedDate,
    };

    const notifId = scheduleNotification(newTask);
    if (notifId) newTask.notificationId = notifId;

    const updated = [...tasks, newTask];
    setTasks(updated);
    storeData(updated);

    setText("");
    setSelectedDate(new Date());
    setModalVisible(false);
    setSelectedService(null);
  };

  const markDone = (task: PeticionServicio) => {
    const updated = tasks.map((t) => {
      if (t.id === task.id) {
        const u = { ...t, done: !t.done };

        if (u.done && u.notificationId) {
          cancelNotification(u.notificationId);
          u.notificationId = undefined;
        } else if (!u.done) {
          const newId = scheduleNotification(u);
          if (newId) u.notificationId = newId;
        }
        return u;
      }
      return t;
    });

    setTasks(updated);
    storeData(updated);
  };

  const deleteFunction = (task: PeticionServicio) => {
    Alert.alert("Confirmación", "¿Eliminar tarea?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          if (task.notificationId) cancelNotification(task.notificationId);
          const filtered = tasks.filter((t) => t.id !== task.id);
          setTasks(filtered);
          storeData(filtered);
        },
      },
    ]);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const openServiceModal = (service: string) => {
    setSelectedService(service);
    setText("");
    setSelectedDate(new Date());
    setModalVisible(true);
  };

  return (
    <View style={Estilos.container}>

    <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
        <Text style={formularios.text}>←</Text>
    </TouchableOpacity>

      <Text style={Estilos.title}>Solicitar Servicio</Text>

      <View style={Estilos.inputcontainer}>
        <View style={Estilos.fila}>
          <TouchableOpacity
            style={Estilos.boton}
            onPress={() => openServiceModal("Fontaneria")}
          >
            <Text style={Estilos.textB}>Fontaneria</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={Estilos.boton}
            onPress={() => openServiceModal("Electricidad")}
          >
            <Text style={Estilos.textB}>Electricidad</Text>
          </TouchableOpacity>
        </View>

        <View style={Estilos.fila}>
          <TouchableOpacity
            style={Estilos.boton}
            onPress={() => openServiceModal("Carpinteria")}
          >
            <Text style={Estilos.textB}>Carpinteria</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={Estilos.boton}
            onPress={() => openServiceModal("Albañileria")}
          >
            <Text style={Estilos.textB}>Albañileria</Text>
          </TouchableOpacity>
        </View>

        <View style={Estilos.fila}>
          <TouchableOpacity
            style={Estilos.boton}
            onPress={() => openServiceModal("Mecanica")}
          >
            <Text style={Estilos.textB}>Mecanica</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={Estilos.boton}
            onPress={() => openServiceModal("General")}
          >
            <Text style={Estilos.textB}>General</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={Estilos.modal}>

          <View style={Estilos.mc}>

            <Text style={Estilos.sub}>
              {selectedService
                ? `Solicitud de ${selectedService}`
                : "Nueva solicitud"}
            </Text>

            <TextInput
              placeholder="Escribe la descripción del trabajo"
              style={Estilos.inputmodal}
              value={text}
              onChangeText={setText}
            />

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={Estilos.calendarioBoton || Estilos.boton}
            >
              <Text style={Estilos.fecha}>{formatDate(selectedDate)}</Text>
            </TouchableOpacity>

            <View style={Estilos.botonesmo}>

              <TouchableOpacity style={Estilos.boton} onPress={addTask}>
                <Text style={Estilos.textB}>Solicitar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[Estilos.boton]}
                onPress={() => setModalVisible(false)}
              >
              <Text style={Estilos.textB}>Cancelar</Text>
            </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          onChange={onTimeChange}
          is24Hour={false}    
          display="spinner"
        />
      )}

      <View style={Estilos.listaContainer}>
        <Text style={Estilos.sub}>Mis Solicitudes ({tasks.length})</Text>

        <FlatList
          renderItem={({ item }) => (
            <RenderItem
              item={item}
              markDone={() => markDone(item)}
              deleteFuntion={() => deleteFunction(item)}
            />
          )}
          data={tasks}
          keyExtractor={(item, index) => `${item.title}-${index}`}
      
        />
      </View>
    </View>
  );
}
