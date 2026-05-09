import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { MetricValue } from "@/components/metric-value";
import { Button } from "@/components/ui/button";
import { StartStakingDialog, type StakingPlanOption } from "@/components/start-staking-dialog";

export const Route = createFileRoute("/portal/staking-plans")({
  component: StakingPlansPage,
});

type Tier = "standard" | "advance" | "premium";

type Plan = StakingPlanOption & {
  tier: Tier;
  dailyRoi: string;
  monthlyRoi: string;
};

const plans: Plan[] = [
  { tier: "standard", name: "pages.stakingPlans.plans.standardLite", minAmount: 100,   roi: "0.15% – 0.25%", roiMin: 0.0015, roiMax: 0.0025, dailyRoi: "0.15% – 0.25%", monthlyRoi: "4.5% – 7.5%" },
  { tier: "standard", name: "pages.stakingPlans.plans.standardPlus", minAmount: 300,   roi: "0.15% – 0.25%", roiMin: 0.0015, roiMax: 0.0025, dailyRoi: "0.15% – 0.25%", monthlyRoi: "4.5% – 7.5%" },
  { tier: "standard", name: "pages.stakingPlans.plans.standardPro",  minAmount: 500,   roi: "0.15% – 0.25%", roiMin: 0.0015, roiMax: 0.0025, dailyRoi: "0.15% – 0.25%", monthlyRoi: "4.5% – 7.5%" },
  { tier: "advance",  name: "pages.stakingPlans.plans.advanceLite",  minAmount: 1000,  roi: "0.25% – 0.35%", roiMin: 0.0025, roiMax: 0.0035, dailyRoi: "0.25% – 0.35%", monthlyRoi: "7.5% – 10.5%" },
  { tier: "advance",  name: "pages.stakingPlans.plans.advancePlus",  minAmount: 3000,  roi: "0.25% – 0.35%", roiMin: 0.0025, roiMax: 0.0035, dailyRoi: "0.25% – 0.35%", monthlyRoi: "7.5% – 10.5%" },
  { tier: "advance",  name: "pages.stakingPlans.plans.advancePro",   minAmount: 5000,  roi: "0.25% – 0.35%", roiMin: 0.0025, roiMax: 0.0035, dailyRoi: "0.25% – 0.35%", monthlyRoi: "7.5% – 10.5%" },
  { tier: "premium",  name: "pages.stakingPlans.plans.premiumLite",  minAmount: 10000, roi: "0.35% – 0.45%", roiMin: 0.0035, roiMax: 0.0045, dailyRoi: "0.35% – 0.45%", monthlyRoi: "10.5% – 13.5%" },
  { tier: "premium",  name: "pages.stakingPlans.plans.premiumPlus",  minAmount: 30000, roi: "0.35% – 0.45%", roiMin: 0.0035, roiMax: 0.0045, dailyRoi: "0.35% – 0.45%", monthlyRoi: "10.5% – 13.5%" },
  { tier: "premium",  name: "pages.stakingPlans.plans.premiumPro",   minAmount: 50000, roi: "0.35% – 0.45%", roiMin: 0.0035, roiMax: 0.0045, dailyRoi: "0.35% – 0.45%", monthlyRoi: "10.5% – 13.5%" },
];

const tierLabels: Record<Tier, string> = {
  standard: "Standard",
  advance: "Advance",
  premium: "Premium",
};

const nbspRange = (s: string) => s.replace(/\s*–\s*/, "\u00A0–\u00A0");

function StakingPlansPage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const grouped: Record<Tier, Plan[]> = {
    standard: plans.filter((p) => p.tier === "standard"),
    advance: plans.filter((p) => p.tier === "advance"),
    premium: plans.filter((p) => p.tier === "premium"),
  };

  return (
    <div className="space-y-6 pb-28 sm:pb-8">
      <PageHeader
        eyebrow={t("pages.stakingPlans.eyebrow")}
        title={t("pages.stakingPlans.title")}
        description={t("pages.stakingPlans.description")}
      />

      {/* Hero CTA — inline, above first tier */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={() => setOpen(true)}
          className="cta-premium group relative w-full sm:w-auto overflow-hidden rounded-full border-0 px-8 sm:px-12 py-5 sm:py-6 text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.32em] transition-transform hover:-translate-y-0.5"
        >
          <Sparkles className="mr-2 sm:mr-2.5 h-4 w-4 relative z-10" strokeWidth={2.2} />
          <span className="relative z-10">{t("pages.stakingPlans.cta", { defaultValue: "Start Staking" })}</span>
          <Sparkles className="ml-2 sm:ml-2.5 h-4 w-4 relative z-10" strokeWidth={2.2} />
        </Button>
      </div>

      {/* Tier sections */}
      {(Object.keys(grouped) as Tier[]).map((tier) => {
        const tierPlans = grouped[tier];
        const sample = tierPlans[0];
        return (
          <section key={tier} className="space-y-3">
            {/* Plan cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tierPlans.map((plan) => (
                <SpotlightCard
                  key={plan.name}
                  className="liquid-glass h-full rounded-2xl px-5 py-5"
                >
                  <h3 className="font-serif text-base font-semibold leading-tight tracking-tight text-foreground sm:text-lg">
                    {t(plan.name)}
                  </h3>

                  <div className="mt-4">
                    <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      {t("pages.stakingPlans.labels.minimumStaking")}
                    </div>
                    <div className="mt-1 leading-none">
                      <MetricValue value={plan.minAmount} prefix="$" decimals={2} size="lg" static />
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 border-t border-gold/15 pt-3">
                    <Row label={t("pages.stakingPlans.labels.dailyRoi", { defaultValue: "Daily ROI" })} value={nbspRange(plan.dailyRoi)} />
                    <Row label={t("pages.stakingPlans.labels.monthlyRoi")} value={nbspRange(plan.monthlyRoi)} emphasize />
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </section>
        );
      })}

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden">
        <div
          className="px-4 pb-4 pt-3"
          style={{
            background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--background) 92%, transparent) 35%, var(--background) 80%)",
          }}
        >
          <Button
            size="lg"
            onClick={() => setOpen(true)}
            className="cta-premium group relative w-full overflow-hidden rounded-full border-0 py-5 text-[12px] font-semibold uppercase tracking-[0.3em]"
          >
            <Sparkles className="mr-2 h-4 w-4 relative z-10" strokeWidth={2.2} />
            <span className="relative z-10">{t("pages.stakingPlans.cta", { defaultValue: "Start Staking" })}</span>
            <Sparkles className="ml-2 h-4 w-4 relative z-10" strokeWidth={2.2} />
          </Button>
        </div>
      </div>

      <StartStakingDialog open={open} onOpenChange={setOpen} plans={plans} />
    </div>
  );
}

function Row({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      <span className={`font-light text-sm tabular-nums tracking-[-0.04em] whitespace-nowrap ${emphasize ? "text-gold" : "text-foreground/90"}`}>
        {value}
      </span>
    </div>
  );
}
