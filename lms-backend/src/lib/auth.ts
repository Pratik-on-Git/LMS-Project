import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { env } from "../config/env.js";
import { emailOTP } from "better-auth/plugins";
import { admin } from "better-auth/plugins";
import { sendEmail, emailTemplates } from "./nodemailer.js";

const isDev = process.env.NODE_ENV !== "production";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
  },
  // Cookie configuration for cross-origin requests (frontend on different port)
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      sameSite: isDev ? "lax" : "none",
      secure: !isDev,
      httpOnly: true,
      path: "/",
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        const template = emailTemplates.otp(otp);
        const result = await sendEmail(email, template);

        if (!result.success) {
          throw new Error("Failed to send verification email");
        }
      },
      sendVerificationOnSignUp: false,
      otpLength: 6,
      expiresIn: 600, // 10 minutes
    }),
    admin(),
  ],
  trustedOrigins: [
    env.BETTER_AUTH_URL,
    env.FRONTEND_URL,
  ],
});
