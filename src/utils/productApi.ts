import type { Product } from "../types/product";
import type { ProductsResponse } from "../types/api";

export async function getProducts(limit: number = 12): Promise<Product[]> {
  const response = await fetch(`https://dummyjson.com/products?limit=${limit}`);
  if (!response.ok) {
    throw new Error("Ops! Something went wrong.");
  }
  const data = (await response.json()) as ProductsResponse;
  return data.products;
}
export async function getProductsById(id: number | string): Promise<Product> {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  if (!response.ok) {
    throw new Error("Ops! Something went wrong.");
  }
  const data = (await response.json()) as Product;
  return data;
}
