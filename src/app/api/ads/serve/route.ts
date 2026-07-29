import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const bodySchema = z.object({
  episodeId: z.string().min(1),
  breakPosition: z.enum(["pre-roll", "mid-roll", "post-roll"]),
});

// Called by the video player before/during playback to decide whether an ad
// break plays, and which creative to serve. PREMIUM = no ads. PLUS = fewer
// breaks (pre-roll only). FREE_AD_SUPPORTED = full pre/mid/post-roll.
//
// This is a lightweight MVP ad decision layer. The actual splicing into the
// HLS stream happens via the CDN's server-side ad insertion (SSAI) — this
// endpoint tells the player which break points are active and logs
// impressions for reporting to advertisers.

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { episodeId, breakPosition } = parsed.data;

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id ?? null;

  const subscription = userId ? await db.subscription.findUnique({ where: { userId } }) : null;
  const tier = subscription?.tier ?? "FREE_AD_SUPPORTED";

  if (tier === "PREMIUM") {
    return NextResponse.json({ shouldPlayAd: false });
  }
  if (tier === "PLUS" && breakPosition !== "pre-roll") {
    return NextResponse.json({ shouldPlayAd: false });
  }

  const activeCreatives = await db.adCreative.findMany({ where: { active: true } });
  if (activeCreatives.length === 0) {
    return NextResponse.json({ shouldPlayAd: false });
  }

  // Weighted random pick
  const totalWeight = activeCreatives.reduce((sum, c) => sum + c.weight, 0);
  let roll = Math.random() * totalWeight;
  const chosen = activeCreatives.find((c) => (roll -= c.weight) <= 0) ?? activeCreatives[0];

  await db.adImpression.create({
    data: { adCreativeId: chosen.id, episodeId, userId: userId ?? undefined, breakPosition },
  });

  return NextResponse.json({
    shouldPlayAd: true,
    creative: { videoAssetId: chosen.videoAssetId, durationSeconds: chosen.durationSeconds },
  });
}
