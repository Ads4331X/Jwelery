// src/services/authApi.ts
import type { CustomerUser } from "../features/auth/context/context";
import { API_BASE_URL } from "../config/appConfig";
import { getAuthTokenCookie } from "../features/auth/context/authCookies";

const API_BASE = API_BASE_URL;

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

interface ApiEnvelope {
  success?: boolean;
  message?: string;
}

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

interface LoginResponse extends ApiEnvelope {
  data?: CustomerUser;
  token?: string;
}

interface SignupFieldError {
  param: string;
  msg: string;
}

interface SignupResponse extends ApiEnvelope {
  data?: CustomerUser;
  token?: string;
  errors?: SignupFieldError[];
}

interface SignupOtpVerifyResponse extends ApiEnvelope {
  data?: {
    token?: string;
    user?: CustomerUser;
  };
}

interface ResendOtpResponse extends ApiEnvelope {
  success?: boolean;
  message?: string;
}

interface ForgotPasswordVerifyResponse extends ApiEnvelope {
  resetToken?: string;
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

    const json = await safeJson<LoginResponse>(res);

    if (!res.ok || !json?.success) {
      return {
        user: null,
        token: null,
        error: json?.message ?? `Login failed (${res.status}).`,
      };
    }

    return { user: json.data ?? null, token: json.token ?? null, error: null };
  } catch (err) {
    console.error("Customer login network error:", err);
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

    const json = await safeJson<
      SignupResponse & { requiresVerification?: boolean }
    >(res);

    if (!res.ok || !json?.success) {
      // Map express-validator field errors into a flat object
      const fieldErrors: Record<string, string> = {};
      json?.errors?.forEach((e) => {
        fieldErrors[e.param] = e.msg;
      });
      return {
        user: null,
        token: null,
        error: json?.message ?? `Sign up failed (${res.status}).`,
        fieldErrors,
      };
    }

    // Backend returns requiresVerification and NO token during signup.
    return {
      user: null,
      token: null,
      error: null,
      // expose raw signup data for the UI flow
      data: json.data as unknown as { userId: string; email: string },
      requiresVerification: true,
    } as unknown as SignupResult & {
      data?: { userId: string; email: string };
      requiresVerification?: boolean;
    };
  } catch (err) {
    console.error("Customer signup network error:", err);
    return {
      user: null,
      token: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

/** Signup verification: POST /api/customer/signup/verify */
export async function verifySignupOtp(
  userId: string,
  code: string,
): Promise<{
  success: boolean;
  message?: string;
  data?: { token: string; user: CustomerUser | undefined };
}> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/signup/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, code }),
    });

    const json = await safeJson<SignupOtpVerifyResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        success: false,
        message: json?.message ?? `Verification failed (${res.status}).`,
      };
    }

    const token = json?.data?.token;
    if (!token) {
      return {
        success: false,
        message: json?.message ?? "Verification succeeded but token missing.",
      };
    }

    return {
      success: true,
      data: {
        token,
        user: json?.data?.user,
      },
    };
  } catch (err) {
    console.error("verifySignupOtp network error:", err);
    return { success: false, message: "Cannot reach server." };
  }
}

/** Resend signup OTP: POST /api/customer/signup/resend-otp */
export async function resendSignupOtp(
  userId: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/signup/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const json = await safeJson<ResendOtpResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        success: false,
        message: json?.message ?? `Resend failed (${res.status}).`,
      };
    }

    return { success: true };
  } catch (err) {
    console.error("resendSignupOtp network error:", err);
    return { success: false, message: "Cannot reach server." };
  }
}

/* ─── Forgot password (OTP flow): request → verify → reset ─────────────── */

/** Step 1: POST /api/customer/forgot-password/request — sends OTP to email */
export async function customerForgotPasswordRequest(
  email: string,
): Promise<{ error: string | null }> {
  try {
    const res = await fetch(
      `${API_BASE}/api/customer/forgot-password/request`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    const json = await safeJson<ApiEnvelope>(res);

    if (!res.ok || json?.success === false) {
      return { error: json?.message ?? `Request failed (${res.status}).` };
    }

    return { error: null };
  } catch (err) {
    console.error("Customer forgot-password request error:", err);
    return { error: "Cannot reach server. Check your connection." };
  }
}

/** Step 2: POST /api/customer/forgot-password/verify — returns a short-lived resetToken */
export async function customerForgotPasswordVerify(
  email: string,
  code: string,
): Promise<{ resetToken: string | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/forgot-password/verify`, {
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
    console.error("Customer forgot-password verify error:", err);
    return {
      resetToken: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

/** Step 3: POST /api/customer/forgot-password/reset — sets the new password */
export async function customerForgotPasswordReset(
  resetToken: string,
  newPassword: string,
): Promise<{ error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/forgot-password/reset`, {
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
    console.error("Customer forgot-password reset error:", err);
    return { error: "Cannot reach server. Check your connection." };
  }
}

/* ─── Profile + password (authenticated) ─────────────────────────────── */

interface UpdateProfileResponse extends ApiEnvelope {
  data?: CustomerUser;
}

/** PATCH /api/customer/profile */
export async function customerUpdateProfile(
  firstName: string,
  lastName?: string,
): Promise<{ user: CustomerUser | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ firstName, lastName: lastName ?? "" }),
    });

    const json = await safeJson<UpdateProfileResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        user: null,
        error: json?.message ?? `Update failed (${res.status}).`,
      };
    }

    return { user: json?.data ?? null, error: null };
  } catch (err) {
    console.error("Customer update profile error:", err);
    return { user: null, error: "Cannot reach server. Check your connection." };
  }
}

type ChangePasswordResponse = ApiEnvelope;

/** POST /api/customer/change-password */
export async function customerChangePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const json = await safeJson<ChangePasswordResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        error: json?.message ?? `Change password failed (${res.status}).`,
      };
    }

    return { error: null };
  } catch (err) {
    console.error("Customer change password error:", err);
    return { error: "Cannot reach server. Check your connection." };
  }
}
