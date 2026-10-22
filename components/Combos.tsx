"use client";
import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS, MSG, wa } from "@/lib/data";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

export default function Combos() {
  const rail = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * (rail.current.clientWidth * 0.8), behavior: "smooth" });
  return (
    <section id="combos" className="mx-auto max-w-7xl px-4 py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[360px_1fr]">
        <Reveal>
          <SectionHead kicker="Nossos combos" lines={["SABORES QUE", "VIRAM RESENHA."]} accent={1} text="Combos especiais para você e sua galera.">
            <a href={wa(MSG.combos)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-japa-orange to-japa-gold px-6 text-sm font-extrabold text-black transition hover:scale-105">VER TODOS OS COMBOS</a>
          </SectionHead>
        </Reveal>
        <div className="relative min-w-0">
          <ul ref={rail} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2" aria-label="Combos e produtos">
            {PRODUCTS.map(p => (
              <li key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-[31%]">
                <a href={wa(`Olá! Vi o "${p.name}" no site e gostaria de saber mais.`)} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 bg-japa-card transition duration-300 hover:border-japa-orange/60 hover:shadow-[0_0_40px_-10px_rgba(255,106,0,.6)]">
                  <Image src={p.photo.src} alt={p.photo.alt} fill sizes="(min-width:1024px) 22vw, (min-width:640px) 40vw, 70vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  {p.promo && <span className="absolute right-3 top-3 rounded-full bg-japa-red px-3 py-1 text-xs font-bold">PROMOÇÃO</span>}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-xl font-normal uppercase leading-tight">{p.name}</h3>
                    {p.price && <p className="mt-1 font-bold text-japa-gold">{p.price}</p>}
                    <span className="mt-2 inline-block text-sm font-bold text-japa-gold">Consultar →</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => scroll(-1)} aria-label="Ver anteriores" className="grid h-12 w-12 place-items-center rounded-full border border-white/20 transition hover:border-japa-orange hover:text-japa-orange"><ChevronLeft /></button>
            <button onClick={() => scroll(1)} aria-label="Ver próximos" className="grid h-12 w-12 place-items-center rounded-full border border-white/20 transition hover:border-japa-orange hover:text-japa-orange"><ChevronRight /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
