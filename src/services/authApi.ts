// src/services/authApi.ts
import type { CustomerUser } from "../features/auth/context/context";
import { API_BASE_URL } from "../config/appConfig";

const API_BASE = API_BASE_URL;

import { getAuthTokenCookie } from "../features/auth/context/authCookies";

export const TOKEN_KEY = "aj_cust_token";

/** Get stored JWT — used by other services to attach Authorization header */
export function getToken(): string | null {
  return getAuthTokenCookie();
}

/** Returns headers with Bearer token if logged in */
export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ─── Response shapes ─────────────────────────────────────────────────────── */

interface LoginResult {
  user: CustomerUser | null;
  token: string | null;
  error: string | null;
}

interface SignupResult {
  user: CustomerUser | null;
  token: string | null;
  error: string | null;
  fieldErrors?: Record<string, string>;
}

/* ─── POST /api/customer/auth ─────────────────────────────────────────────── */

export async function customerLogin(
  email: string,
  password: string,
): Promise<LoginResult> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = (await res.json()) as {
      success: boolean;
      message?: string;
      data?: CustomerUser;
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

/* ─── POST /api/customer/signup ───────────────────────────────────────────── */

export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  username?: string;
  phone?: string;
}

export async function customerSignup(
  payload: SignupPayload,
): Promise<SignupResult> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = (await res.json()) as {
      success: boolean;
      message?: string;
      data?: CustomerUser;
      token?: string;
      errors?: { param: string; msg: string }[];
    };

    if (!json.success) {
      // Map express-validator field errors into a flat object
      const fieldErrors: Record<string, string> = {};
      json.errors?.forEach((e) => {
        fieldErrors[e.param] = e.msg;
      });
      return {
        user: null,
        token: null,
        error: json.message ?? "Sign up failed.",
        fieldErrors,
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
