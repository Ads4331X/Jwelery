// src/features/auth/context/adminAuthContext.ts
import { createContext } from "react";
import type { AdminUser, AdminRole } from "../../../services/adminApi";

export interface AdminAuthContextValue {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: AdminRole | null;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(
  null,
);
