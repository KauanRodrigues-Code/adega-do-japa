"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { VideoItem } from "@/lib/videos";

function embedUrl(v: VideoItem): string {
  if (v.type === "youtube") return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.src)}?rel=0`;
  if (v.type === "vimeo") return `https://player.vimeo.com/video/${encodeURIComponent(v.src)}`;
  return v.src;
}
export default function VideoModal({ v, onClose }: { v: VideoItem; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={v.title} className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4" onClick={onClose}>
      <div className="relative w-full max-w-md" onClick={e => e.stopPropagation()}>
        <button ref={closeRef} onClick={onClose} aria-label="Fechar vídeo" className="absolute -top-14 right-0 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20"><X /></button>
        <div className="overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
          {v.type === "file"
            ? <video src={v.src} poster={v.thumbnail} controls playsInline preload="none" className="max-h-[80svh] w-full" />
            : <iframe src={embedUrl(v)} title={v.title} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="aspect-[9/16] max-h-[80svh] w-full" />}
        </div>
        <p className="mt-3 font-semibold">{v.title}</p>
        {v.description && <p className="text-sm text-white/70">{v.description}</p>}
      </div>
    </div>
  );
}
