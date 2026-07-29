import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  // Codespaces (and similar cloud dev environments) serve the app from a
  // forwarded-port URL that's easy to mismatch against BETTER_AUTH_URL.
  // Trust both explicitly rather than fighting env var config — add any
  // other domains you deploy to (staging, production) here as well.
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:3000",
  ].filter((origin): origin is string => Boolean(origin)),
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  // Social login (Google/Apple) is the natural next step for reducing signup
  // friction — add a socialProviders block here once you have OAuth app
  // credentials; no schema changes needed, Account already supports it.
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Every new signup starts on the free, ad-supported tier.
          await db.subscription.create({
            data: { userId: user.id, tier: "FREE_AD_SUPPORTED", status: "ACTIVE" },
          });
        },
      },
    },
  },
  plugins: [
    nextCookies(), // must be last — handles Set-Cookie in Server Actions
  ],
});

export type Session = typeof auth.$Infer.Session;
