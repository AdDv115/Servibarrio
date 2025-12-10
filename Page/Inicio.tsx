import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../Componentes/App";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Inicio = () => {
  const [Correo, setCorreo] = useState("");
  const [Contra, setContra] = useState("");

  const navigation = useNavigation<StackNavigation>();
  const STORAGE_KEY = "SB_USER_SESSION";

  const handleLogin = async () => {
    if (!Correo.trim() || !Contra.trim()) {
      Alert.alert("Error", "Debes ingresar correo y contrasena.");
      return;
    }

    try {
      const response = await fetch(`https://api-appless.vercel.app/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Correo: Correo.trim().toLowerCase(),
          Contra: Contra.trim(),
        }),
      });

      const raw = await response.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { message: raw };
      }

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Faltan datos para iniciar sesion.");
        }
        if (response.status === 401) {
          throw new Error("Correo no encontrado o contrasena incorrecta.");
        }
        throw new Error(data?.message || `Error ${response.status}`);
      }

      const user = data?.user || data;
      const session = {
        id: user.id,
        correo: user.correo,
        rol: user.rol,
        esTecnico: user.rol === "tecnico",
        esMiembro: user.rol === "usuario",
        esAdmin: user.rol === "admin",
        foto: user.foto || "",
        usuario: user.usuario || "",
        telefono: user.telefono || "",
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      Alert.alert("Sesion iniciada", data?.message || "Login exitoso");

      setCorreo("");
      setContra("");

      const destino =
        session.rol === "tecnico"
          ? "SolicitudesTecnico"
          : session.rol === "admin"
          ? "Admin"
          : "Tablero";
      navigation.replace(destino);
    } catch (error) {
      console.error("Detalles del Error en el Login:", error);
      const mensaje = error instanceof Error ? error.message : "Ocurrio un problema";
      Alert.alert("Fallo al iniciar sesion", mensaje);
    }
  };

  return {
    Correo,
    setCorreo,
    Contra,
    setContra,
    handleLogin,
    navigation,
  };
};
