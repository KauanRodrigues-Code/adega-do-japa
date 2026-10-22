import { MessageCircle } from "lucide-react";
import { wa, MSG } from "@/lib/data";
export default function WhatsAppButton({ label = "CHAMAR NO WHATSAPP", msg = MSG.promo, className = "" }: { label?: string; msg?: string; className?: string }) {
  return <a href={wa(msg)} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-japa-orange to-japa-gold px-6 py-3 text-sm font-extrabold text-black transition hover:scale-105 glow ${className}`}><MessageCircle size={18} aria-hidden />{label}</a>;
}
