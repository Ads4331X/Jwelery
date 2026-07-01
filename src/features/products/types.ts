export type MetalType = "GOLD" | "SILVER" | "DIAMOND" | "PLATINUM" | "OTHER";

export const METAL_LABELS: Record<MetalType, string> = {
  GOLD: "Gold",
  SILVER: "Silver",
  DIAMOND: "Diamond",
  PLATINUM: "Platinum",
  OTHER: "Other",
};

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

/** Shape returned by GET /products */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: { id: string; name: string; slug: string }; // ← object not string
  metalType: MetalType;
  weightGrams: number;
  purity: string | null;
  stock: number;
  isFeatured: boolean;
  isDealOfDay: boolean;
  isActive: boolean;
  images: ProductImage[];
  computedPrice: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Returns the primary image URL, or the first one, or null */
export function getPrimaryImage(product: Product): string | null {
  if (!product.images?.length) return null;
  return (
    product.images.find((img) => img.isPrimary)?.url ??
    product.images[0]?.url ??
    null
  );
}
