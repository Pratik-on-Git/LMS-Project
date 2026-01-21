import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        // Implement your email sending logic here
        await resend.emails.send({
          from: "Neo LMS <onboarding@resend.dev>",
          to: [email],
          subject: "Neo LMS: Here's Your OTP Code to Log In",
          html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
        });
      },
    }),
  ],
});
