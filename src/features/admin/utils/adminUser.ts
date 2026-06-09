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
  // 1. Save current (super admin) session
  const { data: sessionData } = await supabase.auth.getSession();
  const currentSession = sessionData.session;

  // 2. Create the new auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, display_name: displayName },
    },
  });

  // 3. Restore the super admin's session regardless of outcome
  if (currentSession) {
    await supabase.auth.setSession({
      access_token: currentSession.access_token,
      refresh_token: currentSession.refresh_token,
    });
  }

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return {
        user: null,
        error: "An account with this email already exists.",
      };
    }
    return { user: null, error: error.message };
  }

  const newUser = data.user;
  if (newUser) {
    const { error: dbError } = await supabase.from("admins").insert({
      id: newUser.id,
      email,
      display_name: displayName,
      role,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Failed to insert admin record:", dbError.message);
    }
  }

  return { user: newUser ?? null, error: null };
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
