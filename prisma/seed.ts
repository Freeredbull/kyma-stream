import "dotenv/config"; // Prisma 7 no longer auto-loads .env for standalone scripts
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const series = await db.title.upsert({
    where: { slug: "limassol-nights" },
    update: {},
    create: {
      type: "SERIES",
      title: "Limassol Nights",
      slug: "limassol-nights",
      synopsis:
        "A marina bar owner and a visiting detective get pulled into a smuggling case that stretches from the old town to the port.",
      genres: ["Drama", "Crime"],
      language: "el-CY",
      ageRating: "16+",
      cast: ["Elena Christodoulou", "Marios Ioannou"],
      isOriginal: true,
      featured: true,
      seasons: {
        create: [
          {
            number: 1,
            episodes: {
              create: [
                {
                  number: 1,
                  name: "The Marina",
                  synopsis: "A body washes up near the old port.",
                  durationSeconds: 2640,
                  videoAssetId: "REPLACE_WITH_BUNNY_VIDEO_ID_1",
                  freeWithAds: true,
                },
                {
                  number: 2,
                  name: "Old Town",
                  synopsis: "The detective follows a lead into the backstreets.",
                  durationSeconds: 2580,
                  videoAssetId: "REPLACE_WITH_BUNNY_VIDEO_ID_2",
                  freeWithAds: false,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const movie = await db.title.upsert({
    where: { slug: "kyrenia-road" },
    update: {},
    create: {
      type: "MOVIE",
      title: "Kyrenia Road",
      slug: "kyrenia-road",
      synopsis: "Two brothers separated for decades reconnect on a road trip across the island.",
      genres: ["Drama"],
      language: "el-CY",
      ageRating: "PG",
      cast: ["Andreas Papadopoulos"],
      isOriginal: true,
      freeWithAds: true,
      releaseYear: 2025,
      episodes: {
        create: [
          {
            number: 1,
            name: "Kyrenia Road",
            durationSeconds: 5700,
            videoAssetId: "REPLACE_WITH_BUNNY_VIDEO_ID_3",
            freeWithAds: true,
          },
        ],
      },
    },
  });

  const podcast = await db.title.upsert({
    where: { slug: "coffee-and-carob" },
    update: {},
    create: {
      type: "PODCAST",
      title: "Coffee & Carob",
      slug: "coffee-and-carob",
      synopsis: "Weekly conversations about Cypriot food, culture, and the people keeping traditions alive.",
      genres: ["Culture", "Talk"],
      language: "el-CY",
      isOriginal: true,
      freeWithAds: true,
      episodes: {
        create: [
          {
            number: 1,
            name: "Ep. 1 — Halloumi's real story",
            durationSeconds: 1800,
            videoAssetId: "REPLACE_WITH_BUNNY_VIDEO_ID_4",
            audioAssetId: "REPLACE_WITH_AUDIO_ID_1",
            freeWithAds: true,
          },
        ],
      },
    },
  });

  await db.adCreative.upsert({
    where: { id: "seed-ad-1" },
    update: {},
    create: {
      id: "seed-ad-1",
      advertiserName: "Sample Local Advertiser",
      videoAssetId: "REPLACE_WITH_BUNNY_AD_VIDEO_ID",
      durationSeconds: 15,
      active: true,
      weight: 1,
    },
  });

  console.log({ series: series.slug, movie: movie.slug, podcast: podcast.slug });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
