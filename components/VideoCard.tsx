"use client";
import Image from "next/image";
import { Play } from "lucide-react";
import type { VideoItem } from "@/lib/videos";

export default function VideoCard({ v, onOpen }: { v: VideoItem; onOpen: (v: VideoItem) => void }) {
  return (
    <button onClick={() => onOpen(v)} aria-label={`Reproduzir vídeo: ${v.title}`} className="group relative block aspect-[9/14] w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-japa-wine via-japa-card to-black text-left transition duration-300 hover:border-japa-orange/60 hover:shadow-[0_0_40px_-10px_rgba(255,106,0,.6)]">
      {v.thumbnail && <Image src={v.thumbnail} alt="" fill sizes="(min-width:1024px) 22vw, 60vw" className="object-cover transition duration-500 group-hover:scale-105" />}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <span aria-hidden className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-japa-orange text-black shadow-lg transition group-hover:scale-110"><Play fill="currentColor" size={26} /></span>
      <span className="absolute inset-x-0 bottom-0 p-4">
        {v.category && <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-japa-gold">{v.category}</span>}
        <span className="block text-lg font-semibold leading-tight">{v.title}</span>
        {v.duration && <span className="mt-1 block text-xs text-white/60">{v.duration}</span>}
      </span>
    </button>
  );
}
