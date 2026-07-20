import { defineConfig } from 'prisma/config';

try {
  (process as any).loadEnvFile();
} catch (e) {
  // Ignore if .env is missing or process.loadEnvFile is not supported
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lifelink',
  },
});
