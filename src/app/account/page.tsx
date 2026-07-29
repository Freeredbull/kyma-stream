import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLAN_DETAILS } from "@/lib/stripe";

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const subscription = await db.subscription.findUnique({ where: { userId: session.user.id } });
  const plan = PLAN_DETAILS.find((p) => p.tier === (subscription?.tier ?? "FREE_AD_SUPPORTED"));

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl text-sand mb-2">Your account</h1>
      <p className="text-sand/70 mb-8">{session.user.email}</p>

      <div className="rounded-xl border border-night-light bg-night-light/40 p-6">
        <p className="font-mono text-xs text-sand-dim uppercase mb-1">Current plan</p>
        <p className="font-display text-2xl text-ochre-bright">{plan?.name ?? "KYMA Free"}</p>
        {subscription?.status === "PAST_DUE" && (
          <p className="text-coral text-sm mt-2">
            Your last payment didn&apos;t go through — update your billing details to keep watching ad-free.
          </p>
        )}
        {subscription?.cancelAtPeriodEnd && subscription.currentPeriodEnd && (
          <p className="text-sand/70 text-sm mt-2">
            Your plan cancels on {subscription.currentPeriodEnd.toLocaleDateString()}. You&apos;ll keep access until
            then.
          </p>
        )}
        <a href="/pricing" className="inline-block mt-5 text-ochre-bright hover:underline text-sm">
          {subscription?.tier === "PREMIUM" ? "Manage plan" : "Change plan →"}
        </a>
      </div>
    </main>
  );
}
