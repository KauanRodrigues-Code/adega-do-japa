"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Beer, Check, ShoppingCart } from "lucide-react";
import { formatBRL, type MenuItem } from "@/lib/menu";
import { useCart } from "@/lib/cart";
import QtyStepper from "./QtyStepper";

export default function ProductCard({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const available = item.available !== false;

  const onAdd = () => {
    add(item.id, qty);
    setAdded(true);
    setQty(1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <li className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-japa-graphite to-japa-card transition hover:border-japa-orange/50">
      <div className="relative aspect-square w-full bg-black">
        {item.image ? (
          <Image src={item.image} alt={`${item.name}, produto da Adega do Japa`} fill sizes="(min-width:1024px) 22vw, (min-width:640px) 30vw, 46vw" className="object-cover" />
        ) : (
          <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_40%,rgba(255,106,0,.28),transparent_60%)] p-3 text-center">
            <div>
              <Beer className="mx-auto text-japa-gold" size={34} aria-hidden />
              <p className="mt-2 font-display text-lg uppercase leading-tight">Adega <span className="text-japa-orange">do Japa</span></p>
              <p className="mt-1 text-xs text-white/50">Foto em breve</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold leading-snug">{item.name}</h3>
          <p className="mt-1 font-display text-2xl text-japa-gold">{formatBRL(item.price)}</p>
          {item.flavorNote && <p className="mt-1 text-xs text-white/60">Informe o sabor desejado nas observações do pedido.</p>}
        </div>
        <div className="mt-auto flex flex-col gap-3">
          {available ? (
            <>
              <QtyStepper value={qty} onChange={setQty} label={item.name} />
              <button type="button" onClick={onAdd} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-japa-orange to-japa-gold px-4 text-sm font-extrabold text-black transition hover:scale-[1.02]">
                {added ? <><Check size={18} aria-hidden />ADICIONADO</> : <><ShoppingCart size={18} aria-hidden />ADICIONAR</>}
              </button>
              <span className="sr-only" role="status">{added ? `${item.name} adicionado ao carrinho` : ""}</span>
            </>
          ) : <p className="rounded-full border border-white/20 py-3 text-center text-sm text-white/60">Indisponível</p>}
        </div>
      </div>
    </li>
  );
}
