import { API_BASE_URL } from "../config/appConfig";

const API_BASE = API_BASE_URL;

export type EsewaInitiateResponse = {
  success?: boolean;
  error?: string;
  data?: {
    action: string;
    method: "POST";
    formFields: Record<string, string>;
  };
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

  if (!res.ok || !json?.success || !json.data?.formFields) {
    throw new Error(
      json?.error ??
        json?.data?.formFields?.error ??
        `eSewa initiate failed (${res.status})`,
    );
  }

  return {
    action: json.data.action,
    fields: json.data.formFields,
  };
}
