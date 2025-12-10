import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "./App";
import Estilos from "./Estilos/Estilos";
import formularios from "./Estilos/Formularios";
import EstilosAdmin from "./Estilos/Admin";
import { AdminUser, useAdminUsuarios } from "../Page/Admin";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Admin() {
  const navigation = useNavigation<StackNavigation>();
  const { usuarios, setUsuarios, loading, savingId, recargar, guardarUsuario } = useAdminUsuarios();
  const [autorizado, setAutorizado] = useState(false);
  const [checking, setChecking] = useState(true);
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace("Tablero");
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("SB_USER_SESSION")
      .then((raw) => {
        if (!raw) {
          navigation.replace("Inicio");
          return;
        }
        const sess = JSON.parse(raw);
        if (sess?.esAdmin) {
          setAutorizado(true);
        } else {
          navigation.replace("Inicio");
        }
      })
      .finally(() => setChecking(false));
  }, [navigation]);

  const actualizarCampo = (id: string, campo: keyof AdminUser, valor: string) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [campo]: valor } : u))
    );
  };

  const onGuardar = async (user: AdminUser) => {
    try {
      await guardarUsuario(user);
      Alert.alert("Guardado", "Usuario actualizado correctamente.");
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error al actualizar.";
      Alert.alert("Error", mensaje);
    }
  };

  if (checking) {
    return (
      <View style={[Estilos.container, Estilos.centered]}>
        <ActivityIndicator size="large" color="#1ABC9C" />
      </View>
    );
  }

  if (!autorizado) {
    return null;
  }

  return (
    <View style={Estilos.container}>
      <View style={[Estilos.rowBetween, EstilosAdmin.header]}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={formularios.text}>{"<- Volver"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={recargar}>
          <Text style={formularios.text}>Recargar</Text>
        </TouchableOpacity>
      </View>

      <Text style={EstilosAdmin.title}>Panel de admin</Text>
      <View style={EstilosAdmin.smallGap} />
      {loading ? (
        <ActivityIndicator size="large" color="#1ABC9C" />
      ) : (
        <ScrollView style={EstilosAdmin.listContainer}>
          {usuarios.map((u) => (
            <View key={u.id} style={EstilosAdmin.card}>
              <View style={EstilosAdmin.row}>
                <Text style={EstilosAdmin.label}>Nombre</Text>
                <TextInput
                  style={EstilosAdmin.input}
                  value={u.nombre}
                  onChangeText={(t) => actualizarCampo(u.id, "nombre", t)}
                />
              </View>
              <View style={EstilosAdmin.row}>
                <Text style={EstilosAdmin.label}>Correo</Text>
                <TextInput
                  style={EstilosAdmin.input}
                  value={u.correo}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={(t) => actualizarCampo(u.id, "correo", t)}
                />
              </View>
              <View style={EstilosAdmin.row}>
                <Text style={EstilosAdmin.label}>Telefono</Text>
                <TextInput
                  style={EstilosAdmin.input}
                  value={u.telefono}
                  keyboardType="phone-pad"
                  onChangeText={(t) => actualizarCampo(u.id, "telefono", t)}
                />
              </View>
              <View style={EstilosAdmin.row}>
                <Text style={EstilosAdmin.label}>Rol (usuario, tecnico, admin)</Text>
                <TextInput
                  style={EstilosAdmin.input}
                  value={u.rol}
                  autoCapitalize="none"
                  onChangeText={(t) => actualizarCampo(u.id, "rol", t)}
                />
                <Text style={EstilosAdmin.roleText}>Se guarda en minúsculas.</Text>
              </View>
              <View style={EstilosAdmin.row}>
                <Text style={EstilosAdmin.label}>Foto (URL)</Text>
                <TextInput
                  style={EstilosAdmin.input}
                  value={u.foto}
                  autoCapitalize="none"
                  onChangeText={(t) => actualizarCampo(u.id, "foto", t)}
                  placeholder="https://..."
                />
              </View>
              <TouchableOpacity
                style={EstilosAdmin.button}
                onPress={() => onGuardar(u)}
                disabled={savingId === u.id}
              >
                {savingId === u.id ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={EstilosAdmin.buttonText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
