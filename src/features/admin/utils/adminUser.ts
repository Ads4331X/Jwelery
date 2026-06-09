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
// Helpers
// ---------------------------------------------------------------------------

/**
 * Derives a clean display name from an internal email.
 * e.g. "admin@internal.admin" → "admin"
 */
export const displayNameFromEmail = (email: string): string =>
  email.split("@")[0];

// ---------------------------------------------------------------------------
// Admin CRUD  (requires `admins` table with columns: id, email, display_name, role, created_at)
// ---------------------------------------------------------------------------

export const listAdmins = async (): Promise<AdminAccount[]> => {
  const { data, error } = await supabase
    .from("admins")
    .select("id, email, display_name, role, created_at")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as AdminAccount[];
};

/**
 * Creates a new admin account.
 *
 * - email must be a full email (e.g. "alice@internal.admin")
 * - role defaults to "admin"; pass "super_admin" for elevated access
 *
 * NOTE: This calls supabase.auth.signUp which requires service-role key
 * in a server context for production. In dev / local Supabase this works
 * from the client because email confirmation is disabled.
 */
export const createAdmin = async (
  email: string,
  password: string,
  displayName: string,
  role: AdminRole = "admin",
): Promise<AdminResult> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, display_name: displayName },
    },
  });

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
      // Auth account was created; proceed — the DB row can be re-synced
    }
  }

  return { user: newUser ?? null, error: null };
};

/**
 * Deletes an admin from the `admins` table.
 *
 * Removing the Supabase Auth user requires the service-role key and should
 * be done via a server function / edge function in production.
 * Here we remove the DB record so the account can no longer pass the
 * role check in AuthProvider.
 */
export const deleteAdmin = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("admins").delete().eq("id", id);
  if (error) {
    console.error("Failed to delete admin:", error.message);
    return false;
  }
  return true;
};

/**
 * Updates the password for the currently signed-in admin.
 * Call this only when the user is already authenticated.
 */
export const updateOwnPassword = async (
  newPassword: string,
): Promise<{ error: string | null }> => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return { error: error.message };
  }
  return { error: null };
};
