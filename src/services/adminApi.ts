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

/* ─── Shared response shapes ──────────────────────────────────────────── */

interface ApiEnvelope {
  success?: boolean;
  message?: string;
}

interface AdminLoginResponse extends ApiEnvelope {
  data?: AdminUser;
  token?: string;
}

interface ForgotPasswordVerifyResponse extends ApiEnvelope {
  resetToken?: string;
}

/* ─── Token helpers ────────────────────────────────────────────────────── */

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function adminAuthHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Parse JSON safely, never throw on a non-JSON body (e.g. an HTML 404 page).
 * Returns null if the body isn't valid JSON.
 */
async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
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

    const json = await safeJson<AdminLoginResponse>(res);

    if (!res.ok || !json?.success) {
      return {
        user: null,
        token: null,
        error: json?.message ?? `Login failed (${res.status}).`,
      };
    }

    return { user: json.data ?? null, token: json.token ?? null, error: null };
  } catch (err) {
    console.error("Admin login network error:", err);
    return {
      user: null,
      token: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

/* ─── Forgot password (OTP flow): request → verify → reset ─────────────── */

/** Step 1: POST /api/admin/forgot-password/request — sends OTP to email */
export async function adminForgotPasswordRequest(
  email: string,
): Promise<{ error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/forgot-password/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const json = await safeJson<ApiEnvelope>(res);

    if (!res.ok || json?.success === false) {
      return { error: json?.message ?? `Request failed (${res.status}).` };
    }

    return { error: null };
  } catch (err) {
    console.error("Admin forgot-password request error:", err);
    return { error: "Cannot reach server. Check your connection." };
  }
}

/** Step 2: POST /api/admin/forgot-password/verify — returns a short-lived resetToken */
export async function adminForgotPasswordVerify(
  email: string,
  code: string,
): Promise<{ resetToken: string | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/forgot-password/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const json = await safeJson<ForgotPasswordVerifyResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        resetToken: null,
        error: json?.message ?? `Verification failed (${res.status}).`,
      };
    }

    return { resetToken: json?.resetToken ?? null, error: null };
  } catch (err) {
    console.error("Admin forgot-password verify error:", err);
    return {
      resetToken: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

/** Step 3: POST /api/admin/forgot-password/reset — sets the new password */
export async function adminForgotPasswordReset(
  resetToken: string,
  newPassword: string,
): Promise<{ error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/forgot-password/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetToken, newPassword }),
    });

    const json = await safeJson<ApiEnvelope>(res);

    if (!res.ok || json?.success === false) {
      return { error: json?.message ?? `Reset failed (${res.status}).` };
    }

    return { error: null };
  } catch (err) {
    console.error("Admin forgot-password reset error:", err);
    return { error: "Cannot reach server. Check your connection." };
  }
}
