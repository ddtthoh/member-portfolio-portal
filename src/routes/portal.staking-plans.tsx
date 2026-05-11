import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingUp, CalendarClock, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { MetricValue } from "@/components/metric-value";
import { Button } from "@/components/ui/button";
import { StartStakingDialog, type StakingPlanOption } from "@/components/start-staking-dialog";
import { useWallet } from "@/hooks/use-wallet";

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
  const { wallet } = useWallet();

  const grouped: Record<Tier, Plan[]> = {
    standard: plans.filter((p) => p.tier === "standard"),
    advance: plans.filter((p) => p.tier === "advance"),
    premium: plans.filter((p) => p.tier === "premium"),
  };

  // Match user's current staking amount to a plan tier
  const currentPlan = useMemo(() => {
    const sorted = [...plans].sort((a, b) => a.minAmount - b.minAmount);
    let match = sorted[0];
    for (const p of sorted) {
      if (wallet.staking >= p.minAmount) match = p;
    }
    return match;
  }, [wallet.staking]);

  const hasStaking = wallet.staking > 0;
  const startedSince = "2026-02-14"; // mock since date — wire to real data when available
  const stakingDays = hasStaking
    ? Math.max(1, Math.floor((Date.now() - new Date(startedSince).getTime()) / 86400000))
    : 0;

  return (
    <div className="space-y-6 pb-28 sm:pb-8">
      <PageHeader
        eyebrow={t("pages.stakingPlans.eyebrow")}
        title={t("pages.stakingPlans.title")}
        description={t("pages.stakingPlans.description")}
      />

      {/* Current staking status — distinctive glowing card */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-90 blur-[2px]"
          style={{
            background:
              "conic-gradient(from 140deg at 50% 50%, color-mix(in oklab, var(--gold) 55%, transparent), transparent 30%, color-mix(in oklab, var(--gold) 35%, transparent) 55%, transparent 80%, color-mix(in oklab, var(--gold) 55%, transparent))",
          }}
        />
        <div
          className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-card/95 via-card/80 to-background/95 px-5 py-5 sm:px-7 sm:py-6"
          style={{
            boxShadow:
              "0 10px 40px -12px color-mix(in oklab, var(--gold) 35%, transparent)",
          }}
        >
          {/* corner glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -bottom-20 h-44 w-44 rounded-full bg-gold/10 blur-3xl"
          />

          <div className="relative flex items-center gap-2">
            <Crown className="h-4 w-4 text-gold" strokeWidth={2.2} />
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-gold/85">
              {t("pages.stakingPlans.yourPosition", { defaultValue: "Your Position" })}
            </span>
            {hasStaking && (
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-success">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                {t("pages.staking.status.active", { defaultValue: "Active" })}
              </span>
            )}
          </div>

          <div className="relative mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            {/* Staking amount */}
            <div className="sm:border-r sm:border-gold/15 sm:pr-6">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {t("pages.stakingPlans.labels.yourStaking", { defaultValue: "Your Staking" })}
              </div>
              <div className="mt-1.5 leading-none">
                <MetricValue value={wallet.staking} prefix="$" decimals={2} size="xl" />
              </div>
              {!hasStaking && (
                <div className="mt-1.5 text-[10px] text-muted-foreground/80">
                  {t("pages.stakingPlans.labels.noStake", { defaultValue: "No active stake yet" })}
                </div>
              )}
            </div>

            {/* Current tier + ROI (daily & monthly) */}
            <div className="sm:border-r sm:border-gold/15 sm:pr-6">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                {t("pages.stakingPlans.labels.currentTier", { defaultValue: "Current Tier" })}
              </div>
              <div className="mt-1.5 font-serif text-xl sm:text-2xl leading-none text-gold">
                {hasStaking ? t(currentPlan.name) : "—"}
              </div>
              {hasStaking ? (
                <div className="mt-2.5 inline-flex items-stretch overflow-hidden rounded-md border border-gold/20 bg-gradient-to-r from-gold/[0.06] via-gold/[0.04] to-transparent">
                  <div className="flex flex-col items-start gap-0.5 px-2.5 py-1.5">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground/70">
                      {t("pages.stakingPlans.labels.dailyRoi", { defaultValue: "Daily" })}
                    </span>
                    <span className="text-[11px] font-medium tabular-nums tracking-tight text-gold/90 leading-none">
                      {currentPlan.dailyRoi.replace(/\s*–\s*/, "\u00A0–\u00A0")}
                    </span>
                  </div>
                  <div className="w-px bg-gold/20" />
                  <div className="flex flex-col items-start gap-0.5 px-2.5 py-1.5">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground/70">
                      {t("pages.stakingPlans.labels.monthlyRoi", { defaultValue: "Monthly" })}
                    </span>
                    <span className="text-[11px] font-medium tabular-nums tracking-tight text-gold leading-none">
                      {currentPlan.monthlyRoi.replace(/\s*–\s*/, "\u00A0–\u00A0")}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-1.5 text-[10px] tabular-nums text-muted-foreground/80">
                  {t("pages.stakingPlans.labels.unlockTier", { defaultValue: "Stake to unlock" })}
                </div>
              )}
            </div>

            {/* Started since */}
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <CalendarClock className="h-3 w-3" />
                {t("pages.stakingPlans.labels.startedSince", { defaultValue: "Started Since" })}
              </div>
              <div className="mt-1.5 font-light text-xl sm:text-2xl leading-none tabular-nums tracking-tight text-gold">
                {hasStaking ? startedSince : "—"}
              </div>
              <div className="mt-1.5 text-[10px] tabular-nums text-muted-foreground/80">
                {hasStaking
                  ? `${stakingDays} ${t("pages.holdings.daysUnit", { defaultValue: "days" })}`
                  : t("pages.stakingPlans.labels.startToday", { defaultValue: "Begin your journey" })}
              </div>
            </div>
          </div>
        </div>
      </div>

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
