import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import formularios from "./Estilos/Formularios";
import { Inicio } from "../Page/Inicio";

export default function CLogin() {
  const { Correo, setCorreo, Contra, setContra, handleLogin, navigation } = Inicio();

  return (
    <View style={formularios.bg}>
      <View style={formularios.container}>
        <Text style={formularios.title}>INICIO DE SESION</Text>

        <Text style={formularios.text}>Correo</Text>
        <TextInput
          style={formularios.textinput}
          placeholder="Correo"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#9c9c9c"
          value={Correo}
          onChangeText={setCorreo}
        />

        <Text style={formularios.text}>Contrasena</Text>
        <TextInput
          style={formularios.textinput}
          placeholder="Contrasena"
          placeholderTextColor="#9c9c9c"
          value={Contra}
          onChangeText={setContra}
          secureTextEntry
        />

        <TouchableOpacity style={formularios.boton} onPress={handleLogin}>
          <Text style={formularios.textB}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
          <Text style={formularios.text}>No tienes cuenta? Registrate aqui</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
