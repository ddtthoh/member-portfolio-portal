import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingUp, Calendar, Wallet, Crown, Gem, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
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
  // Standard — daily 0.15–0.25%, monthly 4.5–7.5%
  { tier: "standard", name: "pages.stakingPlans.plans.standardLite", minAmount: 100,   roi: "0.15% – 0.25%", roiMin: 0.0015, roiMax: 0.0025, dailyRoi: "0.15% – 0.25%", monthlyRoi: "4.5% – 7.5%" },
  { tier: "standard", name: "pages.stakingPlans.plans.standardPlus", minAmount: 300,   roi: "0.15% – 0.25%", roiMin: 0.0015, roiMax: 0.0025, dailyRoi: "0.15% – 0.25%", monthlyRoi: "4.5% – 7.5%" },
  { tier: "standard", name: "pages.stakingPlans.plans.standardPro",  minAmount: 500,   roi: "0.15% – 0.25%", roiMin: 0.0015, roiMax: 0.0025, dailyRoi: "0.15% – 0.25%", monthlyRoi: "4.5% – 7.5%" },
  // Advance — daily 0.25–0.35%, monthly 7.5–10.5%
  { tier: "advance",  name: "pages.stakingPlans.plans.advanceLite",  minAmount: 1000,  roi: "0.25% – 0.35%", roiMin: 0.0025, roiMax: 0.0035, dailyRoi: "0.25% – 0.35%", monthlyRoi: "7.5% – 10.5%" },
  { tier: "advance",  name: "pages.stakingPlans.plans.advancePlus",  minAmount: 3000,  roi: "0.25% – 0.35%", roiMin: 0.0025, roiMax: 0.0035, dailyRoi: "0.25% – 0.35%", monthlyRoi: "7.5% – 10.5%" },
  { tier: "advance",  name: "pages.stakingPlans.plans.advancePro",   minAmount: 5000,  roi: "0.25% – 0.35%", roiMin: 0.0025, roiMax: 0.0035, dailyRoi: "0.25% – 0.35%", monthlyRoi: "7.5% – 10.5%" },
  // Premium — daily 0.35–0.45%, monthly 10.5–13.5%
  { tier: "premium",  name: "pages.stakingPlans.plans.premiumLite",  minAmount: 10000, roi: "0.35% – 0.45%", roiMin: 0.0035, roiMax: 0.0045, dailyRoi: "0.35% – 0.45%", monthlyRoi: "10.5% – 13.5%" },
  { tier: "premium",  name: "pages.stakingPlans.plans.premiumPlus",  minAmount: 30000, roi: "0.35% – 0.45%", roiMin: 0.0035, roiMax: 0.0045, dailyRoi: "0.35% – 0.45%", monthlyRoi: "10.5% – 13.5%" },
  { tier: "premium",  name: "pages.stakingPlans.plans.premiumPro",   minAmount: 50000, roi: "0.35% – 0.45%", roiMin: 0.0035, roiMax: 0.0045, dailyRoi: "0.35% – 0.45%", monthlyRoi: "10.5% – 13.5%" },
];

const tierMeta: Record<Tier, {
  label: string;
  blurb: string;
  icon: typeof Award;
  accent: string; // hex-ish for inline gradients
  ring: string;   // tailwind border class
}> = {
  standard: {
    label: "Standard",
    blurb: "Entry tier · Steady, conservative yield",
    icon: Award,
    accent: "#94a3b8",
    ring: "border-slate-400/30",
  },
  advance: {
    label: "Advance",
    blurb: "Growth tier · Elevated daily yield band",
    icon: Gem,
    accent: "#60a5fa",
    ring: "border-sky-400/40",
  },
  premium: {
    label: "Premium",
    blurb: "Flagship tier · Highest yield bracket",
    icon: Crown,
    accent: "var(--gold)",
    ring: "border-gold/60",
  },
};

