"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getItem } from "./menu";
import { MAX_QTY_PER_ITEM } from "./orderConfig";

// O carrinho guarda SOMENTE { id, qty }. Preços nunca são salvos: são lidos do catálogo a cada render
// (e o servidor recalcula tudo na finalização). localStorage pode ser editado pelo cliente, por isso é só conveniência.
export type CartLine = { id: string; qty: number };
type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  hydrated: boolean;
  isOpen: boolean;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};
const Ctx = createContext<CartCtx | null>(null);
const KEY = "adega-cart-v1";
const clamp = (n: number) => Math.min(MAX_QTY_PER_ITEM, Math.max(1, Math.floor(n)));

function sanitize(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: CartLine[] = [];
  for (const r of raw) {
    if (typeof r !== "object" || r === null) continue;
    const { id, qty } = r as { id?: unknown; qty?: unknown };
    if (typeof id !== "string" || typeof qty !== "number" || !Number.isFinite(qty) || seen.has(id)) continue;
    const item = getItem(id);
    if (!item || item.available === false) continue;
    seen.add(id);
    out.push({ id, qty: clamp(qty) });
  }
  return out;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved) setLines(sanitize(JSON.parse(saved)));
    } catch { /* localStorage indisponível: segue sem persistência */ }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* ignora */ }
  }, [lines, hydrated]);

  const add = useCallback((id: string, qty = 1) => {
    const item = getItem(id);
    if (!item || item.available === false) return;
    setLines(prev => {
      const cur = prev.find(l => l.id === id);
      if (cur) return prev.map(l => (l.id === id ? { id, qty: clamp(l.qty + qty) } : l));
      return [...prev, { id, qty: clamp(qty) }];
    });
  }, []);
  const setQty = useCallback((id: string, qty: number) => setLines(prev => prev.map(l => (l.id === id ? { id, qty: clamp(qty) } : l))), []);
  const remove = useCallback((id: string) => setLines(prev => prev.filter(l => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartCtx>(() => ({
    lines,
    count: lines.reduce((s, l) => s + l.qty, 0),
    subtotalCents: lines.reduce((s, l) => s + (getItem(l.id)?.price ?? 0) * l.qty, 0),
    hydrated, isOpen, add, setQty, remove, clear, open, close,
  }), [lines, hydrated, isOpen, add, setQty, remove, clear, open, close]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return c;
}
