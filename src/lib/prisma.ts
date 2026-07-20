import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lifelink';

  console.log(
    JSON.stringify({
      tag: "DATABASE_DEBUG",
      length: connectionString.length,
      startsWith: connectionString.substring(0, 25),
      endsWith: connectionString.substring(connectionString.length - 30),
      hasNewline: connectionString.includes("\n"),
      hasCarriageReturn: connectionString.includes("\r"),
      hasSpace: /^\s|\s$/.test(connectionString),
      hasSslmode: connectionString.includes("sslmode="),
      hasPgbouncer: connectionString.includes("pgbouncer"),
      host: (() => {
        try {
          return new URL(connectionString).hostname;
        } catch {
          return "FAILED_TO_PARSE";
        }
      })(),
      port: (() => {
        try {
          return new URL(connectionString).port;
        } catch {
          return "FAILED_TO_PARSE";
        }
      })(),
    })
  );

  const isProduction = process.env.NODE_ENV === 'production';

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('sslmode=') || isProduction
      ? { rejectUnauthorized: false }
      : undefined,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
