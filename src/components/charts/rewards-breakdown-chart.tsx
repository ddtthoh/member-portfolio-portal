import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { SpotlightCard } from "@/components/spotlight-card";
import { useRewardsBreakdown, REWARD_TYPES, REWARD_COLORS, type RewardType } from "@/hooks/use-rewards-data";
import { CountUp } from "@/components/count-up";

export function RewardsBreakdownChart() {
  const { t } = useTranslation();
  const { data } = useRewardsBreakdown();
  const total = data.reduce((s, d) => s + d.value, 0);

  const chartData = data.map((d) => ({
    name: t(`charts.rewardTypes.${d.key}`, d.key),
    key: d.key,
    value: d.value,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <SpotlightCard className="liquid-glass rounded-2xl p-6">
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold/80">
            {t("charts.rewardsBreakdown.eyebrow", "Rewards")}
          </div>
          <h3 className="mt-1 font-serif text-lg font-semibold text-gold">
            {t("charts.rewardsBreakdown.title", "奖励来源对比")}
          </h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <XAxis
                type="number"
                tick={{ fill: "var(--gold)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "var(--gold)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={86}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--accent) / 0.1)" }}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: number) => [`$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, ""]}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {chartData.map((entry) => {
                  const c = REWARD_COLORS[entry.key as RewardType];
                  return (
                    <Cell
                      key={entry.key}
                      fill={c}
                      style={{ filter: `drop-shadow(0 0 6px color-mix(in oklab, ${c} 55%, transparent))` }}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-border/30 pt-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-gold/80">
            {t("charts.rewardsBreakdown.total", "累计奖励")}
          </div>
          <div className="font-light tabular-nums text-gold text-base">
            <CountUp value={total} prefix="$" decimals={2} />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {REWARD_TYPES.map((k) => (
            <div key={k} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: REWARD_COLORS[k], boxShadow: `0 0 8px ${REWARD_COLORS[k]}` }}
              />
              <span className="text-[10px] uppercase tracking-[0.14em] text-gold">
                {t(`charts.rewardTypes.${k}`, k)}
              </span>
            </div>
          ))}
        </div>
