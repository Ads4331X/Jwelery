import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../../../services/supabase";
import { AuthContext } from "./context";
import type { AuthContextType, AdminRole } from "./context";
import type { User } from "@supabase/supabase-js";

function getRoleFromUser(user: User | null): AdminRole | null {
  if (!user) return null;
  const role = user.user_metadata?.role as string | undefined;
  if (role === "super_admin") return "super_admin";
  if (role === "admin") return "admin";
  return null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession();
      const activeUser = data.session?.user ?? null;
      setUser(activeUser);
      setRole(getRoleFromUser(activeUser));
      setIsAuthenticated(!!activeUser);
      setLoading(false);
    };

    restoreSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const activeUser = session?.user ?? null;
        setUser(activeUser);
        setRole(getRoleFromUser(activeUser));
        setIsAuthenticated(!!activeUser);
      },
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return "Invalid email or password.";
    }

    const loggedInUser = data.user;
    const userRole = getRoleFromUser(loggedInUser);

    // Only allow users with an admin role to log in
    if (!userRole) {
      await supabase.auth.signOut();
      return "Access denied. This account is not an admin.";
    }

    setIsAuthenticated(true);
    setUser(loggedInUser);
    setRole(userRole);
    return null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
  };

  if (loading) return null;

  const value: AuthContextType = { isAuthenticated, user, role, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
