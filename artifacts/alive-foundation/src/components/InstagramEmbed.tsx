import { Instagram, Play, ExternalLink } from "lucide-react";

interface InstagramEmbedProps {
  url: string;
  caption?: string;
}

function parsePost(url: string): { kind: "reel" | "p" | "tv"; shortcode: string } | null {
  const match = url.match(/instagram\.com\/(reel|p|tv)\/([^/?#]+)/i);
  if (!match) return null;
  const kind = match[1].toLowerCase() as "reel" | "p" | "tv";
  return { kind, shortcode: match[2] };
}

const GRADIENTS = [
  "from-brand-orange via-brand-yellow to-brand-orange",
  "from-brand-aqua via-brand-navy to-brand-aqua",
  "from-brand-yellow via-brand-orange to-brand-navy",
];

export default function InstagramEmbed({ url, caption }: InstagramEmbedProps) {
  const parsed = parsePost(url);

  if (!parsed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-brand-orange underline"
      >
        Ver publicación en Instagram
      </a>
    );
  }

  const { kind, shortcode } = parsed;
  const isVideo = kind === "reel" || kind === "tv";
  const aspectRatio = isVideo ? "9 / 16" : "1 / 1";
  const gradientIndex =
    Math.abs(
      shortcode.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
    ) % GRADIENTS.length;
  const gradient = GRADIENTS[gradientIndex];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full max-w-[360px] overflow-hidden rounded-3xl shadow-[0_20px_50px_-15px_rgba(26,47,78,0.35)] transition-transform hover:-translate-y-1 hover:shadow-2xl"
      style={{ aspectRatio }}
      aria-label={isVideo ? "Ver reel en Instagram" : "Ver publicación en Instagram"}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.6) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.4) 0%, transparent 50%)",
      }} />

      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
        <div className="flex items-center justify-between">
          <Instagram className="h-7 w-7 drop-shadow" />
          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            {isVideo ? "Reel" : "Post"}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 gap-3">
          {isVideo && (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-xl transition-transform group-hover:scale-110">
              <Play className="h-7 w-7 translate-x-0.5 fill-brand-navy text-brand-navy" />
            </div>
          )}
          {caption && (
            <p className="text-center text-sm font-medium leading-snug px-3 max-w-[80%] line-clamp-3 drop-shadow">
              {caption}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs font-bold opacity-90 group-hover:opacity-100">
          <ExternalLink className="h-3.5 w-3.5" />
          Ver en Instagram
        </div>
      </div>
    </a>
  );
}
