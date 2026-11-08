"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Wheat, Leaf, Beef, Layers, Droplet, MessageCircle } from "lucide-react";
import { BURGER, MSG, wa } from "@/lib/data";

const INGREDIENTS = [
  [Wheat, "Pão de brioche"], [Leaf, "Alface fresca"], [Beef, "Hambúrguer artesanal"], [Layers, "Queijo cheddar"], [Droplet, "Molho especial"],
] as const;
const EMBERS = [8, 22, 35, 50, 63, 78, 90];

export default function BurgerHighlight() {
  return (
    <section id="hamburguer" aria-labelledby="burger-title" className="relative isolate w-full overflow-hidden bg-[#050505] px-4 py-20 sm:py-28">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_45%,rgba(255,106,0,.35),transparent_55%),radial-gradient(circle_at_5%_100%,rgba(225,29,46,.35),transparent_45%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[.06] [background-image:repeating-linear-gradient(45deg,#fff_0_1px,transparent_1px_6px)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40">
        {EMBERS.map((l, i) => <span key={l} className="ember" style={{ left: `${l}%`, animationDelay: `${i * 1.1}s` }} />)}
      </div>
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div>
          <motion.h2 id="burger-title" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .6 }} className="text-[clamp(3rem,12vw,6.5rem)] font-normal uppercase leading-[.92]">
            Hambúrguer<br /><span className="bg-gradient-to-r from-japa-orange to-japa-gold bg-clip-text text-transparent">Artesanal</span>
          </motion.h2>
          <p className="mt-4 inline-block -rotate-1 bg-japa-red px-3 py-1 text-base font-extrabold uppercase sm:text-xl">Sabor que impressiona!</p>
          <ul className="mt-8 space-y-3">
            {INGREDIENTS.map(([Icon, label], i) => (
              <motion.li key={label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: .2 + i * .1 }} className="flex items-center gap-3 font-bold uppercase tracking-wide">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-japa-gold/60 text-japa-gold"><Icon size={18} aria-hidden /></span>{label}
              </motion.li>
            ))}
          </ul>
          <motion.div initial={{ opacity: 0, scale: .85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .5 }} className="mt-10 inline-block -skew-x-6 bg-gradient-to-br from-black via-japa-red/40 to-black px-6 py-3 ring-1 ring-japa-red/60">
            <p className="text-xs font-bold uppercase tracking-[.3em] text-white/80">Por apenas</p>
            <p className="font-display text-[clamp(3.5rem,15vw,6rem)] leading-none text-japa-gold drop-shadow-[0_0_20px_rgba(255,194,26,.4)]">{BURGER.price}</p>
          </motion.div>
          <a href={wa(MSG.burger)} target="_blank" rel="noopener noreferrer" className="mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-japa-orange to-japa-gold px-8 text-base font-extrabold text-black transition hover:scale-105 glow sm:inline-flex sm:w-auto">
            <MessageCircle size={20} aria-hidden />QUERO MEU HAMBÚRGUER
          </a>
        </div>
        <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .8 }} className="relative mx-auto w-full max-w-lg">
          <span className="absolute -top-2 right-2 z-10 rotate-6 rounded-full bg-japa-red px-4 py-2 text-sm font-black uppercase shadow-lg">Novo</span>
          <Image src={BURGER.image} alt={BURGER.imageAlt} width={718} height={598} sizes="(min-width:1024px) 520px, 90vw" className="h-auto w-full object-contain [mask-image:radial-gradient(ellipse_at_center,#000_62%,transparent_100%)]" />
        </motion.div>
      </div>
    </section>
  );
}
