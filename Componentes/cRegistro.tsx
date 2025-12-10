import React from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import formularios from "./Estilos/Formularios";
import { Picker } from "@react-native-picker/picker";
import { Registro } from "../Page/Registro";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "./App";

export default function CRegistro() {
  const navigation = useNavigation<StackNavigation>();

  const {
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
  } = Registro();

  return (
    <ImageBackground
      source={{
        uri: "http://images.pexels.com/photos/691668/pexels-photo-691668.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      }}
      resizeMode="cover"
      style={formularios.bg}
    >
      <View style={formularios.container}>
        <TouchableOpacity onPress={() => navigation.navigate("Inicio")}>
          <Text style={formularios.text}>{"<-"}</Text>
        </TouchableOpacity>

        <Text style={formularios.title}>REGISTRO DE USUARIO</Text>

        <Text style={formularios.text}>Usuario</Text>
        <TextInput style={formularios.textinput} value={Usuario} onChangeText={setUsuario} />

        <Text style={formularios.text}>Correo</Text>
        <TextInput
          style={formularios.textinput}
          value={Correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={formularios.text}>Telefono (opcional)</Text>
        <TextInput
          style={formularios.textinput}
          value={Telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <Text style={formularios.text}>Contrasena</Text>
        <TextInput
          style={formularios.textinput}
          value={Contra}
          onChangeText={setContra}
          secureTextEntry
        />

        <Picker
          style={formularios.picker}
          selectedValue={rol}
          onValueChange={(value) => setRol(value as "usuario" | "tecnico")}
        >
          <Picker.Item label="Usuario" value="usuario" />
          <Picker.Item label="Tecnico" value="tecnico" />
        </Picker>

        <TouchableOpacity style={formularios.boton} onPress={Registrar}>
          <Text style={formularios.textB}>Registrarme</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
