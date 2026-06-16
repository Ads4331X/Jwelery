import { supabase } from "./supabase";

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

const TABLE = "site_settings";
const ROW_ID = "main";

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      "id, address, maps_url, email, phone, facebook_url, instagram_url, updated_at",
    )
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error || !data) return null;
  return data as SiteSettings;
};

export const saveSiteSettings = async (
  settings: Omit<SiteSettings, "id" | "updated_at">,
): Promise<{ error: string | null }> => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq("id", ROW_ID)
    .select("id");

  if (error) return { error: error.message };
  if (!data || data.length === 0)
    return {
      error:
        "Update was blocked by database policy (RLS). Check Supabase → Authentication → Policies for the site_settings table.",
    };
  return { error: null };
};
