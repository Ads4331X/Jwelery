import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./context";
import type { AuthContextType, AdminUser, AdminRole } from "./context";
import { loginAdmin, fetchAdminRole } from "../../../services/authApi";

const TOKEN_KEY = "admin_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      const data = await fetchAdminRole(token);
      if (data) {
        setUser({
          id: "",
          email: data.email,
          username: data.username,
          role: data.role as AdminRole,
        });
        setRole(data.role as AdminRole);
        setIsAuthenticated(true);
      } else {
        // Token is invalid or expired — clean up
        localStorage.removeItem(TOKEN_KEY);
      }

      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    try {
      const { token, user: userData } = await loginAdmin(email, password);

      // Persist token
      localStorage.setItem(TOKEN_KEY, token);

      const adminUser: AdminUser = {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        role: userData.role as AdminRole,
      };

      setUser(adminUser);
      setRole(adminUser.role);
      setIsAuthenticated(true);
      return null; // no error
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      return message;
    }
  };

  const logout = async () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
  };

  if (loading) return null;

  const value: AuthContextType = { isAuthenticated, user, role, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
