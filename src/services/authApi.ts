const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface AdminLoginResponse {
  message: string;
  success: boolean;
  data: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
  token: string;
}

export interface AdminRoleResponse {
  message: string;
  success: boolean;
  data: {
    role: string;
    username: string;
    email: string;
  };
}

/**
 * POST /api/admin/auth — Admin login
 * Returns the token and user data on success, or throws with the error message.
 */
export async function loginAdmin(
  email: string,
  password: string,
): Promise<{ token: string; user: AdminLoginResponse["data"] }> {
  const res = await fetch(`${API_URL}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const body = await res.json();

  if (!res.ok || !body.success) {
    throw new Error(body.message || "Login failed.");
  }

  return { token: body.token, user: body.data };
}

/**
 * GET /api/admin/role — Fetch the authenticated admin's role & info.
 * Returns user data or null if the token is invalid/expired.
 */
export async function fetchAdminRole(
  token: string,
): Promise<AdminRoleResponse["data"] | null> {
  try {
    const res = await fetch(`${API_URL}/api/admin/role`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;

    const body = await res.json();
    if (!body.success) return null;

    return body.data;
  } catch {
    return null;
  }
}
