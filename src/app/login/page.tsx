"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn.email({ email, password });
    setLoading(false);
    if (signInError) {
      setError("Email or password is wrong.");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <main className="mx-auto max-w-sm px-6 py-20">
      <h1 className="font-display text-3xl text-sand mb-8">Sign in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-night-light border border-sand/20 rounded-lg px-4 py-3 text-sand placeholder:text-sand-dim"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-night-light border border-sand/20 rounded-lg px-4 py-3 text-sand placeholder:text-sand-dim"
        />
        {error && <p className="text-coral text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ochre text-night-deep font-medium px-4 py-3 rounded-full hover:bg-ochre-bright transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="text-sand/60 text-sm mt-6">
        New to KYMA?{" "}
        <Link href="/signup" className="text-ochre-bright hover:underline">
          Create an account
        </Link>
      </p>
    </main>
  );
}
