import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../Componentes/App"; 

export const Inicio = () => {
    
    const [Correo, setCorreo] = useState('');
    const [Contra, setContra] = useState('');
    const [miembro, setMiembro] = useState('');

    const navigation = useNavigation<StackNavigation>();

    const handleLogin = async () => {
        if (!Correo || !Contra) {
            Alert.alert("Error", "Debes ingresar usuario y contraseña.");
            return;
        }

        try {
            const response = await fetch('http://api-appless.vercel.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Correo: Correo,
                    Contra: Contra,
                    Rol: miembro
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Error de autenticación: ${response.status}`);
            }

            /* const mensaje = await response.text();
            Alert.alert("Sesión iniciada correctamente"); */
            
            setCorreo('');
            setContra('');

            const destino = miembro === 'Tecnico' ? 'SolicitudesTecnico' : 'Tablero';
            navigation.replace(destino);

        } catch (error) {
            console.error("Detalles del Error en el Login:", error); 
            
            let mensajeAlerta = "Error de conexión con el servidor.";

            if (error instanceof Error) {
                mensajeAlerta = error.message; 
            }
            
            Alert.alert("Fallo al Iniciar Sesión", mensajeAlerta);
        }
    };

    return {
        Correo, 
        setCorreo,
        Contra, 
        setContra,
        miembro, 
        setMiembro,
        handleLogin,
        navigation
    };
};
