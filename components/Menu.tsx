"use client";
import { useState } from "react";
import { Beer, CupSoda, Droplet, GlassWater, ShoppingCart } from "lucide-react";
import { MENU, type MenuCategoryId } from "@/lib/menu";
import { useCart } from "@/lib/cart";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import ProductCard from "./ProductCard";

const ICONS = { cervejas: Beer, drinks: GlassWater, refrigerantes: CupSoda, aguas: Droplet } as const;
type Filter = "todos" | MenuCategoryId;

export default function Menu() {
  const [filter, setFilter] = useState<Filter>("todos");
  const { count, open } = useCart();
  const cats = MENU.filter(c => filter === "todos" || c.id === filter);
  const chip = (active: boolean) => `min-h-11 rounded-full border px-4 text-sm font-bold transition ${active ? "border-japa-orange bg-japa-orange text-black" : "border-white/20 text-white/80 hover:border-japa-orange hover:text-japa-orange"}`;
  return (
    <section id="cardapio" className="mx-auto max-w-7xl px-4 py-20">
      <Reveal>
        <SectionHead kicker="Cardápio" lines={["BEBIDA GELADA,", "PREÇO JUSTO."]} accent={1} text="Monte seu pedido, escolha entrega ou retirada e finalize pelo WhatsApp.">
          <button type="button" onClick={open} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-japa-orange to-japa-gold px-6 text-sm font-extrabold text-black transition hover:scale-105"><ShoppingCart size={18} aria-hidden />ABRIR CARRINHO{count > 0 ? ` (${count})` : ""}</button>
        </SectionHead>
      </Reveal>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar cardápio por categoria">
        <button type="button" className={chip(filter === "todos")} aria-pressed={filter === "todos"} onClick={() => setFilter("todos")}>Todos</button>
        {MENU.map(c => <button key={c.id} type="button" className={chip(filter === c.id)} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{c.title}</button>)}
      </div>
      <div className="mt-10 space-y-12">
        {cats.map(c => {
          const Icon = ICONS[c.id];
          return (
            <div key={c.id}>
              <h3 className="mb-4 flex items-center gap-3 text-2xl font-normal uppercase"><Icon className="text-japa-orange" size={24} aria-hidden />{c.title}</h3>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{c.items.map(i => <ProductCard key={i.id} item={i} />)}</ul>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-xs text-white/50">Venda de bebidas alcoólicas proibida para menores de 18 anos. Pedidos sujeitos à confirmação da Adega do Japa.</p>
    </section>
  );
}
