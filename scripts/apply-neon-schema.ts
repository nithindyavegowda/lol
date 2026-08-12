/**
 * Apply prisma/neon-init.sql via Neon WebSocket pool
 * (plain TCP:5432 often times out on some local networks).
 */
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import fs from "fs";
import path from "path";

neonConfig.webSocketConstructor = ws;

function loadEnv(file: string) {
  const p = path.join(process.cwd(), file);
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

loadEnv(".env");
loadEnv(".env.local");

function splitSql(body: string): string[] {
  const withoutLineComments = body
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => !/^\s*--/.test(line))
    .join("\n");

  return withoutLineComments
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");

  const sqlFile = path.join(process.cwd(), "prisma", "neon-init.sql");
  const body = fs.readFileSync(sqlFile, "utf8");
  const statements = splitSql(body);

  const pool = new Pool({ connectionString: url });
  console.log(`Applying ${statements.length} statements to Neon…`);
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await pool.query(stmt);
      console.log(`  ok [${i + 1}/${statements.length}]`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/already exists/i.test(msg)) {
        console.log(`  skip [${i + 1}]: already exists`);
        continue;
      }
      console.error(`  fail [${i + 1}]:`, msg);
      console.error(stmt.slice(0, 200));
      await pool.end();
      process.exit(1);
    }
  }
  await pool.end();
  console.log("Schema applied.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
