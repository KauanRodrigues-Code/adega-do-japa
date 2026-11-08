"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendarDays, CheckCircle2, MessageCircle, Music2, Ticket } from "lucide-react";
import { wa } from "@/lib/data";
import { EVENTS, formatWhen, splitEvents, ticketMessage, type EventItem } from "@/lib/events";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";

type Tab = "upcoming" | "past";

function Flyer({ e }: { e: EventItem }) {
  if (!e.flyer) return <div aria-hidden className="grid aspect-[3/4] w-full place-items-center rounded-2xl bg-gradient-to-br from-japa-wine via-japa-card to-black"><Ticket className="text-japa-orange" /></div>;
  return <Image src={e.flyer.src} alt={e.flyer.alt} width={e.flyer.width} height={e.flyer.height} sizes="(min-width:640px) 272px, 80vw" className="h-auto w-full rounded-2xl border border-white/10 object-contain" />;
}

function Card({ e, past }: { e: EventItem; past: boolean }) {
  const when = formatWhen(e);
  const sale = Boolean(e.tickets?.saleConfirmed);
  return (
    <article className={`grid gap-5 rounded-3xl border bg-gradient-to-br from-japa-graphite to-japa-card p-5 sm:grid-cols-[minmax(0,272px)_1fr] ${past ? "border-white/10" : "border-japa-orange/40 glow"}`}>
      <div className="mx-auto w-full max-w-[272px]"><Flyer e={e} /></div>
      <div className="flex flex-col">
        <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${past ? "bg-white/10 text-white/80" : "bg-japa-red text-white"}`}>
          {past ? <><CheckCircle2 size={14} aria-hidden />Evento realizado</> : "Próximo evento"}
        </span>
        <h3 className="mt-3 text-4xl font-normal uppercase leading-none sm:text-5xl">{e.title}</h3>
        {when && <p className="mt-3 flex items-center gap-2 text-white/85"><CalendarDays size={18} className="text-japa-orange" aria-hidden />{when}</p>}
        {e.attractions && e.attractions.length > 0 && (
          <ul className="mt-3 space-y-1 text-white/85" aria-label="Atrações">
            {e.attractions.map(a => <li key={a} className="flex items-center gap-2"><Music2 size={16} className="text-japa-orange" aria-hidden />{a}</li>)}
          </ul>
        )}
        {e.description && <p className="mt-3 text-white/70">{e.description}</p>}
        {!past && e.tickets?.info && <p className="mt-3 text-sm text-japa-gold">{e.tickets.info}</p>}
        {!past && (
          <a href={wa(ticketMessage(e.title))} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-gradient-to-r from-japa-orange to-japa-gold px-6 text-sm font-extrabold text-black transition hover:scale-105">
            <MessageCircle size={18} aria-hidden />{sale ? "COMPRAR INGRESSO PELO WHATSAPP" : "CONSULTAR INGRESSOS PELO WHATSAPP"}
          </a>
        )}
      </div>
    </article>
  );
}

export default function Events() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); }, []);
  const { upcoming, past } = splitEvents(EVENTS, now);
  const list = tab === "upcoming" ? upcoming : past;
  const tabBtn = (id: Tab, label: string, n: number) => (
    <button role="tab" id={`tab-${id}`} aria-selected={tab === id} aria-controls="painel-eventos" onClick={() => setTab(id)}
      className={`min-h-12 rounded-full border px-5 text-sm font-bold transition ${tab === id ? "border-japa-orange bg-japa-orange text-black" : "border-white/20 text-white/80 hover:border-japa-orange hover:text-japa-orange"}`}>
      {label} <span className="opacity-70">({n})</span>
    </button>
  );
  return (
    <section id="eventos" className="mx-auto max-w-7xl px-4 py-20">
      <Reveal>
        <SectionHead kicker="Eventos e festas" lines={["EVENTOS", "DA ADEGA"]} accent={1} text="Festas, DJs e muita resenha. Veja o que vem por aí e o que já rolou." />
      </Reveal>
      <div role="tablist" aria-label="Categorias de eventos" className="mt-8 flex flex-wrap gap-3">
        {tabBtn("upcoming", "Próximos eventos", upcoming.length)}
        {tabBtn("past", "Eventos anteriores", past.length)}
      </div>
      <div id="painel-eventos" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-8">
        {list.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">{list.map(e => <Card key={e.id} e={e} past={tab === "past"} />)}</div>
        ) : (
          <p className="rounded-3xl border border-dashed border-white/20 bg-japa-card p-8 text-center text-lg text-white/80">
            {tab === "upcoming" ? "Estamos preparando as próximas resenhas. Fique de olho para não perder nenhuma novidade!" : "Ainda não há eventos anteriores publicados."}
          </p>
        )}
      </div>
    </section>
  );
}
