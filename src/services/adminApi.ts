// src/services/adminApi.ts
import { API_BASE_URL } from "../config/appConfig";

const API_BASE = API_BASE_URL;

export const ADMIN_TOKEN_KEY = "admin_token";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "DELIVERY_STAFF";

export interface AdminUser {
  id: string;
  email: string;
  username: string | null;
  role: AdminRole;
}

interface AdminLoginResult {
  user: AdminUser | null;
  token: string | null;
  error: string | null;
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function adminAuthHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ─── POST /api/admin/auth ─────────────────────────────────────────────── */
export async function adminLogin(
  email: string,
  password: string,
): Promise<AdminLoginResult> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = (await res.json()) as {
      success: boolean;
      message?: string;
      data?: AdminUser;
      token?: string;
    };

    if (!json.success) {
      return {
        user: null,
        token: null,
        error: json.message ?? "Login failed.",
      };
    }

    return { user: json.data!, token: json.token!, error: null };
  } catch {
    return {
      user: null,
      token: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}
