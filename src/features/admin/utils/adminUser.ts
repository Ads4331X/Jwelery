import { supabase } from "../../../services/supabase";
import type { User } from "@supabase/supabase-js";

export type AdminResult = {
  user: User | null;
  error: string | null;
};

/**
 * We use a single internal email per username to avoid Supabase's email
 * rate limit. No verification email is ever sent — the address is purely
 * internal and never exposed to users.
 */
const toEmail = (username: string) =>
  `${username.toLowerCase().trim()}@internal.admin`;

export const createAdmin = async (
  username: string,
  password: string,
): Promise<AdminResult> => {
  const email = toEmail(username);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: "admin", username } },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { user: null, error: null }; // already exists — not a real error
    }
    return { user: null, error: error.message };
  }

  return { user: data.user ?? null, error: null };
};

export const updateAdminPassword = async (
  newPassword: string,
): Promise<boolean> => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    console.error("Update password error:", error.message);
    return false;
  }
  return true;
};

/** Exported so AuthProvider can reuse the same email derivation */
export { toEmail };
