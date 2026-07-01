// src/features/auth/context/context.ts
import { createContext } from "react";

/** Shape returned by POST /api/customer/auth and /api/customer/signup */
export interface CustomerUser {
  id: string;
  email: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
}

export interface AuthContextValue {
  user: CustomerUser | null;
  /** True if we are still fetching auth state initially. */
  isLoading: boolean;
  /** Derived boolean for guards that expect an authentication flag. */
  isAuthenticated: boolean;
  /** Always null for customers — kept so existing admin-redirect checks
   *  (auth.role === "ADMIN") simply evaluate to false without crashing. */
  role: null;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  setUser: (user: CustomerUser | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
