import path from "node:path";
import { defineConfig } from "prisma/config";

// Load environment variables from .env file
import { config } from "dotenv";
config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  earlyAccess: true,
  schema: path.resolve(__dirname, "./prisma/schema.prisma"),

  // Provide the database URL to Prisma CLI commands
  datasource: {
    url: process.env.DATABASE_URL!,
  },

  // Adapter for migrations
  migrate: {
    async adapter() {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const { Pool } = await import("pg");

      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is not set");
      }

      const pool = new Pool({ connectionString });
      return new PrismaPg(pool);
    },
  },

  studio: {
    async adapter() {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const { Pool } = await import("pg");

      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is not set");
      }

      const pool = new Pool({ connectionString });
      return new PrismaPg(pool);
    },
  },
});
