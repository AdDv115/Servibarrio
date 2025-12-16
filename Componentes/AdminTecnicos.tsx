import React from "react";
import { AdminUser } from "../Page/Admin";
import { TecnicosSection } from "./AdminUsuarios";

type Props = {
  usuarios: AdminUser[];
  loading: boolean;
  savingId: string | null;
  onChange: (id: string, campo: keyof AdminUser, valor: string) => void;
  onGuardar: (user: AdminUser) => void | Promise<void>;
};

// Contenedor simple para la sección de tecnicos.
export default function AdminTecnicos(props: Props) {
  return <TecnicosSection {...props} />;
}
