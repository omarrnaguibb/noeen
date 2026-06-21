import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "noeen-cart";
const TOAST_DURATION_MS = 5000;

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const dismissToast = () => setToast(null);

  const addToCart = (service) => {
    let nextToast = null;

    setItems((current) => {
      const existing = current.find((item) => item.id === service.id);
      if (existing) {
        nextToast = { type: "duplicate", product: service };
        return current;
      }
      nextToast = { type: "added", product: service };
      return [...current, { ...service, quantity: 1 }];
    });

    if (nextToast) {
      setToast(nextToast);
    }
  };

  const removeFromCart = (serviceId) => {
    setItems((current) => current.filter((item) => item.id !== serviceId));
  };

  const updateQuantity = (serviceId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.id === serviceId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = {
    items,
    toast,
    toastDurationMs: TOAST_DURATION_MS,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    dismissToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
