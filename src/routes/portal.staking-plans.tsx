import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Button } from "@/components/ui/button";
import { StartStakingDialog, type StakingPlanOption } from "@/components/start-staking-dialog";

export const Route = createFileRoute("/portal/staking-plans")({
  component: StakingPlansPage,
});

const plans: StakingPlanOption[] = [
  { name: "pages.stakingPlans.plans.standardLite", minAmount: 100, roi: "0.15% – 0.25%", roiMin: 0.0015, roiMax: 0.0025 },
  { name: "pages.stakingPlans.plans.standardPlus", minAmount: 300, roi: "0.15% – 0.25%", roiMin: 0.0015, roiMax: 0.0025 },
  { name: "pages.stakingPlans.plans.standardPro", minAmount: 500, roi: "0.15% – 0.25%", roiMin: 0.0015, roiMax: 0.0025 },
  { name: "pages.stakingPlans.plans.advanceLite", minAmount: 1000, roi: "0.25% – 0.35%", roiMin: 0.0025, roiMax: 0.0035 },
  { name: "pages.stakingPlans.plans.advancePlus", minAmount: 3000, roi: "0.25% – 0.35%", roiMin: 0.0025, roiMax: 0.0035 },
  { name: "pages.stakingPlans.plans.advancePro", minAmount: 5000, roi: "0.25% – 0.35%", roiMin: 0.0025, roiMax: 0.0035 },
  { name: "pages.stakingPlans.plans.premiumLite", minAmount: 10000, roi: "0.35% – 0.45%", roiMin: 0.0035, roiMax: 0.0045 },
  { name: "pages.stakingPlans.plans.premiumPlus", minAmount: 30000, roi: "0.35% – 0.45%", roiMin: 0.0035, roiMax: 0.0045 },
  { name: "pages.stakingPlans.plans.premiumPro", minAmount: 50000, roi: "0.35% – 0.45%", roiMin: 0.0035, roiMax: 0.0045 },
];

function StakingPlansPage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow={t("pages.stakingPlans.eyebrow")} title={t("pages.stakingPlans.title")} description={t("pages.stakingPlans.description")} />

      {/* CTA — above the plans grid */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={() => setOpen(true)}
          className="cta-gold-breathe group relative overflow-hidden rounded-full border border-gold/55 bg-[linear-gradient(135deg,#070707_0%,#161208_50%,#070707_100%)] px-10 py-6 text-base font-medium uppercase tracking-[0.25em] text-gold transition-all hover:-translate-y-0.5 hover:border-gold/80"
        >
          <Sparkles className="mr-2 h-4 w-4 opacity-80 transition-opacity group-hover:opacity-100" />
          Start Staking
          <Sparkles className="ml-2 h-4 w-4 opacity-80 transition-opacity group-hover:opacity-100" />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <SpotlightCard key={plan.name} className="liquid-glass rounded-2xl px-5 py-4 h-full">
            <h3 className="font-serif text-lg font-semibold leading-tight tracking-tight text-gold">
              {t(plan.name)}
            </h3>

            <div className="mt-3 grid grid-cols-2 divide-x divide-gold/40">
              <div className="pr-3">
                <div className="text-[9px] font-medium uppercase tracking-[0.22em] text-gold/70">
                  {t("pages.stakingPlans.labels.minimumStaking")}
                </div>
                <div className="mt-0.5 font-light text-xl lg:text-[1.35rem] leading-none tabular-nums tracking-[-0.04em] text-gold whitespace-nowrap">
                  ${plan.minAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="pl-3">
                <div className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.22em] text-gold/70">
                  <TrendingUp className="h-3 w-3" /> {t("pages.stakingPlans.labels.monthlyRoi")}
                </div>
                <div className="mt-0.5 font-light text-xl lg:text-[1.35rem] leading-none tabular-nums tracking-[-0.04em] text-gold whitespace-nowrap">
                  {plan.roi.replace(/\s*–\s*/, "\u00A0–\u00A0")}
                </div>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>

      <StartStakingDialog open={open} onOpenChange={setOpen} plans={plans} />
    </div>
  );
}
