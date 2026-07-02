import type { AuthContextValue } from "../../auth/context/context";

type AppRole = AuthContextValue["role"] extends infer R ? R : never;

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "DELIVERY_STAFF";

export type AdminAccount = {
  id: string;
  email: string;
  display_name: string;
  role: AdminRole;
  created_at: string;
};

export type AdminResult = {
  user: any | null;
  error: string | null;
};

import { API_BASE_URL } from "../../../config/appConfig";

const API_BASE = API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const listAdmins = async (): Promise<AdminAccount[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/accounts`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (json.success) return json.admins;
    return [];
  } catch {
    return [];
  }
};

export const createAdmin = async (
  email: string,
  password: string,
  displayName: string,
  role: AdminRole = "ADMIN",
): Promise<AdminResult> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/signup`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password, username: displayName, role }),
    });
    const json = await res.json();
    if (!json.success)
      return { user: null, error: json.message || "Signup failed" };
    return { user: json.data, error: null };
  } catch (err) {
    return { user: null, error: "Network error" };
  }
};

export const deleteAdmin = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/accounts/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    return json.success;
  } catch {
    return false;
  }
};

export const updateOwnPassword = async (
  newPassword: string,
): Promise<{ error: string | null }> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/accounts/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ password: newPassword }),
    });
    const json = await res.json();
    if (!json.success) return { error: json.message };
    return { error: null };
  } catch {
    return { error: "Network error" };
  }
};

export const updateAdminRole = async (
  id: string,
  role: AppRole,
): Promise<{ error: string | null }> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/accounts/${id}/role`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    const json = await res.json();
    if (!json.success) return { error: json.message };
    return { error: null };
  } catch {
    return { error: "Network error" };
  }
};

export const updateDisplayName = async (
  displayName: string,
): Promise<{ error: string | null }> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/accounts/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ username: displayName }),
    });
    const json = await res.json();
    if (!json.success) return { error: json.message };
    return { error: null };
  } catch {
    return { error: "Network error" };
  }
};
