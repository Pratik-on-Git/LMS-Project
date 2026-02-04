import { z } from "zod";

// You need to import createEnv from the correct package, e.g. 'zod-env' or your own utility
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_FRONTEND_URL: z.string().url().default("http://localhost:3001"),
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
  },
});
