import path from "node:path";
import fs from "node:fs";
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const DEFAULT_DB_PATH = "/home/runner/workspace/data/alive-foundation.db";
const dbPath = process.env.DATABASE_FILE ?? DEFAULT_DB_PATH;

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const sqlite: Client = createClient({ url: `file:${dbPath}` });

export const db = drizzle(sqlite, { schema });

export * from "./schema";
