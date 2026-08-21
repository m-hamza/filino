/** ماژول استیت سراسری: سبد خرید، احراز هویت و اعلان‌ها */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { productBySlug } from "../data/products";

export interface User { name: string; email: string }
export interface CartItem { slug: string; qty: number }
export interface ToastMsg { id: number; kind: "success" | "error" | "info"; text: string }

interface AppState {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;

  cart: CartItem[];
  addToCart: (slug: string, qty?: number) => void;
  removeFromCart: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  discount: number;
  discountCode: string | null;
  applyDiscount: (code: string) => boolean;
  placeOrder: () => string;

  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  authOpen: boolean;
  setAuthOpen: (v: boolean) => void;

  toasts: ToastMsg[];
  toast: (text: string, kind?: ToastMsg["kind"]) => void;
}

const Ctx = createContext<AppState | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => load("filino:user", null));
  const [cart, setCart] = useState<CartItem[]>(() => load("filino:cart", []));
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem("filino:user", JSON.stringify(user));
      localStorage.setItem("filino:cart", JSON.stringify(cart));
    } catch { /* حافظه در دسترس نیست */ }
  }, [user, cart]);

  const toast = useCallback((text: string, kind: ToastMsg["kind"] = "success") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, kind, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  const login = useCallback((u: User) => setUser(u), []);
  const logout = useCallback(() => {
    setUser(null);
    setDiscountCode(null);
  }, []);

  const addToCart = useCallback((slug: string, qty = 1) => {
    setCart((c) => {
      const found = c.find((i) => i.slug === slug);
      return found ? c.map((i) => (i.slug === slug ? { ...i, qty: Math.min(i.qty + qty, 5) } : i)) : [...c, { slug, qty }];
    });
  }, []);

  const removeFromCart = useCallback((slug: string) => setCart((c) => c.filter((i) => i.slug !== slug)), []);
  const setQty = useCallback((slug: string, qty: number) => {
    if (qty <= 0) return setCart((c) => c.filter((i) => i.slug !== slug));
    setCart((c) => c.map((i) => (i.slug === slug ? { ...i, qty: Math.min(qty, 5) } : i)));
  }, []);
  const clearCart = useCallback(() => {
    setCart([]);
    setDiscountCode(null);
  }, []);

  const applyDiscount = useCallback((code: string) => {
    const ok = /^OFF20$/i.test(code.trim()) || /^FILINO10$/i.test(code.trim());
    if (ok) setDiscountCode(code.trim().toUpperCase());
    return ok;
  }, []);

  const placeOrder = useCallback(() => {
    const id = `FN-${String(Date.now()).slice(-5)}`;
    clearCart();
    return id;
  }, [clearCart]);

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, i) => sum + (productBySlug(i.slug)?.price ?? 0) * i.qty, 0),
    [cart]
  );
  const discount = useMemo(() => {
    if (!discountCode) return 0;
    return discountCode === "OFF20" ? Math.round(cartSubtotal * 0.2) : Math.round(cartSubtotal * 0.1);
  }, [discountCode, cartSubtotal]);
  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);

  const value: AppState = {
    user, login, logout,
    cart, addToCart, removeFromCart, setQty, clearCart,
    cartCount, cartSubtotal, discount, discountCode, applyDiscount, placeOrder,
    cartOpen, setCartOpen, authOpen, setAuthOpen,
    toasts, toast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp باید داخل AppProvider استفاده شود");
  return ctx;
}
