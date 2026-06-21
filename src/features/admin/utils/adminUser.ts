import type { AdminRole } from "../../auth/context/context";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export type AdminAccount = {
  id: string;
  email: string;
  display_name: string;
  role: AdminRole;
  created_at: string;
};

export type CreatedAdminUser = {
  id: string;
  email: string;
  user_metadata: {
    username: string;
    role: AdminRole;
  };
};

export type AdminResult = {
  user: CreatedAdminUser | null;
  error: string | null;
};

//  Reusable helper so catch blocks never need `any`
function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "An unexpected error occurred.";
}

//  Auth header helper
function authHeaders(
  extra: Record<string, string> = {},
): Record<string, string> {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

// Read

export const listAdmins = async (): Promise<AdminAccount[]> => {
  const res = await fetch(`${API_URL}/api/admin/accounts`, {
    method: "GET",
    headers: authHeaders(),
  });
  const body = await res.json();
  if (!res.ok || !body.success) return [];
  return body.admins as AdminAccount[];
};

// Create

export const createAdmin = async (
  email: string,
  password: string,
  username: string,
  role: AdminRole = "ADMIN",
): Promise<AdminResult> => {
  try {
    const res = await fetch(`${API_URL}/api/admin/signup`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ email, password, username, role }),
    });

    const body = await res.json();
    if (!res.ok || !body.success) {
      return { user: null, error: body.message || "Failed to create admin." };
    }

    //  Properly typed — no `as any`
    const newUser: CreatedAdminUser = {
      id: body.admin?.id ?? body.user?.id ?? "",
      email: body.admin?.email ?? body.user?.email ?? email,
      user_metadata: { username, role },
    };

    return { user: newUser, error: null };
  } catch (err: unknown) {
    return { user: null, error: errorMessage(err) };
  }
};

// Delete

export const deleteAdmin = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/api/admin/accounts/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      console.error("Failed to delete admin:", body.message);
      return false;
    }
    return true;
  } catch (err: unknown) {
    console.error("Failed to delete admin:", errorMessage(err));
    return false;
  }
};

// Password (own account only)

export const updateOwnPassword = async (
  newPassword: string,
): Promise<{ error: string | null }> => {
  try {
    const res = await fetch(`${API_URL}/api/admin/accounts/profile`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ password: newPassword }),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      return { error: body.message || "Failed to update password." };
    }
    return { error: null };
  } catch (err: unknown) {
    return { error: errorMessage(err) };
  }
};

// Role

export const updateAdminRole = async (
  id: string,
  role: AdminRole,
): Promise<{ error: string | null }> => {
  try {
    const res = await fetch(`${API_URL}/api/admin/accounts/${id}/role`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ role }),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      return { error: body.message || "Failed to update role." };
    }
    return { error: null };
  } catch (err: unknown) {
    return { error: errorMessage(err) };
  }
};

// Display Name (own account)

export const updateDisplayName = async (
  displayName: string,
): Promise<{ error: string | null }> => {
  try {
    const res = await fetch(`${API_URL}/api/admin/accounts/profile`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ username: displayName }),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      return { error: body.message || "Failed to update username." };
    }
    return { error: null };
  } catch (err: unknown) {
    return { error: errorMessage(err) };
  }
};
