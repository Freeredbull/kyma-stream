import { PLAN_DETAILS } from "@/lib/stripe";
import Coastline from "@/components/Coastline";
import PlanButton from "./PlanButton";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre-bright uppercase mb-3">Plans</p>
      <h1 className="font-display text-4xl text-sand mb-4">Watch your way</h1>
      <p className="text-sand/80 max-w-xl mb-10">
        Every plan gets the full KYMA Originals catalog. The difference is ads, quality, and how many
        screens you can use at once.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {PLAN_DETAILS.map((plan) => (
          <div key={plan.tier} className="rounded-xl border border-night-light bg-night-light/40 p-6 flex flex-col">
            <h2 className="font-display text-2xl text-sand">{plan.name}</h2>
            <p className="font-mono text-ochre-bright text-lg mt-2">{plan.price}</p>
            <ul className="mt-5 space-y-2 text-sm text-sand/80 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-teal-bright">·</span>
                  {f}
                </li>
              ))}
            </ul>
            <PlanButton tier={plan.tier} priceId={plan.priceId} />
          </div>
        ))}
      </div>

      <Coastline className="text-teal mt-16" />
      <p className="text-xs text-sand-dim font-mono mt-4">
        Prices in EUR. Cancel anytime. Ads shown on Free and Plus support Cypriot creators directly.
      </p>
    </main>
  );
}
