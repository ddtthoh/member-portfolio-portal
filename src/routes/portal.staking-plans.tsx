import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";

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
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow={t("pages.stakingPlans.eyebrow")} title={t("pages.stakingPlans.title")} description={t("pages.stakingPlans.description")} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <SpotlightCard key={plan.name} className="liquid-glass rounded-2xl px-5 py-4">
            <h3 className="font-serif text-lg font-semibold leading-tight tracking-tight text-gold">
              {plan.name}
            </h3>

            <div className="mt-3 grid grid-cols-2 divide-x divide-gold/40">
              <div className="pr-4">
                <div className="text-[9px] font-medium uppercase tracking-[0.22em] text-gold/70">
                  Minimum Staking
                </div>
                <div className="mt-0.5 font-light text-2xl tabular-nums tracking-[-0.04em] text-gold">
                  {plan.minAmount}
                </div>
              </div>

              <div className="pl-4">
                <div className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.22em] text-gold/70">
                  <TrendingUp className="h-3 w-3" /> Monthly ROI
                </div>
                <div className="mt-0.5 font-light text-2xl tabular-nums tracking-[-0.04em] text-gold">
                  {plan.roi}
                </div>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
