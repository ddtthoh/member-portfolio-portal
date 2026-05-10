import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SpotlightCard } from "@/components/spotlight-card";
import {
  useRewardsBreakdown,
  REWARD_TYPES,
  REWARD_COLORS,
} from "@/hooks/use-rewards-data";
import { CountUp } from "@/components/count-up";

export function RewardsBreakdownChart() {
  const { t } = useTranslation();
  const { data } = useRewardsBreakdown();
  const total = data.reduce((s, d) => s + d.value, 0);
  const max = Math.max(1, ...data.map((d) => d.value));
  const chartData = REWARD_TYPES.map((key, i) => {
    const row = data.find((d) => d.key === key);
    const value = row?.value ?? 0;
    return {
      key,
      value,
      pct: total > 0 ? (value / total) * 100 : 0,
      rank: i + 1,
      width: `${Math.max(4, (value / max) * 100)}%`,
      color: REWARD_COLORS[key],
      label: t(`charts.rewardTypes.${key}`, key).toUpperCase(),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <SpotlightCard className="liquid-glass rounded-2xl p-6">
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold/80">
            {t("charts.rewardsBreakdown.eyebrow", "Rewards")}
          </div>
          <h3 className="mt-1 font-serif text-lg font-semibold text-gold">
            {t("charts.rewardsBreakdown.title", "Rewards Breakdown")}
          </h3>
        </div>

        <div className="space-y-4 py-2">
          {chartData.map((row) => (
            <div key={row.key} className="grid grid-cols-[92px_minmax(0,1fr)_72px] items-center gap-3">
              <div className="truncate text-right text-[10px] uppercase tracking-[0.14em] text-gold/75">
                {row.label}
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-muted/35">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: row.width,
                    background: `linear-gradient(90deg, color-mix(in oklab, ${row.color} 58%, transparent), ${row.color})`,
                    boxShadow: `0 0 8px color-mix(in oklab, ${row.color} 42%, transparent)`,
                  }}
                />
              </div>
              <div className="text-right text-[10px] font-light tabular-nums" style={{ color: row.color }}>
                ${Math.round(row.value).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 w-full divide-y divide-border/40 border-t border-border/40">
          {chartData.map((row) => (
            <div key={row.key} className="flex items-center justify-between py-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: row.color }} />
                <span className="text-[10px] uppercase tracking-[0.18em] text-gold/80">
                  {t(`charts.rewardTypes.${row.key}`, row.key)}
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-light tabular-nums" style={{ color: row.color }}>
                  <CountUp value={row.value} prefix="$" decimals={2} />
                </span>
                <span className="w-14 text-right text-[10px] tabular-nums text-muted-foreground/70">
                  <CountUp value={row.pct} decimals={2} suffix="%" />
                </span>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-[11px] uppercase tracking-[0.18em] text-gold/80">
              {t("charts.rewardsBreakdown.total", "Total Rewards")}
            </span>
            <span className="text-sm font-light tabular-nums text-gold">
              <CountUp value={total} prefix="$" decimals={2} />
            </span>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
