import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

// Map internal tiers to Stripe Price IDs (created in the Stripe dashboard).
// FREE_AD_SUPPORTED has no Stripe price — it's the default, no-payment tier.
export const PRICE_IDS = {
  PLUS: process.env.STRIPE_PRICE_PLUS as string, // e.g. €4.99/mo, limited ads
  PREMIUM: process.env.STRIPE_PRICE_PREMIUM as string, // e.g. €8.99/mo, no ads, 4K
};

export const PLAN_DETAILS = [
  {
    tier: "FREE_AD_SUPPORTED",
    name: "KYMA Free",
    price: "€0",
    priceId: null,
    features: ["Ad-supported streaming", "Most series & movies", "Podcasts included", "SD/HD quality"],
  },
  {
    tier: "PLUS",
    name: "KYMA Plus",
    price: "€4.99/mo",
    priceId: "PLUS",
    features: ["Limited ads (fewer breaks)", "Full catalog incl. new Originals", "Full HD", "2 devices"],
  },
  {
    tier: "PREMIUM",
    name: "KYMA Premium",
    price: "€8.99/mo",
    priceId: "PREMIUM",
    features: ["Ad-free", "4K where available", "4 devices", "Offline downloads"],
  },
] as const;
