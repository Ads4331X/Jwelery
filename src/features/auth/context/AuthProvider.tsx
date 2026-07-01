// src/features/auth/context/AuthProvider.tsx
import { useEffect, useState } from "react";
import { AuthContext } from "./context";
import type { CustomerUser } from "./context";
import { customerLogin } from "../../../services/authApi";
import {
  clearAuthCookies,
  getAuthUserCookie,
  setAuthCookies,
} from "./authCookies";

function readStoredUser(): CustomerUser | null {
  try {
    const raw = getAuthUserCookie();
    return raw ? (JSON.parse(raw) as CustomerUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(readStoredUser);
  const isLoading = false;

  useEffect(() => {
    // If another tab logs in/out, sync AuthProvider state.
    const onStorage = () => setUser(readStoredUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    const result = await customerLogin(email, password);
    if (result.error) return result.error;

    // Store token + user in shared cookies (not localStorage)
    setAuthCookies(result.token!, JSON.stringify(result.user!));
    setUser(result.user!);
    return null;
  };

  const logout = (): void => {
    clearAuthCookies();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        role: null,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
