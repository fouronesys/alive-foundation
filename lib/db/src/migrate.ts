import path from "node:path";
import fs from "node:fs";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index";

function resolveMigrationsFolder(): string {
  if (process.env.MIGRATIONS_DIR) return process.env.MIGRATIONS_DIR;

  // Walk up from CWD looking for lib/db/drizzle. Works both in dev (CWD =
  // any package inside the workspace) and in production (CWD = /app).
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    const candidate = path.join(dir, "lib/db/drizzle");
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return path.resolve(process.cwd(), "lib/db/drizzle");
}

export async function runMigrations(): Promise<void> {
  const migrationsFolder = resolveMigrationsFolder();

  if (!fs.existsSync(migrationsFolder)) {
    throw new Error(
      `Migrations folder not found at ${migrationsFolder}. ` +
        `Set MIGRATIONS_DIR or ensure ./lib/db/drizzle is shipped with the app.`,
    );
  }

  await migrate(db, { migrationsFolder });
}
