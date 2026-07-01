// ─── Enums (mirror Prisma) ────────────────────────────────────────────────────

export type MetalType = "GOLD" | "SILVER" | "DIAMOND" | "PLATINUM" | "OTHER";
export type MakingChargeType = "FIXED" | "PERCENTAGE";

// ─── Display helpers ──────────────────────────────────────────────────────────

export const METAL_LABELS: Record<MetalType, string> = {
  GOLD: "Gold",
  SILVER: "Silver",
  DIAMOND: "Diamond",
  PLATINUM: "Platinum",
  OTHER: "Other",
};

export const METALS: MetalType[] = [
  "GOLD",
  "SILVER",
  "DIAMOND",
  "PLATINUM",
  "OTHER",
];

export const METAL_FILTER_OPTIONS = ["All", ...METALS] as const;

// Kept for ProductFilters — UI-only, not sent to backend
export const CATEGORIES = [
  "All",
  "Necklace",
  "Ring",
  "Earring",
  "Bracelet",
  "Bangle",
  "Pendant",
  "Bridal",
  "Other",
] as const;

// ─── API shapes ───────────────────────────────────────────────────────────────

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

/** Shape returned by GET /admin/products */
export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: { id: string; name: string; slug: string };
  metalType: MetalType;
  weightGrams: number;
  purity: string | null;
  makingCharge: number;
  makingChargeType: MakingChargeType;
  wastagePercent: number;
  vatPercent: number;
  stock: number;
  isFeatured: boolean;
  isDealOfDay: boolean;
  isActive: boolean;
  sortOrder: number;
  images: ProductImage[];
  computedPrice: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Shape sent to POST /api/products and PUT /api/products/:id */
export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  metalType: MetalType;
  weightGrams: number | "";
  purity: string;
  makingCharge: number | "";
  makingChargeType: MakingChargeType;
  wastagePercent: number | "";
  vatPercent: number | "";
  stock: number | "";
  isFeatured: boolean;
  isDealOfDay: boolean;
  isActive: boolean;
  imageUrls: string[];
}
