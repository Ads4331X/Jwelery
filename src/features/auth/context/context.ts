import { createContext } from "react";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "DELIVERY_STAFF";

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: AdminRole;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  role: AdminRole | null;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
