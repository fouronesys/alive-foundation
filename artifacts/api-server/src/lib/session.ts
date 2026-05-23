import session from "express-session";
import type { RequestHandler } from "express";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is required.");
}

// Note: the Replit preview embeds this app inside a cross-site iframe, so we
// need `sameSite: "none"` + `secure: true` for the session cookie to be sent
// back on subsequent requests. Replit serves dev and production over HTTPS, so
// `secure` works in both.
export const sessionMiddleware: RequestHandler = session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.session?.isAdmin) {
    next();
    return;
  }
  res.status(401).json({ message: "Unauthorized" });
};
