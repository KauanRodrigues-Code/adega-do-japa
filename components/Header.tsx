"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/data";
import WhatsAppButton from "./WhatsAppButton";
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 40); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled || open ? "border-white/10 bg-black/85 backdrop-blur-md" : "border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <a href="#inicio" className="font-display text-2xl uppercase tracking-wide">ADEGA <span className="text-japa-orange">DO JAPA</span></a>
        <nav className="hidden items-center gap-6 xl:flex" aria-label="Principal">
          {NAV.map(([l, h]) => <a key={h} href={h} className="text-sm font-semibold text-white/80 transition hover:text-japa-gold">{l}</a>)}
          <WhatsAppButton className="!py-2" />
        </nav>
        <button className="grid h-12 w-12 place-items-center xl:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="flex flex-col gap-1 px-4 pb-6 xl:hidden" aria-label="Mobile">
        {NAV.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 text-lg font-semibold hover:bg-white/5">{l}</a>)}
        <WhatsAppButton className="mt-2" />
      </nav>}
    </header>
  );
}
