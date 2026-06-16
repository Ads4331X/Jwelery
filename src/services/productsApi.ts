import { supabase } from "./supabase";
import type { Product } from "../features/products/types";
import type {
  AdminProduct,
  ProductFormData,
} from "../features/admin/components/products/types";

const TABLE = "products";
const BUCKET = "product-images";

export const fetchProducts = async (): Promise<Product[]> => {
  // Fetch all products regardless of status; UI will handle Sold Out display
  // Sort featured items first, then most recent
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
};

export const fetchAdminProducts = async (): Promise<AdminProduct[]> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as AdminProduct[];
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
  // Helper to resize and convert image to WebP before uploading
  const resizeImage = (
    inputFile: File,
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Compression failed"));
          },
          "image/webp",
          quality,
        );
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = URL.createObjectURL(inputFile);
    });
  };

  // Attempt to resize/compress; fall back to original file on failure
  let blob: Blob = file;
  try {
    blob = await resizeImage(file);
  } catch {
    // keep original file
  }

  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { upsert: false, contentType: "image/webp" });

  if (uploadError) return { url: null, error: uploadError.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
};
