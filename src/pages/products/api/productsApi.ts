import type { Product } from "../types";
import productData from "../data/productData";

const SIMULATED_NETWORK_DELAY = 700;

export async function fetchProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_NETWORK_DELAY));

  const response = {
    ok: true,
    data: productData,
  };

  if (!response.ok) {
    throw new Error(
      "Unable to load products at this time. Please try again later.",
    );
  }

  return response.data;
}

export async function fetchProductsFromApi(): Promise<Product[]> {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Failed to load products from the API.");
  }
  return response.json();
}
