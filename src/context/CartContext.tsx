import { createContext, useContext, useEffect, useState } from "react";
import { trackEvent } from "../utils/analytics";
import type { CartContextValue } from "../types/cart";
import type { ReactNode } from "react";
import type { CartItem } from "../types/cart";
import type { Product } from "../types/product";

type CartProviderProps = {
  children: ReactNode;
};
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart_v1");
    return (saved ? JSON.parse(saved) : []) as CartItem[];
  });
  function addToCart(product: Product) {
    setItems((prev) => {
      const min = product.minimumOrderQuantity || 1;
      const existing = prev.find((x) => x.id === product.id);

      if (existing) {
        return prev.map((x) => {
          if (x.id !== product.id) return x;

          const nextQty = x.qty + min;

          const clampedQty =
            x.stock != null ? Math.min(nextQty, x.stock) : nextQty;

          return { ...x, qty: clampedQty };
        });
      }

      const newItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        stock: product.stock,
        minimumOrderQuantity: product.minimumOrderQuantity,
        discountPercentage: product.discountPercentage,
        qty: min,
      };

      return [...prev, newItem];
    });

    trackEvent("add_to_cart", {
      product_id: product.id,
      product_name: product.title,
      category: product.category,
      price: product.price,
    });
  }
  function setQty(id:number, nextQty:number) {
    setItems((prev) => {
      return prev.map((item) => {
        if (item.id !== id) return item;
        const minQty = item.minimumOrderQuantity || 1;
        let safeQty = nextQty;
        if (safeQty < minQty) {
          safeQty = minQty;
          return { ...item, qty: safeQty };
        }
        if (item.stock != null && safeQty > item.stock) {
          safeQty = item.stock;
          return { ...item, qty: safeQty };
        }
        return { ...item, qty: safeQty };
      });
    });
  }
  function removeFromCart(id:number) {
    const removedItem = items.find((item) => item.id === id);

    setItems((prev) => prev.filter((item) => item.id !== id));

    if (removedItem) {
      trackEvent("remove_from_cart", {
        product_id: removedItem.id,
        product_name: removedItem.title,
        price: removedItem.price,
      });
    }
  }
  useEffect(() => {
    localStorage.setItem("cart_v1", JSON.stringify(items));
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, setQty, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
