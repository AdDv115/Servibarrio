import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../Componentes/App";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Registro = () => {
  const [Usuario, setUsuario] = useState("");
  const [Correo, setCorreo] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Contra, setContra] = useState("");
  const [rol, setRol] = useState<"usuario" | "tecnico">("usuario");

  const navigation = useNavigation<StackNavigation>();
  const STORAGE_KEY = "SB_USER_SESSION";

  const Registrar = async () => {
    if (!Usuario.trim() || !Correo.trim() || !Contra.trim() || !rol) {
      Alert.alert(
        "Falta informacion",
        "Usuario, correo, contrasena y rol son obligatorios."
      );
      return;
    }

    try {
      const response = await fetch(`https://api-appless.vercel.app/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Usuario: Usuario.trim(),
          Correo: Correo.trim().toLowerCase(),
          Telefono: Telefono.trim() || undefined,
          Contra: Contra.trim(),
          Rol: rol,
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
          throw new Error("Faltan campos o rol invalido.");
        }
        if (response.status === 409) {
          throw new Error("Ya existe un usuario con ese ID, correo o telefono.");
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

      Alert.alert("Registro exitoso", data?.message || "Usuario registrado correctamente.");

      setUsuario("");
      setCorreo("");
      setTelefono("");
      setContra("");
      setRol("usuario");

      const destino =
        session.rol === "tecnico"
          ? "SolicitudesTecnico"
          : session.rol === "admin"
          ? "Admin"
          : "Tablero";
      navigation.replace(destino);
    } catch (error) {
      console.error("Detalles del Error en el Registro:", error);
      const mensaje = error instanceof Error ? error.message : "Ocurrio un problema";
      Alert.alert("Error al registrar", mensaje);
    }
  };

  return {
    Usuario,
    setUsuario,
    Correo,
    setCorreo,
    Telefono,
    setTelefono,
    Contra,
    setContra,
    rol,
    setRol,
    Registrar,
  };
};
