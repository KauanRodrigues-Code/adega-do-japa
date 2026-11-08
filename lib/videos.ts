// ============================================================
//  VÍDEOS DA ADEGA — o site exibe SOMENTE os vídeos listados aqui (hoje: exatamente 3).
//  Arquivos locais ficam em public/videos/. As capas (posters) foram extraídas dos próprios vídeos.
// ============================================================
export type VideoType = "file" | "youtube" | "vimeo" | "embed";
export type VideoItem = {
  id: string; title: string; description?: string; type: VideoType; src: string;
  thumbnail?: string; category?: string; duration?: string;
};
export const VIDEOS: VideoItem[] = [
  { id: "video-1", title: "Vídeo 1", type: "file", src: "/videos/Video_1.mp4", thumbnail: "/videos/posters/video-1.jpg", duration: "0:06" },
  { id: "video-2", title: "Vídeo 2", type: "file", src: "/videos/Video_2.mp4", thumbnail: "/videos/posters/video-2.jpg", duration: "0:04" },
  { id: "video-3", title: "Vídeo 3", type: "file", src: "/videos/Video_3.mp4", thumbnail: "/videos/posters/video-3.jpg", duration: "0:03" },
];
