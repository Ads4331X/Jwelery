import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../../../services/supabase";
import { AuthContext } from "./context";
import type { AuthContextType } from "./context";
import type { User } from "@supabase/supabase-js";
import {
  toEmail,
  listAdmins,
  createAdmin,
  getLocalCredentials,
} from "../../admin/utils/adminUser";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // wait for session restore

  useEffect(() => {
    // 1. Check for mock session first (used for reset accounts / local testing)
    const checkMockSession = async (): Promise<boolean> => {
      const mock = localStorage.getItem("mock_session");
      if (mock) {
        try {
          const mockUser = JSON.parse(mock) as User;
          const adminsList = await listAdmins();
          const exists = adminsList.some(
            (a) =>
              a.id === mockUser.id ||
              a.username.toLowerCase() ===
                mockUser.user_metadata?.username?.toLowerCase(),
          );
          if (exists) {
            setUser(mockUser);
            setIsAuthenticated(true);
            setLoading(false);
            return true;
          }
        } catch {
          localStorage.removeItem("mock_session");
        }
      }
      return false;
    };

    const restoreSession = async () => {
      const isMocked = await checkMockSession();
      if (isMocked) return;

      supabase.auth.getSession().then(async ({ data: { session } }) => {
        let activeUser = session?.user ?? null;
        if (activeUser) {
          const adminsList = await listAdmins();
          const username =
            activeUser.user_metadata?.username ??
            activeUser.email?.split("@")[0] ??
            "";
          const exists = adminsList.some(
            (a) => a.username.toLowerCase() === username.toLowerCase(),
          );
          if (!exists) {
            await supabase.auth.signOut();
            activeUser = null;
          }
        }
        setIsAuthenticated(!!activeUser);
        setUser(activeUser ?? null);
        setLoading(false);
      });
    };

    restoreSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // If mock session is active, ignore auth state change
        if (localStorage.getItem("mock_session")) return;

        let activeUser = session?.user ?? null;
        if (activeUser) {
          const adminsList = await listAdmins();
          const username =
            activeUser.user_metadata?.username ??
            activeUser.email?.split("@")[0] ??
            "";
          const exists = adminsList.some(
            (a) => a.username.toLowerCase() === username.toLowerCase(),
          );
          if (!exists) {
            await supabase.auth.signOut();
            activeUser = null;
          }
        }
        setIsAuthenticated(!!activeUser);
        setUser(activeUser ?? null);
      },
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<string | null> => {
    const email = toEmail(username);

    // First, verify if the user exists in our admins list (database or local fallback)
    const adminsList = await listAdmins();
    const matchedAdmin = adminsList.find(
      (a) => a.username.toLowerCase() === username.toLowerCase(),
    );

    // Auto-registration for default super admin "admin"
    if (!matchedAdmin && username.toLowerCase() === "admin") {
      const signupRes = await createAdmin(username, password);
      if (signupRes.error) return signupRes.error;

      // Auto-registered super-admin successfully
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      if (signInError) return signInError.message;
      setIsAuthenticated(!!signInData.user);
      setUser(signInData.user ?? null);
      return null;
    }

    if (!matchedAdmin) {
      return "Invalid username or password.";
    }

    // Try standard sign in via Supabase Auth
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    // Handle credential resets / local fallback sign-in
    if (signInError) {
      const localCreds = getLocalCredentials();
      const storedPwd = localCreds[username.toLowerCase()];
      if (storedPwd && storedPwd === password) {
        // Credentials matched! Create a mock session
        const mockUser = {
          id: matchedAdmin.id,
          email: email,
          user_metadata: { role: "admin", username: matchedAdmin.username },
        } as unknown as User;

        localStorage.setItem("mock_session", JSON.stringify(mockUser));
        setIsAuthenticated(true);
        setUser(mockUser);
        return null;
      }
      return signInError.message;
    }

    setIsAuthenticated(!!signInData.user);
    setUser(signInData.user ?? null);
    return null;
  };

  const logout = async () => {
    localStorage.removeItem("mock_session");
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Don't render children until session is restored — prevents flash redirect to login
  if (loading) return null;

  const value: AuthContextType = { isAuthenticated, user, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
