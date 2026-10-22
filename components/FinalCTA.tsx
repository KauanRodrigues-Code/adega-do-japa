import WhatsAppButton from "./WhatsAppButton";
export default function FinalCTA() {
  return <section className="relative overflow-hidden px-4 py-28 text-center">
    <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,106,0,.4),rgba(225,29,46,.2)_40%,transparent_70%)]" />
    <div className="relative mx-auto max-w-3xl"><h2 className="text-[clamp(3rem,10vw,6rem)] font-normal uppercase leading-none">VAI FICAR DE FORA?</h2><p className="mt-4 text-lg text-white/80">Chama a galera e vem viver a resenha.</p><WhatsAppButton className="mt-8" /></div>
  </section>;
}
