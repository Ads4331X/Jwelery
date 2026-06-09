import { supabase } from "../../../services/supabase";

export type MetalRateRow = {
  gold_tola: number;
  gold_ten_gram: number;
  silver_tola: number;
  silver_ten_gram: number;
  visible: boolean;
  updated_at: string;
};

const TABLE = "metal_rates";
const ROW_ID = 1;

export const getMetalRates = async (): Promise<MetalRateRow | null> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      "gold_tola, gold_ten_gram, silver_tola, silver_ten_gram, visible, updated_at",
    )
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error || !data) return null;
  return data as MetalRateRow;
};

export const saveMetalRates = async (
  rates: Omit<MetalRateRow, "visible" | "updated_at">,
): Promise<{ error: string | null }> => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...rates, updated_at: new Date().toISOString() })
    .eq("id", ROW_ID)
    .select("id");

  if (error) return { error: error.message };
  if (!data || data.length === 0)
    return {
      error:
        "Update was blocked by database policy (RLS). Check Supabase → Authentication → Policies for the metal_rates table.",
    };
  return { error: null };
};

export const saveVisibility = async (
  visible: boolean,
): Promise<{ error: string | null }> => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ visible, updated_at: new Date().toISOString() })
    .eq("id", ROW_ID)
    .select("id");

  if (error) return { error: error.message };
  if (!data || data.length === 0)
    return {
      error:
        "Update was blocked by database policy (RLS). Check Supabase → Authentication → Policies for the metal_rates table.",
    };
  return { error: null };
};
