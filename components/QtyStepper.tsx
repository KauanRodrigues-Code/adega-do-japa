"use client";
import { Minus, Plus } from "lucide-react";
import { MAX_QTY_PER_ITEM } from "@/lib/orderConfig";

export default function QtyStepper({ value, onChange, label, min = 1 }: { value: number; onChange: (n: number) => void; label: string; min?: number }) {
  const btn = "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 transition hover:border-japa-orange hover:text-japa-orange disabled:opacity-40 disabled:hover:border-white/20 disabled:hover:text-white";
  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={`Quantidade de ${label}`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Diminuir quantidade de ${label}`}><Minus size={16} aria-hidden /></button>
      <span className="min-w-6 text-center font-bold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY_PER_ITEM} aria-label={`Aumentar quantidade de ${label}`}><Plus size={16} aria-hidden /></button>
    </div>
  );
}
