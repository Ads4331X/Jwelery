import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

export type AdminRole = "super_admin" | "admin";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: AdminRole | null;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
