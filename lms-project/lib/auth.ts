import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { sendEmail, emailTemplates } from "./nodemailer"; // Ensure this file exists and exports the required functions

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
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
        const template = emailTemplates.otp(otp);
        const result = await sendEmail(email, template);

        if (!result.success) {
          console.error("Failed to send OTP email:", result.error);
          throw new Error("Failed to send verification email");
        }

        console.log(`OTP sent to ${email}`);
      },
    }),
  ],
});
