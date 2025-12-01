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
} from "react-native";
import Estilos from "../Componentes/Estilos/Estilos";
import RenderItem from "../Page/RenderItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import PushNotification from "react-native-push-notification";

export interface PeticionServicio {
  id: any;
  title: string;
  done: boolean;
  date: Date;
}

export default function PeticionServicioP() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState<PeticionServicio[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const storeData = async (value: PeticionServicio[]) => {
    try {
      await AsyncStorage.setItem("PS", JSON.stringify(value));
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("PS");
      if (value !== null) {
        const Tlocals = JSON.parse(value);
        const taskWithDates = Tlocals.map((task: any) => ({
          ...task,
          date: new Date(task.date),
        }));
        setTasks([...taskWithDates]);
      }
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const checkAndUpdateOverdueTask = async () => {
    try {
      const value = await AsyncStorage.getItem("PS");
      if (value !== null) {
        const storedTask = JSON.parse(value);
        const taskWithDates = storedTask.map((task: any) => ({
          ...task,
          date: new Date(task.date),
        }));
        setTasks(taskWithDates);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      checkAndUpdateOverdueTask();
    }
  };

  useEffect(() => {
    PushNotification.configure({
      onNotification: function (notification: any) {
        console.log("NOTIFICATION:", notification);
        if (notification.data && notification.data.taskId) {
          checkAndUpdateOverdueTask();
        }
      },
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
      (created: boolean) =>
        console.log(`Canal ${created ? "Creado" : "Ya existe"}`)
    );

    getData();
    checkAndUpdateOverdueTask();

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const scheduleNotification = (task: PeticionServicio) => {
    const now = new Date();
    const taskDate = task.date;

    if (taskDate > now) {
      const notificationId = Math.floor(Math.random() * 1000000);

      PushNotification.localNotificationSchedule({
        id: notificationId,
        channelId: "task-reminders",
        title: "Recordatorio",
        message: `Es hora de: ${task.title}`,
        date: taskDate,
        data:{
            taskId:task.id,
            taskTitles:task.title,
        },
        allowWhileIdle:true,
        repeatType:undefined

      })
      return notificationId
    }
  };

  const cancelNotification = (notificationId:number) => {
    PushNotification.cancelLocalNotification({id:notificationId.toString()})
  }

  const generateTaskId = () => {
    return Date.now().toString()+Math.random().toString(36).substr(2,9)
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS !== "ios") setShowDatePicker(false);

    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (event.type === "set" && selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const addTask = () => {
    if (text.trim() === "") {
      Alert.alert(
        "Falta Información",
        "Por favor, describe el servicio que necesitas."
      );
      return;
    }

    const tmp = [...tasks];
    const taskId = generateTaskId()
    const NP: PeticionServicio = {
        id: taskId,
        title: text.trim(),
        done: false,
        date: selecteddate

    };

    tmp.push(NP);
    setTasks(tmp);
    storeData(tmp);
    setText('');
    setDate(new Date());
    const notificationId = scheduleNotification(newTask)
    if(notificationId){
        newTask.notificationId = notificationId
    }
    tmp.push(NP)
    setTasks(tmp)
    storeData(tmp)
    setText('')
    setDate(new Date())

    if(notificationId){
        Alert.alert('Tarea Programada', 
            `Tarea ${newTask.title} programada para el dia ${formatDate(selectedDate)}`)
    }
  }

  const markDone = (task: PeticionServicio) => {
    const tmp = [...tasks];
    const index = tmp.findIndex((el) => el.title === task.title);
    if (index !== -1) {
      const todo = tmp[index];
      todo.done = !todo.done;
      setTasks(tmp);
      storeData(tmp);
    }
  };

  const deleteFuntion = (task: PeticionServicio) => {
    const tmp = [...tasks];
    const index = tmp.findIndex((el) => el.title === task.title);
    if (index !== -1) {
      tmp.splice(index, 1);
      setTasks(tmp);
      storeData(tmp);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={Estilos.container}>
    </View>
  );
}
}
