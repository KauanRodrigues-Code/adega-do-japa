import { Beer, Flame, PartyPopper, Smartphone } from "lucide-react";
const ITEMS = [[Beer,"Bebidas geladas"],[Flame,"Promoções"],[PartyPopper,"Festas e eventos"],[Smartphone,"Pedido pelo WhatsApp"]] as const;
export default function Highlights() {
  return <section aria-label="Destaques" className="border-y border-white/10 bg-japa-card"><ul className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
    {ITEMS.map(([I, t]) => <li key={t} className="flex items-center gap-3 text-sm font-semibold"><I className="shrink-0 text-japa-orange" size={22} aria-hidden />{t}</li>)}
  </ul></section>;
}
