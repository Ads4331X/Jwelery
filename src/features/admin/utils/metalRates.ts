export type MetalRateRow = {
  gold_tola: number;
  gold_ten_gram: number;
  silver_tola: number;
  silver_ten_gram: number;
  visible: boolean;
  updated_at: string;
};

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const METAL_RATES_ENDPOINTS = [
  `${API_BASE}/api/admin/metal-rates`,
  `${API_BASE}/api/admin/metalRates`,
];

const METAL_VISIBILITY_ENDPOINTS = [
  `${API_BASE}/api/admin/metal-rates/visibility`,
  `${API_BASE}/api/admin/metalRates/visibility`,
];

const parseResponse = async (res: Response) => {
  const json = await res.json().catch(() => null);
  if (json && json.success) return { success: true, data: json.data };
  return {
    success: false,
    message:
      json?.message ?? json?.error ?? res.statusText ?? "Request failed.",
  };
};

export const getMetalRates = async (): Promise<MetalRateRow | null> => {
  for (const url of METAL_RATES_ENDPOINTS) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const result = await parseResponse(res);
      if (result.success) return result.data as MetalRateRow;
    } catch {
      continue;
    }
  }
  return null;
};

export const saveMetalRates = async (
  rates: Omit<MetalRateRow, "visible" | "updated_at">,
): Promise<{ error: string | null }> => {
  for (const url of METAL_RATES_ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(rates),
      });
      const result = await parseResponse(res);
      if (result.success) return { error: null };
      if (!res.ok) continue;
      return { error: result.message };
    } catch {
      continue;
    }
  }
  return { error: "Network error or invalid endpoint." };
};

export const saveVisibility = async (
  visible: boolean,
): Promise<{ error: string | null }> => {
  for (const url of METAL_VISIBILITY_ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ visible }),
      });
      const result = await parseResponse(res);
      if (result.success) return { error: null };
      if (!res.ok) continue;
      return { error: result.message };
    } catch {
      continue;
    }
  }
  return { error: "Network error or invalid endpoint." };
};
