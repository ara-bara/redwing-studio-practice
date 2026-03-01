import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  function addToCart(product) {
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
  }
  function setQty(id, nextQty) {
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
  function removeFromCart(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

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
