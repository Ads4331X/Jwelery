import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../../../services/supabase";
import { AuthContext } from "./context";
import type { AuthContextType, AdminRole } from "./context";
import type { User } from "@supabase/supabase-js";

async function getRoleFromDB(user: User | null): Promise<AdminRole | null> {
  if (!user) return null;
  const { data, error } = await supabase
    .from("admins")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (error || !data) return null;
  return data.role as AdminRole;
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
      const activeRole = await getRoleFromDB(activeUser);
      setUser(activeUser);
      setRole(activeRole);
      setIsAuthenticated(!!activeUser);
      setLoading(false);
    };

    restoreSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const activeUser = session?.user ?? null;
        const activeRole = await getRoleFromDB(activeUser);
        setUser(activeUser);
        setRole(activeRole);
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

    if (error) return "Invalid email or password.";

    const loggedInUser = data.user;
    const userRole = await getRoleFromDB(loggedInUser);

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
