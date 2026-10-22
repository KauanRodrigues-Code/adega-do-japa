import { NAV, SITE } from "@/lib/data";
export default function Footer() {
  return <footer className="border-t border-white/10 bg-black px-4 py-10"><div className="mx-auto max-w-7xl">
    <div className="flex flex-col gap-6 md:flex-row md:justify-between">
      <div><p className="font-display text-2xl uppercase">ADEGA <span className="text-japa-orange">DO JAPA</span></p><p className="mt-2 text-sm text-white/60">@{SITE.instagram} · {SITE.phoneLabel}</p></div>
      <nav aria-label="Rodapé" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">{NAV.map(([l, h]) => <a key={h} href={h} className="hover:text-japa-gold">{l}</a>)}<a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-japa-gold">Instagram</a></nav>
    </div>
    <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:justify-between">
      <p>© 2026 Adega do Japa. Todos os direitos reservados.</p>
      <a href={SITE.developerUrl} target="_blank" rel="noopener noreferrer" className="hover:text-japa-gold">Site desenvolvido por Kauan Rodrigues</a>
    </div></div></footer>;
}
