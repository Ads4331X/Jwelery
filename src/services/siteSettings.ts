export type SiteSettings = {
  id: string;
  address: string;
  maps_url: string;
  email: string;
  phone: string;
  facebook_url: string;
  instagram_url: string;
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

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/site-settings`);
    const json = await res.json();
    if (json.success) return json.data;
    return null;
  } catch {
    return null;
  }
};

export const saveSiteSettings = async (
  settings: Omit<SiteSettings, "id" | "updated_at">,
): Promise<{ error: string | null }> => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/site-settings`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    const json = await res.json();
    if (!json.success) return { error: json.message };
    return { error: null };
  } catch {
    return { error: "Network error" };
  }
};
