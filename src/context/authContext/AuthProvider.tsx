import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../../lib/supabse";
import { AuthContext } from "./context";
import type { AuthContextType } from "./context";
import type { User } from "@supabase/supabase-js";
import { toEmail } from "../../pages/admin/utils/adminUser";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // wait for session restore

  useEffect(() => {
    // Restore session from Supabase (persisted in localStorage automatically)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session?.user);
        setUser(session?.user ?? null);
      },
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<string | null> => {
    const email = toEmail(username);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return error.message;
    setIsAuthenticated(!!data.user);
    setUser(data.user ?? null);
    return null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Don't render children until session is restored — prevents flash redirect to login
  if (loading) return null;

  const value: AuthContextType = { isAuthenticated, user, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
