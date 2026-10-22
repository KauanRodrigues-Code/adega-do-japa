import { PROMO, MSG, wa } from "@/lib/data";
import Reveal from "./Reveal";
export default function Promotions() {
  const has = Boolean(PROMO.price);
  return <section id="promocoes" className="px-4 py-16"><Reveal className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-japa-orange/40 bg-gradient-to-br from-japa-red/30 via-japa-card to-japa-orange/20 p-8 glow sm:p-12">
    <h2 className="text-4xl font-normal uppercase sm:text-6xl">PROMOÇÃO DA VEZ 🔥</h2>
    {has ? <>
      <h3 className="mt-4 text-2xl font-normal uppercase text-japa-gold">{PROMO.name}</h3>
      <p className="mt-2 text-white/80">{PROMO.description}</p>
      <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-2">
        {PROMO.oldPrice && <p><span className="block text-xs text-white/60">DE:</span><span className="text-lg line-through">{PROMO.oldPrice}</span></p>}
        <p><span className="block text-xs text-white/60">POR:</span><span className="text-4xl font-bold text-japa-gold">{PROMO.price}</span></p>
        {PROMO.discount && <span className="rounded-full bg-japa-red px-4 py-1 text-sm font-bold">-{PROMO.discount}</span>}
      </div>
      {PROMO.validity && <p className="mt-3 text-sm text-white/60">{PROMO.validity}</p>}
    </> : <p className="mt-3 max-w-xl text-white/80">As promoções mudam toda semana. Chama no WhatsApp e confira o que está valendo hoje.</p>}
    <a href={wa(MSG.promo)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-japa-orange to-japa-gold px-8 font-extrabold text-black transition hover:scale-105">{has ? "QUERO ESSA PROMO" : "VER PROMOÇÕES NO WHATSAPP"}</a>
  </Reveal></section>;
}
