import { supabase } from "../../../services/supabase";
import type { User } from "@supabase/supabase-js";
import type { AdminRole } from "../../auth/context/context";

export type AdminAccount = {
  id: string;
  email: string;
  display_name: string;
  role: AdminRole;
  created_at: string;
};

export type AdminResult = {
  user: User | null;
  error: string | null;
};

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export const listAdmins = async (): Promise<AdminAccount[]> => {
  const { data, error } = await supabase
    .from("admins")
    .select("id, email, display_name, role, created_at")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as AdminAccount[];
};

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

/**
 * Creates a new admin auth account + admins table record.
 *
 * Problem: supabase.auth.signUp() replaces the current session with the
 * newly created user's session, logging the super admin out mid-flow.
 *
 * Fix: capture the super admin's session before signUp, then restore it
 * immediately after so the super admin stays logged in.
 */
export const createAdmin = async (
  email: string,
  password: string,
  displayName: string,
  role: AdminRole = "admin",
): Promise<AdminResult> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const currentSession = sessionData.session;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, display_name: displayName },
    },
  });

  const newUser = data?.user;

  // Always restore session immediately
  if (currentSession) {
    await supabase.auth.setSession({
      access_token: currentSession.access_token,
      refresh_token: currentSession.refresh_token,
    });
  }

  if (error) return { user: null, error: error.message };
  if (!newUser) return { user: null, error: "User creation failed." };

  await new Promise((resolve) => setTimeout(resolve, 800));

  // Re-restore session again after delay to be safe
  if (currentSession) {
    await supabase.auth.setSession({
      access_token: currentSession.access_token,
      refresh_token: currentSession.refresh_token,
    });
  }

  const { error: dbError } = await supabase.from("admins").insert({
    id: newUser.id,
    email,
    display_name: displayName,
    username: displayName,
    role,
    created_at: new Date().toISOString(),
  });

  if (dbError) {
    return {
      user: null,
      error: `Auth user created but DB insert failed: ${dbError.message}`,
    };
  }

  return { user: newUser, error: null };
};
// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export const deleteAdmin = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("admins").delete().eq("id", id);
  if (error) {
    console.error("Failed to delete admin:", error.message);
    return false;
  }
  return true;
};

// ---------------------------------------------------------------------------
// Password (own account only)
// ---------------------------------------------------------------------------

export const updateOwnPassword = async (
  newPassword: string,
): Promise<{ error: string | null }> => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return { error: error.message };
  }
  return { error: null };
};

export const updateAdminRole = async (
  id: string,
  role: AdminRole,
): Promise<{ error: string | null }> => {
  const { error } = await supabase.from("admins").update({ role }).eq("id", id);
  return { error: error?.message ?? null };
};

// ---------------------------------------------------------------------------
// Display Name (own account)
// ---------------------------------------------------------------------------
export const updateDisplayName = async (
  displayName: string,
): Promise<{ error: string | null }> => {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("admins")
    .update({ display_name: displayName, username: displayName })
    .eq("id", user.id);

  if (error) return { error: error.message };

  // Also update auth metadata so topbar refreshes immediately
  await supabase.auth.updateUser({
    data: { display_name: displayName },
  });

  return { error: null };
};
