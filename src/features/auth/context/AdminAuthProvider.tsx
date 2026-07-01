// src/features/auth/context/AdminAuthProvider.tsx
import { useEffect, useState } from "react";
import { AdminAuthContext } from "./adminAuthContext";
import {
  adminLogin,
  ADMIN_TOKEN_KEY,
  type AdminUser,
} from "../../../services/adminApi";

const ADMIN_USER_KEY = "admin_user";

function readStoredAdmin(): AdminUser | null {
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(readStoredAdmin);
  const isLoading = false;

  useEffect(() => {
    const onStorage = () => setAdmin(readStoredAdmin());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    const result = await adminLogin(email, password);
    if (result.error) return result.error;

    localStorage.setItem(ADMIN_TOKEN_KEY, result.token!);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(result.user!));
    setAdmin(result.user!);
    return null;
  };

  const logout = (): void => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        role: admin?.role ?? null,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
