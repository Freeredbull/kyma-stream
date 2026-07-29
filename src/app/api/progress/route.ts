import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const bodySchema = z.object({
  episodeId: z.string().min(1),
  positionSeconds: z.number().int().nonnegative(),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ ok: true }); // anonymous viewers: no-op

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { episodeId, positionSeconds } = parsed.data;
  const userId = session.user.id;

  await db.watchProgress.upsert({
    where: { userId_episodeId: { userId, episodeId } },
    create: { userId, episodeId, positionSeconds },
    update: { positionSeconds },
  });

  return NextResponse.json({ ok: true });
}
