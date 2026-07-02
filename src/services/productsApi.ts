// src/services/productsApi.ts
import type { Product } from "../features/products/types";
import type { AdminProduct } from "../features/admin/components/products/types";
import { API_BASE_URL } from "../config/appConfig";
import { authHeaders } from "./authApi";

const API_BASE = API_BASE_URL;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/* ─── GET /api/products  (public) ─────────────────────────────────────────── */
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products`);

  if (!res.ok) {
    throw new Error(`Failed to fetch products (${res.status})`);
  }

  const json = (await res.json()) as ApiResponse<Product[]>;

  if (!json.success) {
    throw new Error(json.message ?? "Failed to fetch products");
  }

  // The backend does not yet compute price from metal rates.
  // computedPrice stays null until you add that logic server-side.
  return json.data.map((p) => ({
    ...p,
    computedPrice: p.computedPrice ?? null,
  }));
}

/* ─── GET /api/products/:id  (public) ─────────────────────────────────────── */
export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${id}`);

  if (!res.ok) {
    throw new Error(`Product not found (${res.status})`);
  }

  const json = (await res.json()) as ApiResponse<Product>;

  if (!json.success) {
    throw new Error(json.message ?? "Product not found");
  }

  return { ...json.data, computedPrice: json.data.computedPrice ?? null };
}

/* ─── GET /api/categories  (public) ──────────────────────────────────────── */
export async function fetchCategories(): Promise<
  { id: string; name: string; slug: string }[]
> {
  const res = await fetch(`${API_BASE}/api/categories`);
  const json = (await res.json()) as ApiResponse<
    { id: string; name: string; slug: string }[]
  >;
  return json.data ?? [];
}

/* ─── Admin: create product (ADMIN / SUPER_ADMIN) ────────────────────────── */
export async function createProduct(data: unknown): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  const json = (await res.json()) as ApiResponse<Product>;
  if (!json.success) throw new Error(json.message ?? "Create failed");
  return json.data;
}

/* ─── Admin: update product ───────────────────────────────────────────────── */
export async function updateProduct(
  id: string,
  data: unknown,
): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  const json = (await res.json()) as ApiResponse<Product>;
  if (!json.success) throw new Error(json.message ?? "Update failed");
  return json.data;
}

/* ─── Admin: fetch admin products ──────────────────────────────────────── */
// Compatibility helper: some admin pages import this name.
export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  // Reuse the public endpoint; backend is expected to return admin-shaped products.
  return (await fetchProducts()) as unknown as AdminProduct[];
}

/* ─── Admin: upload product image ─────────────────────────────────────── */
export async function uploadProductImage(
  file: File,
): Promise<{ url: string; error?: string | null }> {
  // Placeholder until wired to backend.

  void file;
  return { url: "" };
}

// Matches ProductForm expectations: { id, name, slug }
export type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

/* ─── Admin: delete product ────────────────────────────────────────────── */
export async function deleteProduct(id: string): Promise<{
  error?: string;
  success?: boolean;
}> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const json = (await res.json()) as {
    success: boolean;
    message?: string;
  };

  if (!json.success) {
    return { error: json.message ?? "Delete failed" };
  }
  return { success: true };
}
