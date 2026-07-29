import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { TitleType } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") as TitleType | null;
  const genre = req.nextUrl.searchParams.get("genre");
  const q = req.nextUrl.searchParams.get("q");

  const titles = await db.title.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(genre ? { genres: { has: genre } } : {}),
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return NextResponse.json({ titles });
}
