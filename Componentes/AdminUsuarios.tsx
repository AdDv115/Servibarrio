import React from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AdminUser } from "../Page/Admin";
import EstilosAdmin from "./Estilos/Admin";

type UserSectionProps = {
  usuarios: AdminUser[];
  loading: boolean;
  savingId: string | null;
  emptyText: string;
  onChange: (id: string, campo: keyof AdminUser, valor: string) => void;
  onGuardar: (user: AdminUser) => void | Promise<void>;
};

function UserListSection({ usuarios, loading, savingId, emptyText, onChange, onGuardar }: UserSectionProps) {
  if (loading) return <ActivityIndicator size="large" color="#1ABC9C" />;

  return (
    <ScrollView style={EstilosAdmin.listContainer}>
      {usuarios.map((u) => (
        <View key={u.id} style={EstilosAdmin.card}>
          <View style={EstilosAdmin.row}>
            <Text style={EstilosAdmin.label}>Nombre</Text>
            <TextInput style={EstilosAdmin.input} value={u.nombre} onChangeText={(t) => onChange(u.id, "nombre", t)} />
          </View>
          <View style={EstilosAdmin.row}>
            <Text style={EstilosAdmin.label}>Correo</Text>
            <TextInput
              style={EstilosAdmin.input}
              value={u.correo}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(t) => onChange(u.id, "correo", t)}
            />
          </View>
          <View style={EstilosAdmin.row}>
            <Text style={EstilosAdmin.label}>Telefono</Text>
            <TextInput
              style={EstilosAdmin.input}
              value={u.telefono}
              keyboardType="phone-pad"
              onChangeText={(t) => onChange(u.id, "telefono", t)}
            />
          </View>
          <View style={EstilosAdmin.row}>
            <Text style={EstilosAdmin.label}>Rol (usuario, tecnico, admin)</Text>
            <TextInput
              style={EstilosAdmin.input}
              value={u.rol}
              autoCapitalize="none"
              onChangeText={(t) => onChange(u.id, "rol", t)}
            />
            <Text style={EstilosAdmin.roleText}>Se guarda en minusculas.</Text>
          </View>
          <View style={EstilosAdmin.row}>
            <Text style={EstilosAdmin.label}>Foto (URL)</Text>
            <TextInput
              style={EstilosAdmin.input}
              value={u.foto}
              autoCapitalize="none"
              onChangeText={(t) => onChange(u.id, "foto", t)}
              placeholder="Foto de perfil"
            />
          </View>
          <TouchableOpacity style={EstilosAdmin.button} onPress={() => onGuardar(u)} disabled={savingId === u.id}>
            {savingId === u.id ? <ActivityIndicator color="#FFFFFF" /> : <Text style={EstilosAdmin.buttonText}>Guardar</Text>}
          </TouchableOpacity>
        </View>
      ))}

      {usuarios.length === 0 ? (
        <View style={EstilosAdmin.placeholder}>
          <Text style={EstilosAdmin.placeholderText}>{emptyText}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

export function UsuariosSection(props: Omit<UserSectionProps, "emptyText">) {
  return <UserListSection {...props} emptyText="No hay usuarios registrados." />;
}

export function TecnicosSection(props: Omit<UserSectionProps, "emptyText">) {
  return <UserListSection {...props} emptyText="No hay tecnicos registrados." />;
}

export default UsuariosSection;
