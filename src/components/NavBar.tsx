import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Coastline from "./Coastline";
import SignOutButton from "./SignOutButton";

const links = [
  { href: "/browse", label: "Series" },
  { href: "/browse?type=MOVIE", label: "Films" },
  { href: "/podcasts", label: "Podcasts" },
  { href: "/pricing", label: "Plans" },
];

export default async function NavBar() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className="sticky top-0 z-50 bg-night/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display italic text-2xl tracking-tight text-sand">
          KYMA
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-body">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sand/80 hover:text-ochre-bright transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          {session?.user ? (
            <>
              <Link href="/account" className="text-sand/80 hover:text-sand">
                Account
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sand/80 hover:text-sand">
                Sign in
              </Link>
              <Link
                href="/pricing"
                className="bg-ochre text-night-deep font-medium px-4 py-2 rounded-full hover:bg-ochre-bright transition-colors"
              >
                Start watching
              </Link>
            </>
          )}
        </div>
      </div>
      <Coastline className="text-teal" />
    </header>
  );
}
