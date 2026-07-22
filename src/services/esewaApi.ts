import { API_BASE_URL } from "../config/appConfig";
import { authHeaders } from "./authApi";

const API_BASE = API_BASE_URL;

export type EsewaInitiateResponse = {
  success?: boolean;
  error?: string;
  gatewayUrl?: string;
  fields?: Record<string, string>;
};

export type EsewaInitiatePayload = {
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

export async function initiateEsewaPayment(
  payload: EsewaInitiatePayload,
): Promise<{
  fields: Record<string, string>;
  action: string;
}> {
  const res = await fetch(`${API_BASE}/api/esewa/initiate`, {
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
    .catch(() => null)) as EsewaInitiateResponse | null;

  if (!res.ok || !json?.success || !json.gatewayUrl || !json.fields) {
    throw new Error(json?.error ?? `eSewa initiate failed (${res.status})`);
  }

  return {
    action: json.gatewayUrl,
    fields: json.fields,
  };
}
