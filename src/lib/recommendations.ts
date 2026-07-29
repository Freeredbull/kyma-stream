import { db } from "@/lib/db";

// Deliberately simple, explainable recommendations for launch — no ML
// pipeline needed yet at this catalog size. Two signals:
//  1. Continue watching: anything in-progress and not finished.
//  2. Because you watched X: genre overlap with your most recently
//     watched title, excluding titles you've already started.
// This is enough to feel personalized with a few dozen titles. Revisit once
// you have real engagement data — a collaborative-filtering pass (users who
// watched X also watched Y) is the natural next step.

export async function getContinueWatching(userId: string, take = 10) {
  const progress = await db.watchProgress.findMany({
    where: { userId, completed: false, positionSeconds: { gt: 30 } },
    orderBy: { updatedAt: "desc" },
    take,
    include: { episode: { include: { title: true } } },
  });

  return progress.map((p) => ({
    episodeId: p.episode.id,
    positionSeconds: p.positionSeconds,
    durationSeconds: p.episode.durationSeconds,
    episodeName: p.episode.name,
    title: p.episode.title,
  }));
}

export async function getBecauseYouWatched(userId: string, take = 12) {
  const mostRecent = await db.watchProgress.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { episode: { include: { title: true } } },
  });

  if (!mostRecent || mostRecent.episode.title.genres.length === 0) return null;

  const watchedTitleIds = (
    await db.watchProgress.findMany({ where: { userId }, select: { episode: { select: { titleId: true } } } })
  ).map((w) => w.episode.titleId);

  const suggestions = await db.title.findMany({
    where: {
      genres: { hasSome: mostRecent.episode.title.genres },
      id: { notIn: [...new Set(watchedTitleIds)] },
    },
    take,
    orderBy: { createdAt: "desc" },
  });

  if (suggestions.length === 0) return null;

  return { basedOn: mostRecent.episode.title.title, titles: suggestions };
}
