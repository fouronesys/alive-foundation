import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";

interface LocalVideoEmbedProps {
  src: string;
  caption?: string;
  aspectRatio?: string;
}

export default function LocalVideoEmbed({
  src,
  caption,
  aspectRatio = "9 / 16",
}: LocalVideoEmbedProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.5, 1] },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="group relative w-full max-w-[360px] overflow-hidden rounded-3xl bg-brand-navy shadow-[0_20px_50px_-15px_rgba(26,47,78,0.4)] transition-transform hover:-translate-y-1 hover:shadow-2xl"
      style={{ aspectRatio }}
    >
      <video
        ref={videoRef}
        src={src}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          const v = e.currentTarget;
          if (v.paused) {
            v.play();
            setPlaying(true);
          } else {
            v.pause();
            setPlaying(false);
          }
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {!playing && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-xl">
            <Play className="h-7 w-7 translate-x-0.5 fill-brand-navy text-brand-navy" />
          </div>
        </div>
      )}

      {/* Mute toggle */}
      <button
        type="button"
        aria-label={muted ? "Activar sonido" : "Silenciar"}
        onClick={(e) => {
          e.stopPropagation();
          setMuted((m) => !m);
        }}
        className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-5 pr-16 pointer-events-none">
          <p className="text-white text-sm font-medium leading-snug line-clamp-2 drop-shadow">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
