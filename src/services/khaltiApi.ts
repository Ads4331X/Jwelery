import { API_BASE_URL } from "../config/appConfig";
import { authHeaders } from "./authApi";

const API_BASE = API_BASE_URL;

export type KhaltiInitiateResponse = {
  success?: boolean;
  error?: string;
  payment_url?: string;
  pidx?: string;
};

export type KhaltiInitiatePayload = {
  items: { productId: string; qty: number }[];
  address?: {
    fullName: string;
    phone: string;
    streetAddress: string;
    city: string;
    deliveryNote?: string;
  };
  addressId?: string;
};

export async function initiateKhaltiPayment(
  payload: KhaltiInitiatePayload,
): Promise<{
  payment_url: string;
  pidx: string;
}> {
  const res = await fetch(`${API_BASE}/api/khalti/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const json = (await res
    .json()
    .catch(() => null)) as KhaltiInitiateResponse | null;

  if (!res.ok || !json?.success || !json.payment_url || !json.pidx) {
    throw new Error(json?.error ?? `Khalti initiate failed (${res.status})`);
  }

  return {
    payment_url: json.payment_url,
    pidx: json.pidx,
  };
}
