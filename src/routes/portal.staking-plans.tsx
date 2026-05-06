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
  { name: "Advance Lite", minAmount: "$1,000.00", roi: "0.25% – 0.30%" },
  { name: "Advance Plus", minAmount: "$25,000.00", roi: "0.25% – 0.35%" },
  { name: "Advance Pro", minAmount: "$50,000.00", roi: "0.30% – 0.40%" },
  { name: "Elite", minAmount: "$100,000.00", roi: "0.35% – 0.45%" },
  { name: "Platinum", minAmount: "$250,000.00", roi: "0.40% – 0.50%" },
  { name: "Sovereign", minAmount: "$500,000.00", roi: "0.45% – 0.60%" },
];

function StakingPlansPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Staking"
        title="Staking Plan"
        description="Choose a participation tier that matches your goals."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="liquid-glass rounded-xl p-6">
            <h3 className="font-serif text-2xl font-semibold tracking-tight">
              {plan.name}
            </h3>

            <div className="mt-6 space-y-5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Minimum Participation
                </div>
                <div className="mt-1 font-sans text-2xl font-semibold tracking-tight tabular-nums text-foreground">
                  {plan.minAmount}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <TrendingUp className="h-3 w-3" /> Monthly ROI
                </div>
                <div className="mt-1 font-sans text-2xl font-semibold tracking-tight tabular-nums text-gold">
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
