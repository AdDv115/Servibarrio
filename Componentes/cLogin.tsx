import React from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import formularios from "./Estilos/Formularios";
import { Picker } from "@react-native-picker/picker";
import { Inicio } from "../Page/Inicio"; 

export default function cLogin() {
    const {
        Correo, setCorreo,
        Contra, setContra,
        miembro, setMiembro,
        handleLogin,
        navigation
    } = Inicio();

    return (
        <ImageBackground 
            source={{uri:'https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}}
            resizeMode="cover" 
            style={formularios.bg}
        >
            <View style={formularios.container}>
                <Text style={formularios.title}>INICIO DE SESION</Text>
                
                <Text style={formularios.text}>Correo</Text>
                <TextInput
                    style={formularios.textinput}
                    placeholder="Correo"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={Correo}
                    onChangeText={setCorreo}
                />

                <Text style={formularios.text}>Contraseña</Text>
                <TextInput
                    style={formularios.textinput}
                    placeholder="Contraseña"
                    value={Contra}
                    onChangeText={setContra}
                    secureTextEntry
                />

                <TouchableOpacity style={formularios.boton} onPress={handleLogin}>
                    <Text style={formularios.textB}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                    <Text style={formularios.text}>¿No tienes cuenta? Regístrate aquí</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}