"use client";
import { useState } from "react";
import { Video } from "lucide-react";
import { VIDEOS, type VideoItem } from "@/lib/videos";
import { SITE } from "@/lib/data";
import SectionHead from "./SectionHead";
import VideoCard from "./VideoCard";
import VideoModal from "./VideoModal";
import Reveal from "./Reveal";

export default function Videos() {
  const [active, setActive] = useState<VideoItem | null>(null);
  return (
    <section id="videos" className="mx-auto max-w-7xl px-4 py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[360px_1fr]">
        <Reveal>
          <SectionHead kicker="Vídeos" lines={["VIVA O ROLÊ", "DO JAPA."]} accent={1} text="Confira o ambiente, conheça a nossa vibe e veja o que acontece na Adega do Japa.">
            <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full border border-japa-orange px-6 text-sm font-extrabold text-japa-orange transition hover:bg-japa-orange hover:text-black">VER NO INSTAGRAM</a>
          </SectionHead>
        </Reveal>
        {VIDEOS.length > 0 ? (
          <ul className="no-scrollbar flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto pb-2" aria-label="Vídeos da Adega do Japa">
            {VIDEOS.map(v => <li key={v.id} className="w-[60%] shrink-0 snap-start sm:w-[34%] lg:w-[calc((100%-2rem)/3)]"><VideoCard v={v} onOpen={setActive} /></li>)}
          </ul>
        ) : (
          <div className="grid min-h-64 place-items-center rounded-3xl border border-dashed border-white/20 bg-japa-card p-8 text-center">
            <div><Video className="mx-auto text-japa-orange" aria-hidden /><p className="mt-3 font-semibold">Vídeos em breve</p><p className="mt-1 text-sm text-white/60">Acompanhe o dia a dia da adega no Instagram @{SITE.instagram}.</p></div>
          </div>
        )}
      </div>
      {active && <VideoModal v={active} onClose={() => setActive(null)} />}
    </section>
  );
}
