import 'react-native-gesture-handler';
import React from "react";
import Inicio from './cLogin';
import Registro from "./cRegistro";
import Tablero from "./Tablero";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { StackNavigationProp } from '@react-navigation/stack';
import { enableScreens } from "react-native-screens";

enableScreens()

export type RootList={
  Inicio:undefined
  Registro:undefined
  Tablero:undefined
}

const Ruta=createStackNavigator<RootList>();

export default function App(){
  return(
    <NavigationContainer>
      <Ruta.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerStyle:{
          backgroundColor:'#1ABC9C',
        },
        headerTintColor:'white',
        headerTitleStyle:{
          fontWeight:'bold',
        },
      }}
      >
      <Ruta.Screen
      name="Inicio"
      component={Inicio}
      options={{title:'Inicio de Sesion'}}
      />
      <Ruta.Screen
      name="Registro"
      component={Registro}
      options={{title:'Registro'}}
      />
      <Ruta.Screen
      name="Tablero"
      component={Tablero}
      options={{title:'Tablero'}}
      />
      </Ruta.Navigator>
    </NavigationContainer>
  );
}

export type StackNavigation = StackNavigationProp<RootList>;