"use client";
import { useState } from "react";
import { Beer, GlassWater, CupSoda, Zap, Droplet, MessageCircle } from "lucide-react";
import { MENU, formatBRL, type MenuCategoryId } from "@/lib/menu";
import { MSG, wa } from "@/lib/data";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

const ICONS = { cervejas: Beer, drinks: GlassWater, refrigerantes: CupSoda, energeticos: Zap, aguas: Droplet } as const;
type Filter = "todos" | MenuCategoryId;

export default function Menu() {
  const [filter, setFilter] = useState<Filter>("todos");
  const cats = MENU.filter(c => filter === "todos" || c.id === filter);
  const chip = (active: boolean) => `min-h-11 rounded-full border px-4 text-sm font-bold transition ${active ? "border-japa-orange bg-japa-orange text-black" : "border-white/20 text-white/80 hover:border-japa-orange hover:text-japa-orange"}`;
  return (
    <section id="cardapio" className="mx-auto max-w-7xl px-4 py-20">
      <Reveal>
        <SectionHead kicker="Cardápio" lines={["BEBIDA GELADA,", "PREÇO JUSTO."]} accent={1} text="Confira os produtos e valores da Adega do Japa." />
      </Reveal>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar cardápio por categoria">
        <button className={chip(filter === "todos")} aria-pressed={filter === "todos"} onClick={() => setFilter("todos")}>Todos</button>
        {MENU.map(c => <button key={c.id} className={chip(filter === c.id)} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{c.title}</button>)}
      </div>
      <div className="mt-10 space-y-10">
        {cats.map(c => {
          const Icon = ICONS[c.id];
          return (
            <div key={c.id}>
              <h3 className="mb-4 flex items-center gap-3 text-2xl font-normal uppercase"><Icon className="text-japa-orange" size={24} aria-hidden />{c.title}</h3>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {c.items.map(i => (
                  <li key={i.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-japa-graphite to-japa-card p-4 transition hover:border-japa-orange/50">
                    <span className="font-semibold leading-snug">{i.name}</span>
                    <span className="shrink-0 font-display text-2xl text-japa-gold">{formatBRL(i.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-xs text-white/50">Venda de bebidas alcoólicas proibida para menores de 18 anos.</p>
      <a href={wa(MSG.order)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-japa-orange to-japa-gold px-6 text-sm font-extrabold text-black transition hover:scale-105"><MessageCircle size={18} aria-hidden />FAZER PEDIDO NO WHATSAPP</a>
    </section>
  );
}
