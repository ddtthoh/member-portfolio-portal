import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CountUp } from "@/components/count-up";
import { SpotlightCard } from "@/components/spotlight-card";

type Props = {
  stakingAmount: number;
  stakingDays: number;
  sinceDate: string;
  tier?: string;
  totalAssets: number;
  usd: number;
  rewards: number;
  staking: number;
  certificateNo?: string;
};

/**
 * Editorial Certificate — designed as a private-bank vault certificate.
 * Hierarchy is built from typography + whitespace, not color blocks or bars.
 */
export function StakingOverviewCard({
  stakingAmount,
  stakingDays,
  sinceDate,
  tier = "Premium",
  totalAssets,
  usd,
  rewards,
  staking,
  certificateNo = "0001",
}: Props) {
  const { t } = useTranslation();
  const [showAmount, setShowAmount] = useState(true);

  const breakdown = [
    { key: "totalAssets", label: t("pages.holdings.totalAssets"), value: totalAssets, accent: true },
    { key: "usd", label: t("components.totalAssets.labels.usd"), value: usd },
    { key: "rewards", label: t("components.totalAssets.labels.rewardsAsset"), value: rewards },
    { key: "staking", label: t("components.totalAssets.labels.staking"), value: staking },
  ];

  const masked = "$ ∗ ∗ ∗ ∗ ∗";

  return (
    <SpotlightCard className="liquid-glass relative overflow-hidden rounded-2xl">
      {/* Corner gold brackets — certificate flourish */}
      <CornerBracket className="left-3 top-3" position="tl" />
      <CornerBracket className="right-3 top-3" position="tr" />
      <CornerBracket className="left-3 bottom-3" position="bl" />
      <CornerBracket className="right-3 bottom-3" position="br" />

      <div className="relative px-6 py-10 sm:px-12 sm:py-14">
        {/* Header strip */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.32em] text-gold/70">
            <span className="h-px w-6 bg-gold/40" />
            <span>{t("pages.holdings.certificate")}</span>
            <span className="text-muted-foreground/60">·</span>
            <span className="tabular-nums text-muted-foreground/80">
              {t("pages.holdings.certificateNo", { no: certificateNo })}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAmount((s) => !s)}
            aria-label={showAmount ? t("common.hideAmount") : t("common.showAmount")}
            className="text-gold/60 transition-colors hover:text-gold"
          >
            {showAmount ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Hero — Total Staking, centered editorial */}
        <div className="mt-10 text-center sm:mt-14">
          <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            {t("pages.holdings.totalStaking")}
          </div>
          <div className="mt-5 flex items-baseline justify-center">
            {showAmount ? (
              <span className="font-serif text-5xl font-light tabular-nums tracking-[-0.03em] text-gold sm:text-7xl">
                <CountUp value={stakingAmount} prefix="$" decimals={0} />
              </span>
            ) : (
              <span className="font-serif text-5xl font-light tracking-[-0.03em] text-gold sm:text-7xl">
                {masked}
              </span>
            )}
          </div>
        </div>

        {/* Hairline meta row — date · days · tier */}
        <div className="mt-10 flex items-center gap-4 sm:mt-14">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-gold/30" />
          <div className="flex items-center gap-3 whitespace-nowrap text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span>{t("pages.holdings.since", { date: sinceDate })}</span>
            <span className="text-gold/40">◆</span>
            <span className="tabular-nums text-gold">
              {stakingDays} <span className="text-muted-foreground">{t("pages.holdings.daysUnitUpper")}</span>
            </span>
            <span className="text-gold/40">◆</span>
            <span>{t("pages.holdings.tierSuffix", { tier })}</span>
          </div>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/30 to-gold/30" />
        </div>

        {/* Statement-style breakdown — 4 columns, no color blocks */}
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:mt-12 sm:grid-cols-4 sm:gap-x-10">
          {breakdown.map((row) => (
            <div key={row.key} className="min-w-0">
              <div className="text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                {row.label}
              </div>
              <div
                className={`mt-2 font-serif font-light tabular-nums tracking-[-0.02em] ${
                  row.accent ? "text-2xl text-gold sm:text-3xl" : "text-xl text-foreground/90 sm:text-2xl"
                }`}
              >
                {showAmount ? (
                  <CountUp value={row.value} prefix="$" decimals={2} />
                ) : (
                  <span>{masked}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}

function CornerBracket({
  className = "",
  position,
}: {
  className?: string;
  position: "tl" | "tr" | "bl" | "br";
}) {
  const borders: Record<typeof position, string> = {
    tl: "border-l border-t",
    tr: "border-r border-t",
    bl: "border-l border-b",
    br: "border-r border-b",
  };
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-3 w-3 border-gold/40 ${borders[position]} ${className}`}
    />
  );
}
