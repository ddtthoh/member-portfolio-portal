import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CountUp } from "@/components/count-up";
import { SpotlightCard } from "@/components/spotlight-card";

type Props = {
  totalAssets: number;
  usd: number;
  rewards: number;
  staking: number;
  stakingDays: number;
  sinceDate: string;
  tier?: string;
};

const MASK = "••••••";

export function StakingOverviewCard({
  totalAssets,
  usd,
  rewards,
  staking,
  stakingDays,
  sinceDate,
  tier = "Premium",
}: Props) {
  const { t } = useTranslation();
  const [showAmount, setShowAmount] = useState(true);

  const total = Math.max(usd + rewards + staking, 0.0001);
  const cols = [
    {
      key: "staking",
      label: t("components.totalAssets.labels.staking"),
      value: staking,
      pct: (staking / total) * 100,
      sub: `${stakingDays} ${t("pages.holdings.daysUnit")} · ${t("pages.holdings.since", { date: sinceDate })}`,
    },
    {
      key: "usd",
      label: t("components.totalAssets.labels.usd"),
      value: usd,
      pct: (usd / total) * 100,
      sub: "—",
    },
    {
      key: "rewards",
      label: t("components.totalAssets.labels.rewardsAsset"),
      value: rewards,
      pct: (rewards / total) * 100,
      sub: "—",
    },
  ];

  return (
    <SpotlightCard className="liquid-glass relative rounded-2xl px-6 py-8 sm:px-10 sm:py-10">
      <button
        type="button"
        onClick={() => setShowAmount((s) => !s)}
        aria-label={showAmount ? t("common.hideAmount") : t("common.showAmount")}
        className="absolute right-5 top-5 text-gold/70 transition-colors hover:text-gold"
      >
        {showAmount ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>

      {/* Header label */}
      <div className="text-[10px] uppercase tracking-[0.22em] text-gold/80">
        {t("pages.holdings.portfolioLabel")}
      </div>

      {/* Hero number */}
      <div className="mt-4 font-light tabular-nums tracking-[-0.04em] text-gold text-5xl sm:text-7xl">
        {showAmount ? (
          <CountUp value={totalAssets} prefix="$" decimals={2} />
        ) : (
          <span>{MASK}</span>
        )}
      </div>

      {/* Proportion hairline (replaces decorative gold line) */}
      <div
        aria-hidden
        className="mt-5 flex h-px w-40 overflow-hidden rounded-none bg-border/30 sm:w-48"
      >
        <div className="h-full bg-gold/80" style={{ width: `${(staking / total) * 100}%` }} />
        <div className="h-full bg-gold/40" style={{ width: `${(usd / total) * 100}%` }} />
        <div className="h-full bg-gold/20" style={{ width: `${(rewards / total) * 100}%` }} />
      </div>

      {/* Sub label */}
      <div className="mt-3 text-[11px] tracking-[0.08em] text-muted-foreground">
        {t("pages.holdings.tierSuffix", { tier })}
      </div>

      {/* Footnote breakdown */}
      <div className="mt-8 border-t border-border/40 pt-5 sm:mt-10 sm:pt-6">
        <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0">
          {cols.map((c) => (
            <div
              key={c.key}
              className="flex items-baseline justify-between sm:block"
            >
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {c.label}
              </div>
              <div className="text-right sm:text-left">
                <div className="font-light tabular-nums tracking-[-0.02em] text-gold text-lg sm:mt-1.5 sm:text-xl">
                  {showAmount ? (
                    <CountUp value={c.value} prefix="$" decimals={2} />
                  ) : (
                    <span>{MASK}</span>
                  )}
                </div>
                <div className="mt-0.5 text-[10px] tabular-nums text-muted-foreground/70">
                  <CountUp value={c.pct} decimals={2} suffix="%" />
                </div>
                {c.sub && (
                  <div className="mt-0.5 text-[10px] tracking-[0.04em] text-muted-foreground/60">
                    {c.sub}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}
