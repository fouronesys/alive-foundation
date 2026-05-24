import path from "node:path";
import fs from "node:fs";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { sessionMiddleware } from "./lib/session";

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use("/api", router);

// In production (e.g. CapRover), the Express server also serves the built
// Vite frontend. STATIC_DIR points at artifacts/alive-foundation/dist/public.
const staticDir = process.env["STATIC_DIR"];
if (staticDir && fs.existsSync(staticDir)) {
  const indexHtmlPath = path.join(staticDir, "index.html");
  const indexHtmlTemplate = fs.readFileSync(indexHtmlPath, "utf8");

  // Build the absolute origin for OG/Twitter meta tags based on the request
  // (so previews work on any domain CapRover serves, without hardcoding).
  function originFor(req: express.Request): string {
    const envOrigin = process.env["PUBLIC_BASE_URL"];
    if (envOrigin) return envOrigin.replace(/\/$/, "");
    const proto = (req.get("x-forwarded-proto") || req.protocol || "https")
      .split(",")[0]!
      .trim();
    const host = req.get("x-forwarded-host") || req.get("host") || "";
    return `${proto}://${host}`;
  }

  app.use(
    express.static(staticDir, {
      index: false,
      maxAge: "1h",
      setHeaders: (res, filePath) => {
        // Hashed asset files can be cached aggressively
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );
  // SPA fallback: any non-API GET that isn't a static file → serve index.html
  // with the __APP_ORIGIN__ placeholder replaced by the real request origin.
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.path.startsWith("/api")) return next();
    const html = indexHtmlTemplate.replaceAll("__APP_ORIGIN__", originFor(req));
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.send(html);
  });
  logger.info({ staticDir }, "Serving static frontend");
}

export default app;
