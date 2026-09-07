import type { Product } from "./product";
export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};
