import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { stripe, PRICE_IDS } from "@/lib/stripe";
import { db } from "@/lib/db";

const bodySchema = z.object({ tier: z.enum(["PLUS", "PREMIUM"]) });

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { tier } = parsed.data;
  const priceId = PRICE_IDS[tier];
  if (!priceId) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  const userId = session.user.id;
  const existingSubscription = await db.subscription.findUnique({ where: { userId } });

  let customerId = existingSubscription?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: session.user.email, metadata: { userId } });
    customerId = customer.id;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { userId, tier },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
