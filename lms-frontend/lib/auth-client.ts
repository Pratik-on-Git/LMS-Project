import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    emailOTPClient(),
    adminClient(),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;