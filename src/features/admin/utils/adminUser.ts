import { supabase } from "../../../services/supabase";
import type { User } from "@supabase/supabase-js";

export type AdminResult = {
  user: User | null;
  error: string | null;
};

export type AdminAccount = {
  id: string;
  username: string;
  role: string;
  created_at: string;
};

/**
 * We use a single internal email per username to avoid Supabase's email
 * rate limit. No verification email is ever sent — the address is purely
 * internal and never exposed to users.
 */
const toEmail = (username: string) =>
  `${username.toLowerCase().trim()}@internal.admin`;

let useDb: boolean | null = null;

export const checkDbAvailability = async (): Promise<boolean> => {
  if (useDb !== null) return useDb;
  try {
    const { error } = await supabase.from("admins").select("id").limit(1);
    if (
      error &&
      (error.message.includes("Could not find the table") ||
        error.code === "PGRST116")
    ) {
      useDb = false;
    } else {
      useDb = true;
    }
  } catch {
    useDb = false;
  }
  return useDb || false;
};

// Local storage helper functions
export const getLocalAdmins = (): AdminAccount[] => {
  const data = localStorage.getItem("local_admins");
  if (!data) {
    const initial: AdminAccount[] = [
      {
        id: "super-admin-id",
        username: "admin",
        role: "admin",
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem("local_admins", JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const saveLocalAdmins = (admins: AdminAccount[]) => {
  localStorage.setItem("local_admins", JSON.stringify(admins));
};

export const getLocalCredentials = (): Record<string, string> => {
  const data = localStorage.getItem("local_credentials");
  if (!data) {
    const initial = { admin: "123456" };
    localStorage.setItem("local_credentials", JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const saveLocalCredentials = (creds: Record<string, string>) => {
  localStorage.setItem("local_credentials", JSON.stringify(creds));
};

export const isSuperAdmin = (user: User | null): boolean => {
  if (!user) return false;
  const username = user.user_metadata?.username ?? user.email?.split("@")[0];
  return username?.toLowerCase() === "admin";
};

export const listAdmins = async (): Promise<AdminAccount[]> => {
  const hasDb = await checkDbAvailability();
  if (hasDb) {
    const { data, error } = await supabase
      .from("admins")
      .select("id, username, role, created_at")
      .order("created_at", { ascending: true });
    if (!error && data) {
      return data as AdminAccount[];
    }
  }
  return getLocalAdmins();
};

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

  const user = data.user;
  if (user) {
    const adminRecord: AdminAccount = {
      id: user.id,
      username,
      role: "admin",
      created_at: new Date().toISOString(),
    };

    const hasDb = await checkDbAvailability();
    if (hasDb) {
      await supabase.from("admins").insert(adminRecord);
    }

    // Always sync with localStorage
    const local = getLocalAdmins();
    if (
      !local.some((a) => a.username.toLowerCase() === username.toLowerCase())
    ) {
      local.push(adminRecord);
      saveLocalAdmins(local);
    }

    const localCreds = getLocalCredentials();
    localCreds[username.toLowerCase()] = password;
    saveLocalCredentials(localCreds);
  }

  return { user: data.user ?? null, error: null };
};

export const updateAdminUsername = async (
  username: string,
  userId: string,
): Promise<boolean> => {
  const { error } = await supabase.auth.updateUser({
    data: { username },
  });

  if (error) {
    console.error("Update username error:", error.message);
    return false;
  }

  const hasDb = await checkDbAvailability();
  if (hasDb) {
    await supabase.from("admins").update({ username }).eq("id", userId);
  }

  // Sync with localStorage
  const local = getLocalAdmins();
  const index = local.findIndex((a) => a.id === userId);
  if (index !== -1) {
    local[index].username = username;
    saveLocalAdmins(local);
  }

  return true;
};

export const updateAdminPassword = async (
  newPassword: string,
  username?: string,
): Promise<boolean> => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    console.error("Update password error:", error.message);
    return false;
  }

  if (username) {
    const localCreds = getLocalCredentials();
    localCreds[username.toLowerCase()] = newPassword;
    saveLocalCredentials(localCreds);
  }
  return true;
};

export const deleteAdminAccount = async (
  id: string,
  username: string,
): Promise<boolean> => {
  const hasDb = await checkDbAvailability();
  if (hasDb) {
    await supabase.from("admins").delete().eq("id", id);
  }

  // Sync with localStorage
  const local = getLocalAdmins();
  const updated = local.filter((a) => a.id !== id);
  saveLocalAdmins(updated);

  const localCreds = getLocalCredentials();
  delete localCreds[username.toLowerCase()];
  saveLocalCredentials(localCreds);

  return true;
};

export const resetAdminAccount = async (
  username: string,
  newPassword: string,
): Promise<boolean> => {
  const hasDb = await checkDbAvailability();
  if (hasDb) {
    await supabase
      .from("admins")
      .update({ temp_password: newPassword })
      .eq("username", username);
  }

  // Update localStorage credentials
  const localCreds = getLocalCredentials();
  localCreds[username.toLowerCase()] = newPassword;
  saveLocalCredentials(localCreds);

  return true;
};

/** Exported so AuthProvider can reuse the same email derivation */
export { toEmail };
