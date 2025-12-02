import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../Componentes/App"; 

export const Registro = () => {
    const [Usuario, setUsuario] = useState('');
    const [Correo, setCorreo] = useState('');
    const [Telefono, setTelefono] = useState('');
    const [Contra, setContra] = useState('');
    const [miembro, setMiembro] = useState('Usuario');
    
    const navigation = useNavigation<StackNavigation>();
    
    const Registrar = async () => {

        if (!Usuario || !Correo || !Telefono || !Contra || !miembro) {
            Alert.alert("Error de Validación", "Todos los campos son obligatorios.");
            return;
        }

        try {
            const response = await fetch('http://api-appless.vercel.app/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Usuario: Usuario,
                    Correo: Correo,
                    Telefono: Telefono,
                    Contra: Contra,
                    Rol: miembro
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Error del servidor: ${response.status}`);
            }

            const mensaje = await response.text();
            Alert.alert("Registro Exitoso", mensaje || "Usuario registrado correctamente.");

            setUsuario('');
            setCorreo('');
            setTelefono('');
            setContra('');
            setMiembro('');
            
            navigation.replace('Tablero'); 

        } catch (error) {
            console.error("Detalles del Error en el Registro:", error); 
            
            let mensajeAlerta = "Error de conexión o configuración del servidor. Por favor, verifica tu IP.";

            if (error instanceof Error) {
                mensajeAlerta = error.message; 
            }
            
            Alert.alert("Error al Registrar", mensajeAlerta);
        }
    };

    return {
        Usuario, setUsuario,
        Correo, setCorreo,
        Telefono, setTelefono,
        Contra, setContra,
        miembro, setMiembro,
        Registrar
    };
};