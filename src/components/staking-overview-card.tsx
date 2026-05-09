import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MetricValue } from "@/components/metric-value";
import { CountUp } from "@/components/count-up";
import { SpotlightCard } from "@/components/spotlight-card";

type Props = {
  stakingAmount: number;
  stakingDays: number;
  sinceDate: string; // pre-formatted display string
  tier?: string;
  totalAssets: number;
  usd: number;
  rewards: number;
  staking: number;
};

export function StakingOverviewCard({
  stakingAmount,
  stakingDays,
  sinceDate,
  tier = "Premium",
  totalAssets,
  usd,
  rewards,
  staking,
}: Props) {
  const { t } = useTranslation();
  const [showAmount, setShowAmount] = useState(true);

  const total = Math.max(usd + rewards + staking, 0.0001);
  const usdPct = (usd / total) * 100;
  const rewardsPct = (rewards / total) * 100;
  const stakingPct = (staking / total) * 100;

  const breakdown = [
    {
      key: "usd",
      label: t("components.totalAssets.labels.usd"),
      value: usd,
      pct: usdPct,
      color: "var(--asset-cash)",
    },
    {
      key: "rewards",
      label: t("components.totalAssets.labels.rewardsAsset"),
      value: rewards,
      pct: rewardsPct,
      color: "var(--asset-earnings)",
    },
    {
      key: "staking",
      label: t("components.totalAssets.labels.staking"),
      value: staking,
      pct: stakingPct,
      color: "var(--asset-participation)",
    },
  ];

  return (
    <SpotlightCard className="liquid-glass relative rounded-2xl p-6">
      <button
        type="button"
        onClick={() => setShowAmount((s) => !s)}
        aria-label={showAmount ? t("common.hideAmount") : t("common.showAmount")}
        className="absolute right-4 top-4 text-gold transition-colors hover:text-gold/80"
      >
        {showAmount ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>

      {/* Top layer: Total Staking | Total Assets */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1.3fr_auto_1fr] sm:items-center sm:gap-0">
        {/* Left — main */}
        <div className="min-w-0 sm:pr-8">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold">
            {t("pages.holdings.totalStaking")}
          </div>
          <div className="mt-2">
            {showAmount ? (
              <MetricValue value={stakingAmount} prefix="$" decimals={0} size="xl" />
            ) : (
              <span className="text-4xl font-light tabular-nums tracking-[-0.04em] text-gold sm:text-6xl">
                ******
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] tracking-[0.08em] text-muted-foreground">
            <span className="tabular-nums text-gold/90">
              {stakingDays} {t("pages.holdings.daysUnit")}
            </span>
            <span className="mx-2 text-muted-foreground/50">·</span>
            <span>{t("pages.holdings.since", { date: sinceDate })}</span>
          </div>
        </div>

        {/* Connect line — vertical on desktop, horizontal on mobile */}
        <div
          aria-hidden
          className="hidden h-16 w-px self-center sm:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--gold) 45%, transparent) 50%, transparent 100%)",
          }}
        >
          <span className="relative -left-[3px] top-[28px] block h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]" />
        </div>
        <div
          aria-hidden
          className="relative h-px w-full sm:hidden"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, color-mix(in oklab, var(--gold) 45%, transparent) 50%, transparent 100%)",
          }}
        >
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]" />
        </div>

        {/* Right — secondary */}
        <div className="min-w-0 sm:pl-8 sm:text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold">
            {t("pages.holdings.totalAssets")}
          </div>
          <div className="mt-2">
            {showAmount ? (
              <MetricValue value={totalAssets} prefix="$" decimals={2} size="lg" />
            ) : (
              <span className="text-2xl font-light tabular-nums tracking-[-0.04em] text-gold sm:text-3xl">
                ******
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-6 h-px w-full bg-border/40" />

      {/* Bottom layer: 3-asset breakdown */}
      <div className="mt-5">
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {breakdown.map((row) => (
            <div key={row.key} className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: row.color, boxShadow: `0 0 6px ${row.color}` }}
                />
                <span className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {row.label}
                </span>
              </div>
              <div
                className="mt-1.5 text-base font-light tabular-nums tracking-[-0.02em] sm:text-lg"
                style={{ color: row.color }}
              >
                {showAmount ? (
                  <CountUp value={row.value} prefix="$" decimals={2} />
                ) : (
                  <span>******</span>
                )}
              </div>
              <div className="text-[10px] tabular-nums text-muted-foreground/70">
                <CountUp value={row.pct} decimals={2} suffix="%" />
              </div>
            </div>
          ))}
        </div>

        {/* Flat 3-segment bar — the asset-analysis gauge, flattened */}
        <div className="mt-4 flex h-1 w-full overflow-hidden rounded-full bg-border/30">
          {breakdown.map((row) => (
            <div
              key={row.key}
              style={{
                width: `${row.pct}%`,
                background: row.color,
                boxShadow: `0 0 8px ${row.color}`,
              }}
              className="h-full transition-[width] duration-700 ease-out"
            />
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}
