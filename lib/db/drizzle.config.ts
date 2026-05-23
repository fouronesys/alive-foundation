import { defineConfig } from "drizzle-kit";

const DEFAULT_DB_PATH = "/home/runner/workspace/data/alive-foundation.db";
const dbPath = process.env.DATABASE_FILE ?? DEFAULT_DB_PATH;

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "turso",
  dbCredentials: {
    url: `file:${dbPath}`,
  },
});
