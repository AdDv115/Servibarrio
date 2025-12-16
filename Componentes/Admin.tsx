import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "./App";
import Estilos from "./Estilos/Estilos";
import formularios from "./Estilos/Formularios";
import EstilosAdmin from "./Estilos/Admin";
import { AdminUser, useAdminUsuarios } from "../Page/Admin";
import ServiciosSection from "./AdminServicios";
import { UsuariosSection } from "./AdminUsuarios";
import AdminTecnicos from "./AdminTecnicos";

const STORAGE_KEY = "SB_USER_SESSION";

type Seccion = "usuarios" | "servicios" | "tecnicos";

export default function Admin() {
  const navigation = useNavigation<StackNavigation>();
  const { usuarios, setUsuarios, loading, savingId, recargar, guardarUsuario } = useAdminUsuarios();
  const [autorizado, setAutorizado] = useState(false);
  const [checking, setChecking] = useState(true);
  const [seccion, setSeccion] = useState<Seccion>("usuarios");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const tecnicos = useMemo(
    () => usuarios.filter((u) => (u.rol || "").toLowerCase() === "tecnico"),
    [usuarios]
  );
  const usuariosFiltrados = useMemo(
    () => usuarios.filter((u) => (u.rol || "").toLowerCase() !== "tecnico"),
    [usuarios]
  );
  const userMap = useMemo(() => {
    const map: Record<string, AdminUser> = {};
    usuarios.forEach((u) => {
      map[u.id] = u;
    });
    return map;
  }, [usuarios]);

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    navigation.replace("Inicio");
  };

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
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
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, [campo]: valor } : u)));
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
        <TouchableOpacity onPress={cerrarSesion}>
          <Text style={formularios.text}>Cerrar sesion</Text>
        </TouchableOpacity>
        <View style={Estilos.rowCenter}>
          <Text style={[formularios.text, { marginRight: 12 }]}>Panel Admin</Text>
          <TouchableOpacity onPress={recargar}>
            <Text style={formularios.text}>Recargar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => setSidebarVisible((v) => !v)}>
        <Text style={EstilosAdmin.title}>{sidebarVisible ? "Ocultar menu" : "Menu"}</Text>
      </TouchableOpacity>
      <View style={EstilosAdmin.smallGap} />

      <View style={EstilosAdmin.layout}>
        {sidebarVisible ? (
          <View style={EstilosAdmin.sidebar}>
            <TouchableOpacity
              style={[EstilosAdmin.navButton, seccion === "usuarios" && EstilosAdmin.navButtonActive]}
              onPress={() => setSeccion("usuarios")}
            >
              <Text
                style={[
                  EstilosAdmin.navButtonText,
                  seccion === "usuarios" && EstilosAdmin.navButtonTextActive,
                ]}
              >
                Usuarios
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[EstilosAdmin.navButton, seccion === "servicios" && EstilosAdmin.navButtonActive]}
              onPress={() => setSeccion("servicios")}
            >
              <Text
                style={[
                  EstilosAdmin.navButtonText,
                  seccion === "servicios" && EstilosAdmin.navButtonTextActive,
                ]}
              >
                Servicios
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[EstilosAdmin.navButton, seccion === "tecnicos" && EstilosAdmin.navButtonActive]}
              onPress={() => setSeccion("tecnicos")}
            >
              <Text
                style={[
                  EstilosAdmin.navButtonText,
                  seccion === "tecnicos" && EstilosAdmin.navButtonTextActive,
                ]}
              >
                Tecnicos
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={[EstilosAdmin.content, sidebarVisible ? null : { marginLeft: 0 }]}>
          {seccion === "usuarios" ? (
            <UsuariosSection
              usuarios={usuariosFiltrados}
              loading={loading}
              savingId={savingId}
              onChange={actualizarCampo}
              onGuardar={onGuardar}
            />
          ) : null}

          {seccion === "servicios" ? (
            <ServiciosSection usuarios={usuariosFiltrados} tecnicos={tecnicos} userMap={userMap} />
          ) : null}

          {seccion === "tecnicos" ? (
            <AdminTecnicos
              usuarios={tecnicos}
              loading={loading}
              savingId={savingId}
              onChange={actualizarCampo}
              onGuardar={onGuardar}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}
