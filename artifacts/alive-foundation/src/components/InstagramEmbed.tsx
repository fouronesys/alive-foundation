import { Play, ExternalLink } from "lucide-react";

interface InstagramEmbedProps {
  url: string;
}

function parsePost(url: string): { kind: "reel" | "p" | "tv"; shortcode: string } | null {
  const match = url.match(/instagram\.com\/(reel|p|tv)\/([^/?#]+)/i);
  if (!match) return null;
  const kind = match[1].toLowerCase() as "reel" | "p" | "tv";
  return { kind, shortcode: match[2] };
}

export default function InstagramEmbed({ url }: InstagramEmbedProps) {
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
  const mediaUrl = `https://www.instagram.com/${kind}/${shortcode}/media/?size=l`;
  const isVideo = kind === "reel" || kind === "tv";
  const aspectRatio = isVideo ? "9 / 16" : "1 / 1";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full max-w-[400px] overflow-hidden rounded-2xl bg-brand-navy/5 shadow-[0_10px_30px_-10px_rgba(26,47,78,0.15)] transition-transform hover:-translate-y-1 hover:shadow-xl"
      style={{ aspectRatio }}
      aria-label={isVideo ? "Ver reel en Instagram" : "Ver publicación en Instagram"}
    >
      <img
        src={mediaUrl}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {isVideo && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
            <Play className="h-7 w-7 translate-x-0.5 fill-brand-navy text-brand-navy" />
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-navy opacity-0 transition-opacity group-hover:opacity-100">
        <ExternalLink className="h-3 w-3" />
        Ver en Instagram
      </div>
    </a>
  );
}
