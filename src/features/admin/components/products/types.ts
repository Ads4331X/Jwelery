export type ProductStatus = "Available" | "Sold Out";

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
  is_featured: boolean;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

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

export type ProductFormData = Omit<
  AdminProduct,
  "id" | "created_at" | "updated_at"
>;
