import { MapPin, Instagram, Smartphone } from "lucide-react";
import { SITE, MAP, MSG, wa } from "@/lib/data";
import SectionHead from "./SectionHead";
import WhatsAppButton from "./WhatsAppButton";
import Reveal from "./Reveal";

export default function Location() {
  return (
    <section id="contato" className="mx-auto max-w-7xl px-4 py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[360px_1fr]">
        <Reveal>
          <SectionHead kicker="Como chegar" lines={["LOCALIZAÇÃO", "DA ADEGA"]} accent={1} text="Venha nos fazer uma visita e viver essa experiência de pertinho.">
            {(SITE.address || SITE.mapQuery) && <p className="mb-2 flex items-start gap-2 text-white/85"><MapPin className="mt-1 shrink-0 text-japa-orange" size={18} aria-hidden />{SITE.address || SITE.mapQuery}</p>}
            {SITE.locationProvisional && <p role="note" className="mb-4 rounded-xl border border-japa-gold/40 bg-japa-gold/10 px-3 py-2 text-sm text-japa-gold">Localização provisória: o endereço ainda será confirmado. Em caso de dúvida, peça a localização pelo WhatsApp.</p>}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {MAP.openUrl && <a href={MAP.openUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-japa-orange to-japa-gold px-6 text-sm font-extrabold text-black transition hover:scale-105"><MapPin size={18} aria-hidden />ABRIR NO MAPS</a>}
              <WhatsAppButton label="PEDIR LOCALIZAÇÃO" msg={MSG.location} />
            </div>
            <ul className="mt-6 space-y-3 text-white/80">
              <li className="flex items-center gap-3"><Smartphone size={18} className="text-japa-orange" aria-hidden /><a href={wa(MSG.promo)} className="hover:text-japa-gold">{SITE.phoneLabel}</a></li>
              <li className="flex items-center gap-3"><Instagram size={18} className="text-japa-orange" aria-hidden /><a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-japa-gold">@{SITE.instagram}</a></li>
            </ul>
          </SectionHead>
        </Reveal>
        <div className="relative h-72 overflow-hidden rounded-3xl border border-white/10 bg-japa-card sm:h-96">
          {MAP.embedUrl
            ? <iframe src={MAP.embedUrl} title="Mapa com a localização da Adega do Japa" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full" />
            : <div className="grid h-full place-items-center p-6 text-center text-sm text-white/60">Chame no WhatsApp para receber a localização.</div>}
          {MAP.embedUrl && SITE.locationProvisional && <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/80 px-3 py-1 text-xs font-bold text-japa-gold ring-1 ring-japa-gold/50">MAPA PROVISÓRIO</span>}
        </div>
      </div>
    </section>
  );
}
