import path from "node:path";
import fs from "node:fs";
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Relative default so it works both on Replit (CWD = workspace root) and inside
// the Docker container (CWD = /app, with /app/data mounted as a persistent volume).
const DEFAULT_DB_PATH = "./data/alive-foundation.db";
const dbPath = process.env.DATABASE_FILE ?? DEFAULT_DB_PATH;

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const sqlite: Client = createClient({ url: `file:${dbPath}` });

export const db = drizzle(sqlite, { schema });

export * from "./schema";
