"use client";
import { Trash2 } from "lucide-react";
import { formatBRL, getItem } from "@/lib/menu";
import { useCart, type CartLine } from "@/lib/cart";
import QtyStepper from "./QtyStepper";

export default function CartItem({ line }: { line: CartLine }) {
  const { setQty, remove } = useCart();
  const item = getItem(line.id);
  if (!item) return null;
  return (
    <li className="rounded-2xl border border-white/10 bg-black/30 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold leading-snug">{item.name}</p>
          <p className="text-sm text-white/60">{formatBRL(item.price)} cada</p>
        </div>
        <p className="shrink-0 font-display text-xl text-japa-gold">{formatBRL(item.price * line.qty)}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <QtyStepper value={line.qty} onChange={n => setQty(line.id, n)} label={item.name} />
        <button type="button" onClick={() => remove(line.id)} aria-label={`Remover ${item.name} do carrinho`} className="grid h-11 w-11 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-japa-red"><Trash2 size={18} aria-hidden /></button>
      </div>
    </li>
  );
}
