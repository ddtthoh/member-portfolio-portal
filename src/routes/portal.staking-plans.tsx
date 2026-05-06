import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/staking-plans")({
  component: StakingPlansPage,
});

type Plan = { name: string; minAmount: string; roi: string };

const plans: Plan[] = [
  { name: "Standard Lite", minAmount: "$100.00", roi: "0.15% – 0.25%" },
  { name: "Standard Plus", minAmount: "$300.00", roi: "0.15% – 0.25%" },
  { name: "Standard Pro", minAmount: "$500.00", roi: "0.15% – 0.25%" },
  { name: "Advance Lite", minAmount: "$1,000.00", roi: "0.25% – 0.35%" },
  { name: "Advance Plus", minAmount: "$3,000.00", roi: "0.25% – 0.35%" },
  { name: "Advance Pro", minAmount: "$5,000.00", roi: "0.25% – 0.35%" },
  { name: "Premium Lite", minAmount: "$10,000.00", roi: "0.35% – 0.45%" },
  { name: "Premium Plus", minAmount: "$30,000.00", roi: "0.35% – 0.45%" },
  { name: "Premium Pro", minAmount: "$50,000.00", roi: "0.35% – 0.45%" },
];

function StakingPlansPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Staking"
        title="Staking Plan"
        description="Choose a participation tier that matches your goals."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="liquid-glass rounded-xl px-5 py-4">
            <h3 className="font-serif text-lg font-semibold leading-tight tracking-tight text-gold">
              {plan.name}
            </h3>

            <div className="mt-3 space-y-3">
              <div>
                <div className="text-[9px] font-medium uppercase tracking-[0.22em] text-gold/70">
                  Minimum Participation
                </div>
                <div className="mt-0.5 font-sans text-lg font-semibold leading-tight tabular-nums text-gold">
                  {plan.minAmount}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.22em] text-gold/70">
                  <TrendingUp className="h-3 w-3" /> Monthly ROI
                </div>
                <div className="mt-0.5 font-sans text-lg font-semibold leading-tight tabular-nums text-gold">
                  {plan.roi}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
