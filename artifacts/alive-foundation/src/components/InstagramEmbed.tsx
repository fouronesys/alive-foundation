import { useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

let scriptLoadingPromise: Promise<void> | null = null;

function loadInstagramScript(): Promise<void> {
  if (scriptLoadingPromise) return scriptLoadingPromise;
  scriptLoadingPromise = new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    if (window.instgrm) {
      resolve();
      return;
    }

    const TIMEOUT_MS = 8000;
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const timeoutId = window.setTimeout(settle, TIMEOUT_MS);
    const finish = () => {
      window.clearTimeout(timeoutId);
      settle();
    };

    const existing = document.querySelector<HTMLScriptElement>('script[src*="instagram.com/embed.js"]');
    if (existing) {
      if (window.instgrm) {
        finish();
        return;
      }
      existing.addEventListener("load", finish, { once: true });
      existing.addEventListener("error", finish, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = finish;
    script.onerror = finish;
    document.body.appendChild(script);
  });
  return scriptLoadingPromise;
}

let processScheduled = false;
function scheduleProcess() {
  if (processScheduled) return;
  processScheduled = true;
  window.setTimeout(() => {
    processScheduled = false;
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, 50);
}

interface InstagramEmbedProps {
  url: string;
  caption?: string;
}

export default function InstagramEmbed({ url, caption }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadInstagramScript().then(() => {
      if (cancelled) return;
      scheduleProcess();
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div ref={containerRef} className="instagram-embed-wrapper w-full">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: "1.5rem",
          boxShadow: "0 10px 30px -10px rgba(26, 47, 78, 0.15)",
          margin: 0,
          maxWidth: "540px",
          minWidth: "280px",
          padding: 0,
          width: "100%",
        }}
      >
        <div style={{ padding: "16px", textAlign: "center" }}>
          <a
            href={url}
            style={{
              color: "#1A2F4E",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-block",
              padding: "12px 0",
            }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={caption ?? "Ver esta publicación en Instagram"}
          >
            {caption ?? "Ver esta publicación en Instagram →"}
          </a>
        </div>
      </blockquote>
    </div>
  );
}
