interface InstagramEmbedProps {
  url: string;
}

function parseEmbedUrl(url: string): { embedSrc: string; aspectRatio: string } {
  const match = url.match(/instagram\.com\/(reel|p|tv)\/([^/?#]+)/i);
  if (!match) {
    return { embedSrc: url, aspectRatio: "9 / 16" };
  }
  const [, kind, shortcode] = match;
  const embedSrc = `https://www.instagram.com/${kind}/${shortcode}/embed/`;
  // Reels and tv posts are vertical (9:16), regular posts are usually square.
  const aspectRatio = kind === "p" ? "1 / 1" : "9 / 16";
  return { embedSrc, aspectRatio };
}

// Instagram's /embed/ page renders a fixed header (~54px) and a footer action
// bar (~58px) around the media. The iframe is cross-origin so we can't style
// it; we crop the chrome by clipping the wrapper and offsetting/extending the
// iframe so only the media area remains visible.
const HEADER_OFFSET = 54;
const FOOTER_OFFSET = 58;

export default function InstagramEmbed({ url }: InstagramEmbedProps) {
  const { embedSrc, aspectRatio } = parseEmbedUrl(url);

  return (
    <div
      className="relative w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(26,47,78,0.15)]"
      style={{ aspectRatio }}
    >
      <iframe
        src={embedSrc}
        title="Publicación de Instagram"
        loading="lazy"
        scrolling="no"
        allow="encrypted-media"
        allowFullScreen
        className="absolute left-0 w-full border-0"
        style={{
          top: `-${HEADER_OFFSET}px`,
          height: `calc(100% + ${HEADER_OFFSET + FOOTER_OFFSET}px)`,
        }}
      />
    </div>
  );
}
