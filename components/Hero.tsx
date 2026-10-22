"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, PartyPopper, Beer } from "lucide-react";
import { PHOTOS, MSG } from "@/lib/data";
import WhatsAppButton from "./WhatsAppButton";

const sizes = "(min-width:1024px) 28vw, 45vw";
export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden px-4 pb-16 pt-24 lg:flex lg:min-h-[100svh] lg:items-center">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(255,106,0,.38),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgba(225,29,46,.28),transparent_50%)]" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.p initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="mb-4 text-sm font-bold uppercase tracking-[.25em] text-japa-gold">Chama no zap</motion.p>
          <motion.h1 initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .1, duration: .7 }} className="text-[clamp(3.25rem,14vw,8rem)] font-normal uppercase leading-[.9]">
            SEU ROLÊ<br /><span className="bg-gradient-to-r from-japa-orange to-japa-gold bg-clip-text text-transparent">COMEÇA AQUI.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }} className="mt-5 max-w-md text-base text-white/80 sm:text-lg">Copão gelado, combos, promoções e aquela resenha que não pode faltar.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#combos" className="inline-flex min-h-12 items-center justify-center rounded-full border border-japa-orange px-6 py-3 text-sm font-extrabold text-japa-orange transition hover:bg-japa-orange hover:text-black">VER COMBOS</a>
            <WhatsAppButton msg={MSG.promo} />
          </motion.div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2"><MapPin size={16} className="text-japa-orange" aria-hidden />Adega do Japa</li>
            <li className="flex items-center gap-2"><PartyPopper size={16} className="text-japa-orange" aria-hidden />Eventos e festas</li>
            <li className="flex items-center gap-2"><Beer size={16} className="text-japa-orange" aria-hidden />Bebidas geladas</li>
          </ul>
        </div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3, duration: .8 }} className="relative">
          <div aria-hidden className="absolute -inset-6 rounded-full bg-japa-orange/20 blur-3xl" />
          <div className="relative grid h-[440px] grid-cols-2 grid-rows-2 gap-3 sm:h-[540px] lg:h-[620px]">
            <div className="relative row-span-2 overflow-hidden rounded-3xl border border-japa-orange/30 shadow-2xl glow">
              <Image src={PHOTOS.verdeVermelho.src} alt={PHOTOS.verdeVermelho.alt} fill priority sizes={sizes} className="object-cover object-[35%_60%]" />
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <Image src={PHOTOS.mangaJack.src} alt={PHOTOS.mangaJack.alt} fill priority sizes={sizes} className="object-cover object-[55%_70%]" />
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <Image src={PHOTOS.azulVerde.src} alt={PHOTOS.azulVerde.alt} fill sizes={sizes} className="object-cover object-[40%_55%]" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
