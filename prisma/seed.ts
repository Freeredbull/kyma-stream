import "dotenv/config"; // Prisma 7 no longer auto-loads .env for standalone scripts
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

// Demo playback: a public Apple HLS test stream, used purely so the player
// actually works out of the box. Swap videoAssetId for a real Bunny/Mux
// asset id per title once you upload real content — see README.
const DEMO_STREAM = "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8";

// placehold.co generates a solid-color box with text — brand-colored,
// zero copyright risk, good enough to look intentional until real poster
// art exists.
function poster(text: string) {
  return `https://placehold.co/400x600/12293d/e8dfc8?font=playfair-display&text=${encodeURIComponent(text)}`;
}
function backdrop(text: string) {
  return `https://placehold.co/1600x600/0b1e2d/e8dfc8?font=playfair-display&text=${encodeURIComponent(text)}`;
}

async function main() {
  // ---------------- Series ----------------

  const limassolNights = await db.title.upsert({
    where: { slug: "limassol-nights" },
    update: {},
    create: {
      type: "SERIES",
      title: "Limassol Nights",
      slug: "limassol-nights",
      synopsis:
        "A marina bar owner and a visiting detective get pulled into a smuggling case that stretches from the old town to the port.",
      posterUrl: poster("Limassol Nights"),
      backdropUrl: backdrop("Limassol Nights"),
      genres: ["Drama", "Crime"],
      language: "el-CY",
      ageRating: "16+",
      cast: ["Elena Christodoulou", "Marios Ioannou"],
      isOriginal: true,
      featured: true,
      releaseYear: 2026,
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
                  videoAssetId: DEMO_STREAM,
                  thumbnailUrl: poster("S1E1"),
                  freeWithAds: true,
                },
                {
                  number: 2,
                  name: "Old Town",
                  synopsis: "The detective follows a lead into the backstreets.",
                  durationSeconds: 2580,
                  videoAssetId: DEMO_STREAM,
                  thumbnailUrl: poster("S1E2"),
                  freeWithAds: false,
                },
                {
                  number: 3,
                  name: "The Bar Owner",
                  synopsis: "An old rivalry resurfaces at the marina.",
                  durationSeconds: 2700,
                  videoAssetId: DEMO_STREAM,
                  thumbnailUrl: poster("S1E3"),
                  freeWithAds: false,
                },
              ],
            },
          },
          {
            number: 2,
            episodes: {
              create: [
                {
                  number: 1,
                  name: "New Season, New Trouble",
                  synopsis: "A rival syndicate moves in on the port.",
                  durationSeconds: 2650,
                  videoAssetId: DEMO_STREAM,
                  thumbnailUrl: poster("S2E1"),
                  freeWithAds: false,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const nicosiaHigh = await db.title.upsert({
    where: { slug: "nicosia-high" },
    update: {},
    create: {
      type: "SERIES",
      title: "Nicosia High",
      slug: "nicosia-high",
      synopsis: "Four teenagers navigate friendship, family, and the last divided capital in Europe.",
      posterUrl: poster("Nicosia High"),
      backdropUrl: backdrop("Nicosia High"),
      genres: ["Drama", "Teen"],
      language: "el-CY",
      ageRating: "13+",
      cast: ["Sofia Georgiou", "Andreas Michael"],
      isOriginal: true,
      releaseYear: 2025,
      freeWithAds: true,
      seasons: {
        create: [
          {
            number: 1,
            episodes: {
              create: [
                {
                  number: 1,
                  name: "The Buffer Zone",
                  durationSeconds: 2400,
                  videoAssetId: DEMO_STREAM,
                  thumbnailUrl: poster("S1E1"),
                  freeWithAds: true,
                },
                {
                  number: 2,
                  name: "Exams",
                  durationSeconds: 2350,
                  videoAssetId: DEMO_STREAM,
                  thumbnailUrl: poster("S1E2"),
                  freeWithAds: true,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const villageSecrets = await db.title.upsert({
    where: { slug: "village-secrets" },
    update: {},
    create: {
      type: "SERIES",
      title: "Village Secrets",
      slug: "village-secrets",
      synopsis: "A mountain village in Troodos hides fifty years of buried history when a hotel developer arrives.",
      posterUrl: poster("Village Secrets"),
      backdropUrl: backdrop("Village Secrets"),
      genres: ["Drama", "Mystery"],
      language: "el-CY",
      ageRating: "16+",
      cast: ["Katerina Papas"],
      isOriginal: true,
      releaseYear: 2026,
      seasons: {
        create: [
          {
            number: 1,
            episodes: {
              create: [
                {
                  number: 1,
                  name: "The Developer",
                  durationSeconds: 2500,
                  videoAssetId: DEMO_STREAM,
                  thumbnailUrl: poster("S1E1"),
                  freeWithAds: false,
                },
                {
                  number: 2,
                  name: "The Well",
                  durationSeconds: 2550,
                  videoAssetId: DEMO_STREAM,
                  thumbnailUrl: poster("S1E2"),
                  freeWithAds: false,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const halloumiChronicles = await db.title.upsert({
    where: { slug: "halloumi-chronicles" },
    update: {},
    create: {
      type: "SERIES",
      title: "The Halloumi Chronicles",
      slug: "halloumi-chronicles",
      synopsis: "A comedy about three cousins trying to save their family's failing dairy farm.",
      posterUrl: poster("Halloumi Chronicles"),
      backdropUrl: backdrop("Halloumi Chronicles"),
      genres: ["Comedy"],
      language: "el-CY",
      ageRating: "PG",
      cast: ["Christos Louka"],
      isOriginal: true,
      releaseYear: 2025,
      freeWithAds: true,
      seasons: {
        create: [
          {
            number: 1,
            episodes: {
              create: [
                {
                  number: 1,
                  name: "The Inheritance",
                  durationSeconds: 1500,
                  videoAssetId: DEMO_STREAM,
                  thumbnailUrl: poster("S1E1"),
                  freeWithAds: true,
                },
                {
                  number: 2,
                  name: "The Inspector",
                  durationSeconds: 1550,
                  videoAssetId: DEMO_STREAM,
                  thumbnailUrl: poster("S1E2"),
                  freeWithAds: true,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // ---------------- Movies ----------------

  await db.title.upsert({
    where: { slug: "kyrenia-road" },
    update: {},
    create: {
      type: "MOVIE",
      title: "Kyrenia Road",
      slug: "kyrenia-road",
      synopsis: "Two brothers separated for decades reconnect on a road trip across the island.",
      posterUrl: poster("Kyrenia Road"),
      backdropUrl: backdrop("Kyrenia Road"),
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
            videoAssetId: DEMO_STREAM,
            thumbnailUrl: poster("Kyrenia Road"),
            freeWithAds: true,
          },
        ],
      },
    },
  });

  await db.title.upsert({
    where: { slug: "salt-lake" },
    update: {},
    create: {
      type: "MOVIE",
      title: "Salt Lake",
      slug: "salt-lake",
      synopsis: "During the pink flamingo migration, a Larnaca fisherman's missing daughter case reopens.",
      posterUrl: poster("Salt Lake"),
      backdropUrl: backdrop("Salt Lake"),
      genres: ["Thriller", "Drama"],
      language: "el-CY",
      ageRating: "16+",
      cast: ["Nikos Charalambous"],
      isOriginal: true,
      releaseYear: 2026,
      episodes: {
        create: [
          {
            number: 1,
            name: "Salt Lake",
            durationSeconds: 6200,
            videoAssetId: DEMO_STREAM,
            thumbnailUrl: poster("Salt Lake"),
            freeWithAds: false,
          },
        ],
      },
    },
  });

  await db.title.upsert({
    where: { slug: "aphrodites-rock" },
    update: {},
    create: {
      type: "MOVIE",
      title: "Aphrodite's Rock",
      slug: "aphrodites-rock",
      synopsis: "A romantic comedy about a wedding photographer who keeps running into her ex at Paphos shoots.",
      posterUrl: poster("Aphrodite's Rock"),
      backdropUrl: backdrop("Aphrodite's Rock"),
      genres: ["Romance", "Comedy"],
      language: "en",
      ageRating: "PG",
      cast: ["Maria Antoniou"],
      isOriginal: true,
      releaseYear: 2024,
      freeWithAds: true,
      episodes: {
        create: [
          {
            number: 1,
            name: "Aphrodite's Rock",
            durationSeconds: 5400,
            videoAssetId: DEMO_STREAM,
            thumbnailUrl: poster("Aphrodite's Rock"),
            freeWithAds: true,
          },
        ],
      },
    },
  });

  // ---------------- Podcasts ----------------

  await db.title.upsert({
    where: { slug: "coffee-and-carob" },
    update: {},
    create: {
      type: "PODCAST",
      title: "Coffee & Carob",
      slug: "coffee-and-carob",
      synopsis: "Weekly conversations about Cypriot food, culture, and the people keeping traditions alive.",
      posterUrl: poster("Coffee & Carob"),
      backdropUrl: backdrop("Coffee & Carob"),
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
            videoAssetId: DEMO_STREAM,
            thumbnailUrl: poster("Ep. 1"),
            freeWithAds: true,
          },
          {
            number: 2,
            name: "Ep. 2 — The last carob mills",
            durationSeconds: 1950,
            videoAssetId: DEMO_STREAM,
            thumbnailUrl: poster("Ep. 2"),
            freeWithAds: true,
          },
        ],
      },
    },
  });

  await db.title.upsert({
    where: { slug: "island-business" },
    update: {},
    create: {
      type: "PODCAST",
      title: "Island Business",
      slug: "island-business",
      synopsis: "Interviews with Cypriot founders, from shipping to shipping containers full of halloumi exports.",
      posterUrl: poster("Island Business"),
      backdropUrl: backdrop("Island Business"),
      genres: ["Business", "Talk"],
      language: "en",
      isOriginal: true,
      episodes: {
        create: [
          {
            number: 1,
            name: "Ep. 1 — Shipping to the world",
            durationSeconds: 2100,
            videoAssetId: DEMO_STREAM,
            thumbnailUrl: poster("Ep. 1"),
            freeWithAds: false,
          },
        ],
      },
    },
  });

  await db.title.upsert({
    where: { slug: "troodos-trails" },
    update: {},
    create: {
      type: "PODCAST",
      title: "Troodos Trails",
      slug: "troodos-trails",
      synopsis: "A slow-travel audio series walking every mountain village worth visiting in the Troodos range.",
      posterUrl: poster("Troodos Trails"),
      backdropUrl: backdrop("Troodos Trails"),
      genres: ["Culture", "Travel"],
      language: "el-CY",
      isOriginal: true,
      freeWithAds: true,
      episodes: {
        create: [
          {
            number: 1,
            name: "Ep. 1 — Kakopetria",
            durationSeconds: 1400,
            videoAssetId: DEMO_STREAM,
            thumbnailUrl: poster("Ep. 1"),
            freeWithAds: true,
          },
        ],
      },
    },
  });

  // ---------------- Ad creatives ----------------

  await db.adCreative.upsert({
    where: { id: "seed-ad-1" },
    update: {},
    create: {
      id: "seed-ad-1",
      advertiserName: "Cyprus Tourism Organisation (demo)",
      videoAssetId: DEMO_STREAM,
      durationSeconds: 15,
      active: true,
      weight: 2,
    },
  });

  await db.adCreative.upsert({
    where: { id: "seed-ad-2" },
    update: {},
    create: {
      id: "seed-ad-2",
      advertiserName: "Local Advertiser (demo)",
      videoAssetId: DEMO_STREAM,
      durationSeconds: 15,
      active: true,
      weight: 1,
    },
  });

  console.log("Seeded:", {
    series: [limassolNights.slug, nicosiaHigh.slug, villageSecrets.slug, halloumiChronicles.slug],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
