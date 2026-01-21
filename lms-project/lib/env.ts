import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    
    // Email configuration
    EMAIL_HOST: z.string().min(1),
    EMAIL_PORT: z.coerce.number(),
    EMAIL_SECURE: z.coerce.boolean(),
    EMAIL_USER: z.string().email(),
    EMAIL_PASSWORD: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
  },
  experimental__runtimeEnv: {},
});
