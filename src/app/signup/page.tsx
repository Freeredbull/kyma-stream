"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signUpError } = await signUp.email({ name, email, password });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message ?? "Couldn't create that account.");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <main className="mx-auto max-w-sm px-6 py-20">
      <h1 className="font-display text-3xl text-sand mb-2">Create your account</h1>
      <p className="text-sand/60 text-sm mb-8">Free to join — start watching with ads right away.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-night-light border border-sand/20 rounded-lg px-4 py-3 text-sand placeholder:text-sand-dim"
        />
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
          minLength={8}
          placeholder="Password (min. 8 characters)"
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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="text-sand/60 text-sm mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-ochre-bright hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
