import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import formularios from "./Estilos/Formularios";
import estilos from "./Estilos/Estilos";
import { usePerfil } from "../Page/Perfil";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "./App";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Perfil() {
  const navigation = useNavigation<StackNavigation>();
  const { perfil, setPerfil, loading, saving, guardarPerfil } = usePerfil();
  const [showMenu, setShowMenu] = useState(false);
  const [fotoSesion, setFotoSesion] = useState<string | undefined>();
  const [correoSesion, setCorreoSesion] = useState<string | undefined>();
  const [nombreSesion, setNombreSesion] = useState<string | undefined>();
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("SB_USER_SESSION")
      .then((raw) => {
        if (!raw) return;
        const parsed = JSON.parse(raw);
        setFotoSesion(parsed.foto);
        setCorreoSesion(parsed.correo);
        setNombreSesion(parsed.usuario);
        setEsAdmin(!!parsed.esAdmin);
      })
      .catch(() => {});
  }, []);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace("Tablero");
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem("SB_USER_SESSION");
    navigation.replace("Inicio");
  };

  const renderAvatar = () => {
    const uri = perfil.foto || fotoSesion;
    if (uri) {
      return (
        <Image source={{ uri }} style={estilos.avatar} />
      );
    }
    const inicial =
      perfil.nombre?.[0]?.toUpperCase() ||
      nombreSesion?.[0]?.toUpperCase() ||
      correoSesion?.[0]?.toUpperCase() ||
      "U";
    return (
      <View style={estilos.avatarFallback}>
        <Text style={estilos.avatarInitial}>{inicial}</Text>
      </View>
    );
  };

  return (
    <View style={[formularios.container, estilos.perfilContainer]}>
      <View style={estilos.rowBetween}>
        <TouchableOpacity onPress={() => setShowMenu((v) => !v)}>{renderAvatar()}</TouchableOpacity>
        <TouchableOpacity onPress={handleBack}>
          <Text style={formularios.text}>{"<- Volver"}</Text>
        </TouchableOpacity>
      </View>
      {showMenu ? (
        <View style={estilos.menuContainer}>
          <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate("Tablero"); }}>
            <Text style={formularios.text}>Tablero</Text>
          </TouchableOpacity>
          {esAdmin ? (
            <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate("Admin"); }}>
              <Text style={formularios.text}>Admin</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate("SolicitudesTecnico"); }}>
            <Text style={formularios.text}>Solicitudes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setShowMenu(false); cerrarSesion(); }}>
            <Text style={formularios.text}>Cerrar sesion</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Text style={formularios.title}>Perfil</Text>

      {perfil.foto ? (
        <Image source={{ uri: perfil.foto }} style={estilos.profileImage} />
      ) : (
        <View style={estilos.profilePlaceholder}>
          <Text style={estilos.profilePlaceholderText}>Sin foto</Text>
        </View>
      )}

      <Text style={formularios.text}>Nombre</Text>
      <TextInput
        style={formularios.textinput}
        value={perfil.nombre}
        onChangeText={(t) => setPerfil((p) => ({ ...p, nombre: t }))}
      />

      <Text style={formularios.text}>Correo</Text>
      <TextInput
        style={formularios.textinput}
        value={perfil.correo}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(t) => setPerfil((p) => ({ ...p, correo: t }))}
      />

      <Text style={formularios.text}>Telefono</Text>
      <TextInput
        style={formularios.textinput}
        value={perfil.telefono}
        keyboardType="phone-pad"
        onChangeText={(t) => setPerfil((p) => ({ ...p, telefono: t }))}
      />

      <Text style={formularios.text}>Link de foto de perfil</Text>
      <TextInput
        style={formularios.textinput}
        value={perfil.foto}
        autoCapitalize="none"
        onChangeText={(t) => setPerfil((p) => ({ ...p, foto: t }))}
        placeholder="https://ejemplo.com/foto.jpg"
      />

      <TouchableOpacity style={formularios.boton} onPress={() => guardarPerfil(perfil)} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={formularios.textB}>Guardar</Text>}
      </TouchableOpacity>
    </View>
  );
}
