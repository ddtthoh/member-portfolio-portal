import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MetricValue } from "@/components/metric-value";
import { SpotlightCard } from "@/components/spotlight-card";

type Props = {
  amount: number;
  days: number;
  startDate: string; // ISO yyyy-mm-dd
  tier: string;
};

function formatDate(iso: string, locale: string) {
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function StakingSummaryCard({ amount, days, startDate, tier }: Props) {
  const { t, i18n } = useTranslation();
  const [showAmount, setShowAmount] = useState(true);

  return (
    <SpotlightCard className="liquid-glass rounded-2xl p-6">
      {/* Eyebrow + eye toggle */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.2em] text-gold">
          {t("pages.holdings.totalStaking")}
        </div>
        <button
          type="button"
          onClick={() => setShowAmount((s) => !s)}
          aria-label={showAmount ? t("common.hideAmount") : t("common.showAmount")}
          className="text-gold transition-colors hover:text-gold/80"
        >
          {showAmount ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {/* Main row: amount · connector · days */}
      <div className="mt-5 grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div className="text-left">
          {showAmount ? (
            <MetricValue value={amount} prefix="$" decimals={2} size="xl" />
          ) : (
            <span className="text-4xl font-light tabular-nums tracking-[-0.04em] text-gold sm:text-6xl">
              ******
            </span>
          )}
        </div>

        {/* Connector — only on >=sm */}
        <div className="hidden items-center sm:flex">
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-gold/40 to-gold/40" />
          <span className="mx-1 h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px] shadow-gold/50" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent via-gold/40 to-gold/40" />
        </div>

        <div className="text-left sm:text-right">
          <MetricValue value={days} decimals={0} size="lg" unit={t("pages.holdings.daysUnit")} />
        </div>
      </div>

      {/* Sub line */}
      <div className="mt-5 flex flex-col gap-1 border-t border-gold/10 pt-3 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          {t("pages.holdings.since", { date: formatDate(startDate, i18n.language) })}
        </span>
        <span>
          {t("pages.holdings.accruing")} ·{" "}
          <span className="text-gold/80">
            {t("pages.holdings.tierLabel", { tier })}
          </span>
        </span>
      </div>
    </SpotlightCard>
  );
}
