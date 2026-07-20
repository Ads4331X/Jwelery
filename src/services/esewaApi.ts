import { API_BASE_URL } from "../config/appConfig";

const API_BASE = API_BASE_URL;

export type EsewaInitiateResponse = {
  success?: boolean;
  error?: string;
  gatewayUrl?: string;
  fields?: Record<string, string>;
};

export async function initiateEsewaPayment(orderId: string): Promise<{
  fields: Record<string, string>;
  action: string;
}> {
  const res = await fetch(`${API_BASE}/esewa/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId }),
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
