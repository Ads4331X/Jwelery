export interface Product {
  id: string;
  name: string;
  category: string;
  metal: string;
  description: string;
  price: number | null;
  image_url: string;
  is_featured: boolean;
  status: "Available" | "Sold Out";
  created_at: string;
  updated_at: string;
}
