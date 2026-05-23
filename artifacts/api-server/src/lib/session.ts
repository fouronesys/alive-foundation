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

export const sessionMiddleware: RequestHandler = session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
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
