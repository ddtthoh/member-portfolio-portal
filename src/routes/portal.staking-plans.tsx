import { createFileRoute } from "@tanstack/react-router";
import { Banknote, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/staking-plans")({
  component: StakingPlansPage,
});

type Plan = { name: string; minAmount: string; roi: string };

const plans: Plan[] = [
  { name: "Starter", minAmount: "$1,000.00", roi: "0.10% – 0.15%" },
  { name: "Basic", minAmount: "$2,500.00", roi: "0.15% – 0.20%" },
  { name: "Standard", minAmount: "$5,000.00", roi: "0.20% – 0.25%" },
  { name: "Advance", minAmount: "$10,000.00", roi: "0.25% – 0.30%" },
  { name: "Advance Pro", minAmount: "$25,000.00", roi: "0.25% – 0.35%" },
  { name: "Premier", minAmount: "$50,000.00", roi: "0.30% – 0.40%" },
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
            <h3 className="font-serif text-xl font-semibold">{plan.name}</h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gold/15 text-gold">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-sans text-lg font-semibold tabular-nums">
                    {plan.minAmount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Minimum Participation Amount
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted/40 text-muted-foreground">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-sans text-lg font-semibold tabular-nums">
                    {plan.roi}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ROI Percentage
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
