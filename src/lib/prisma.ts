import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it in Vercel → Project → Settings → Environment Variables."
    );
  }

  const log =
    process.env.NODE_ENV === "development" ? (["error", "warn"] as const) : (["error"] as const);

  // Vercel / most cloud hosts can use normal Prisma → Neon TCP (pooler URL).
  // Local Windows often hangs on TCP — opt into WebSocket with PRISMA_USE_NEON_WS=1
  // or default WS only when not on Vercel and explicitly requested.
  const useNeonWs =
    process.env.PRISMA_USE_NEON_WS === "1" ||
    (process.env.VERCEL !== "1" && process.env.PRISMA_USE_NEON_WS !== "0");

  if (useNeonWs) {
    // Lazy-require so Vercel production builds don't need ws at runtime
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool, neonConfig } = require("@neondatabase/serverless") as typeof import("@neondatabase/serverless");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaNeon } = require("@prisma/adapter-neon") as typeof import("@prisma/adapter-neon");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ws = require("ws") as typeof import("ws");
    neonConfig.webSocketConstructor = ws;

    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({ adapter, log: [...log] });
  }

  return new PrismaClient({
    datasources: { db: { url: connectionString } },
    log: [...log],
  });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrisma();
  }
  return globalForPrisma.prisma;
}

/** Lazy client so importing this module during `next build` does not throw before env is read. */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}
