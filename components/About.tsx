import Image from "next/image";
import { ABOUT_PHOTO } from "@/lib/data";
import Reveal from "./Reveal";
export default function About() {
  return <section id="sobre" className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2">
    <Reveal><h2 className="text-4xl font-normal uppercase sm:text-6xl">SOBRE A ADEGA DO JAPA</h2><p className="mt-5 text-lg text-white/80">A Adega do Japa é o ponto de encontro para quem curte bebida gelada, preço baixo, música e aquela resenha que começa sem hora para acabar.</p></Reveal>
    <Reveal delay={.1}><div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 glow"><Image src={ABOUT_PHOTO.src} alt={ABOUT_PHOTO.alt} fill sizes="(min-width:768px) 40vw, 90vw" className="object-cover object-[50%_55%]" /></div></Reveal>
  </section>;
}
