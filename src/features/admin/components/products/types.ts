export type ProductStatus = "Available" | "Sold Out";

export const METALS = ["Gold", "Silver", "Gold & Silver", "Other"];

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
];

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  metal: string;
  description: string;
  price: number | null;
  image_url: string;
  is_featured: boolean;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export type ProductFormData = Omit<
  AdminProduct,
  "id" | "created_at" | "updated_at"
>;