const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

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

      {/* Hero CTA — desktop / tablet */}
      <div className="hidden sm:flex justify-center">
        <Button
          size="lg"
          onClick={() => setOpen(true)}
          className="cta-premium group relative overflow-hidden rounded-full border-0 px-12 py-6 text-[13px] font-semibold uppercase tracking-[0.32em] transition-transform hover:-translate-y-0.5"
        >
          <Sparkles className="mr-2.5 h-4 w-4 relative z-10" strokeWidth={2.2} />
          <span className="relative z-10">{t("pages.stakingPlans.cta", { defaultValue: "Start Staking" })}</span>
          <Sparkles className="ml-2.5 h-4 w-4 relative z-10" strokeWidth={2.2} />
        </Button>
      </div>

      {/* Tier sections */}
      {(Object.keys(grouped) as Tier[]).map((tier) => {
        const meta = tierMeta[tier];
        const Icon = meta.icon;
        const tierPlans = grouped[tier];
        const sample = tierPlans[0];
        return (
          <section key={tier} className="space-y-3">
            {/* Tier header band */}
            <div
              className={`relative overflow-hidden rounded-2xl border ${meta.ring} bg-card/40 p-4 sm:p-5 backdrop-blur-sm`}
              style={{
                background: `linear-gradient(135deg, color-mix(in oklab, ${meta.accent} 14%, transparent) 0%, color-mix(in oklab, ${meta.accent} 4%, transparent) 60%, transparent 100%)`,
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl"
                style={{ background: `radial-gradient(circle, ${meta.accent}, transparent 70%)` }}
              />
              <div className="relative flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${meta.ring}`}
                    style={{ background: `color-mix(in oklab, ${meta.accent} 18%, transparent)` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: meta.accent }} strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl leading-none tracking-tight text-foreground sm:text-2xl">
                      {meta.label}
                    </h2>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {meta.blurb}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Stat icon={<Calendar className="h-3 w-3" />} label="Daily" value={sample.dailyRoi} accent={meta.accent} />
                  <Stat icon={<TrendingUp className="h-3 w-3" />} label="Monthly" value={sample.monthlyRoi} accent={meta.accent} />
                </div>
              </div>
            </div>

            {/* Plan cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tierPlans.map((plan) => (
                <SpotlightCard
                  key={plan.name}
                  className={`liquid-glass relative h-full overflow-hidden rounded-2xl border ${meta.ring} p-5`}
                >
                  {/* Top accent strip */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
                    }}
                  />
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-base font-semibold leading-tight tracking-tight text-foreground sm:text-lg">
                      {t(plan.name)}
                    </h3>
                    <span
                      className="rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em]"
                      style={{
                        color: meta.accent,
                        borderColor: `color-mix(in oklab, ${meta.accent} 50%, transparent)`,
                        background: `color-mix(in oklab, ${meta.accent} 10%, transparent)`,
                      }}
                    >
                      {meta.label}
                    </span>
                  </div>

                  {/* Minimum stake */}
                  <div className="mt-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      <Wallet className="h-3 w-3" />
                      {t("pages.stakingPlans.labels.minimumStaking")}
                    </div>
                    <div className="mt-1 font-light text-3xl leading-none tabular-nums tracking-[-0.04em] text-gold sm:text-[2rem]">
                      ${fmtUsd(plan.minAmount)}
                    </div>
                  </div>

                  {/* ROI breakdown */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div
                      className="rounded-lg border border-border/50 bg-background/40 p-2.5"
                    >
                      <div className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {t("pages.stakingPlans.labels.dailyRoi", { defaultValue: "Daily ROI" })}
                      </div>
                      <div className="mt-1 font-mono text-sm font-medium tabular-nums text-foreground whitespace-nowrap">
                        {plan.dailyRoi.replace(/\s*–\s*/, "\u00A0–\u00A0")}
                      </div>
                    </div>
                    <div
                      className="rounded-lg border p-2.5"
                      style={{
                        borderColor: `color-mix(in oklab, ${meta.accent} 40%, transparent)`,
                        background: `color-mix(in oklab, ${meta.accent} 8%, transparent)`,
                      }}
                    >
                      <div className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.18em]" style={{ color: meta.accent }}>
                        <TrendingUp className="h-3 w-3" />
                        {t("pages.stakingPlans.labels.monthlyRoi")}
                      </div>
                      <div className="mt-1 font-mono text-sm font-semibold tabular-nums whitespace-nowrap" style={{ color: meta.accent }}>
                        {plan.monthlyRoi.replace(/\s*–\s*/, "\u00A0–\u00A0")}
                      </div>
                    </div>
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

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-full border px-3 py-1.5"
      style={{
        borderColor: `color-mix(in oklab, ${accent} 40%, transparent)`,
        background: `color-mix(in oklab, ${accent} 8%, transparent)`,
      }}
    >
      <span className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-mono text-[11px] font-semibold tabular-nums whitespace-nowrap" style={{ color: accent }}>
        {value.replace(/\s*–\s*/, "\u00A0–\u00A0")}
      </span>
    </div>
  );
}
