import { API_BASE_URL } from "../config/appConfig";
import { authHeaders, getToken } from "./authApi";

const API_BASE = API_BASE_URL;

type ApiEnvelope = {
  success?: boolean;
  message?: string;
};

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function authMaybeHeaders(): Record<string, string> {
  // authHeaders() already checks token existence.
  const token = getToken();
  if (!token) return {};
  return authHeaders();
}

export type SavedAddress = {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string | null;
  postalCode: string | null;
  isDefault: boolean;
};

type GetAddressesResponse = ApiEnvelope & {
  data?: SavedAddress[];
};

type CreateAddressPayload = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  isDefault?: boolean;
};

type UpdateAddressPayload = Partial<CreateAddressPayload> & {
  fullName: string;
  phone: string;
  street: string;
  city: string;
};

type SingleAddressResponse = ApiEnvelope & {
  data?: SavedAddress;
};

type DeleteAddressResponse = ApiEnvelope & {
  data?: { id?: string };
};

export async function getAddresses(): Promise<{
  data: SavedAddress[] | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/addresses`, {
      method: "GET",
      headers: {
        ...authMaybeHeaders(),
      },
    });

    const json = await safeJson<GetAddressesResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Fetch addresses failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? [], error: null };
  } catch (err) {
    console.error("Get addresses network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

export async function createAddress(
  payload: CreateAddressPayload,
): Promise<{ data: SavedAddress | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authMaybeHeaders(),
      },
      body: JSON.stringify(payload),
    });

    const json = await safeJson<SingleAddressResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Create address failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    console.error("Create address network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

export async function updateAddress(
  id: string,
  payload: UpdateAddressPayload,
): Promise<{ data: SavedAddress | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/addresses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authMaybeHeaders(),
      },
      body: JSON.stringify(payload),
    });

    const json = await safeJson<SingleAddressResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Update address failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    console.error("Update address network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

export async function deleteAddress(
  id: string,
): Promise<{ data: { id?: string } | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/customer/addresses/${id}`, {
      method: "DELETE",
      headers: {
        ...authMaybeHeaders(),
      },
    });

    const json = await safeJson<DeleteAddressResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Delete address failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    console.error("Delete address network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}

export async function setDefaultAddress(
  id: string,
): Promise<{ data: SavedAddress | null; error: string | null }> {
  try {
    const res = await fetch(
      `${API_BASE}/api/customer/addresses/${id}/default`,
      {
        method: "PATCH",
        headers: {
          ...authMaybeHeaders(),
        },
      },
    );

    const json = await safeJson<SingleAddressResponse>(res);

    if (!res.ok || json?.success === false) {
      return {
        data: null,
        error: json?.message ?? `Set default address failed (${res.status}).`,
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    console.error("Set default address network error:", err);
    return {
      data: null,
      error: "Cannot reach server. Check your connection.",
    };
  }
}
