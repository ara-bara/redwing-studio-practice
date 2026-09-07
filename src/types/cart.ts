import type { Product } from "./product";

export type CartItem = Pick<
  Product,
  | "id"
  | "title"
  | "price"
  | "thumbnail"
  | "stock"
  | "minimumOrderQuantity"
  | "discountPercentage"
> & {
  qty: number;
};

export type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  setQty: (id: number, nextQty: number) => void;
  removeFromCart: (id: number) => void;
};
