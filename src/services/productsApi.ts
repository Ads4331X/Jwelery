import { supabase } from "./supabase";
import type {
  AdminProduct,
  ProductFormData,
} from "../features/admin/components/products/types";
import type { Product } from "../features/products/types";

const TABLE = "products";
const BUCKET = "product-images";

export const fetchAdminProducts = async (): Promise<AdminProduct[]> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as AdminProduct[];
};

// Used by the public Products page.
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      `
      id,
      name,
      category,
      description,
      price,
      image_url
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((item) => {
    // `image_url` may be either:
    // - a fully qualified public URL
    // - or a storage path/key (e.g. `170000-abc.jpg`)
    const maybeUrl = item.image_url ?? "";

    const isLikelyHttp = /^https?:\/\//i.test(maybeUrl);
    const image = isLikelyHttp
      ? maybeUrl
      : supabase.storage.from(BUCKET).getPublicUrl(maybeUrl).data.publicUrl;

    return {
      id: item.id,
      title: item.name,
      shortDescription: item.description,
      description: item.description,
      image,
      tags: [item.category],
      price: String(item.price),
    };
  });
};

export const createProduct = async (
  form: ProductFormData,
): Promise<{ error: string | null }> => {
  const { error } = await supabase.from(TABLE).insert(form);
  return { error: error?.message ?? null };
};

export const updateProduct = async (
  id: string,
  form: ProductFormData,
): Promise<{ error: string | null }> => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...form, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");

  if (error) return { error: error.message };
  if (!data || data.length === 0)
    return {
      error:
        "Update blocked by database policy. Check RLS for the products table.",
    };
  return { error: null };
};

export const deleteProduct = async (
  id: string,
): Promise<{ error: string | null }> => {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  return { error: error?.message ?? null };
};

export const uploadProductImage = async (
  file: File,
): Promise<{ url: string | null; error: string | null }> => {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false });

  if (uploadError) return { url: null, error: uploadError.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
};
