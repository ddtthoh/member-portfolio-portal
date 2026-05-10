import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  LabelList,
} from "recharts";
import { SpotlightCard } from "@/components/spotlight-card";
import {
  useRewardsBreakdown,
  REWARD_TYPES,
  REWARD_COLORS,
  type RewardType,
} from "@/hooks/use-rewards-data";
import { CountUp } from "@/components/count-up";

export function RewardsBreakdownChart() {
  const { t } = useTranslation();
  const { data } = useRewardsBreakdown();
  const total = data.reduce((s, d) => s + d.value, 0);

  // 0 → 1 ramp on mount, matches Recharts bar animation
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    setProgress(0);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current != null) cancelAnimationFrame(raf.current); };
  }, [data.length]);

  // Sort bars by value (largest at top) for stronger visual hierarchy.
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  const chartData = sortedData.map((d, i) => ({
    name: t(`charts.rewardTypes.${d.key}`, d.key).toUpperCase(),
    key: d.key,
    value: d.value,
    rank: i + 1,
  }));

  const renderTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof chartData[number] }> }) => {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload;
    const pct = total > 0 ? (row.value / total) * 100 : 0;
    const color = REWARD_COLORS[row.key];
    const rankLabel =
      row.rank === 1
        ? t("charts.rewardsBreakdown.highest", "Highest")
        : `#${row.rank} ${t("common.of", "of")} ${chartData.length}`;
    return (
      <div
        className="liquid-glass rounded-lg border border-border/60 px-3 py-2.5 text-xs shadow-xl"
        style={{ minWidth: 160 }}
      >
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          />
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {row.name}
          </span>
        </div>
        <div
          className="mt-1.5 text-base font-light tabular-nums tracking-[-0.02em]"
          style={{ color }}
        >
          ${row.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-4 text-[10px] tabular-nums text-muted-foreground/80">
          <span>{pct.toFixed(2)}%</span>
          <span className="uppercase tracking-[0.14em] text-gold/70">{rankLabel}</span>
        </div>
      </div>
    );
  };

  const renderValueLabel = (props: { x?: number; y?: number; width?: number; height?: number; value?: number; index?: number }) => {
    const { x = 0, y = 0, width = 0, height = 0, value = 0, index = 0 } = props;
    const key = chartData[index]?.key as RewardType | undefined;
    const color = key ? REWARD_COLORS[key] : "var(--gold)";
    const animatedValue = (Number(value) || 0) * progress;
    const animatedWidth = width * progress;
    return (
      <text
        x={x + animatedWidth + 6}
        y={y + height / 2}
        dy={3}
        fontSize={10}
        fontWeight={300}
        fill={color}
        style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}
      >
        ${Math.round(animatedValue).toLocaleString()}
      </text>
    );
  };

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
            {t("charts.rewardsBreakdown.title", "Rewards Breakdown")}
          </h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 56, left: 0, bottom: 0 }}
              barCategoryGap="45%"
            >
              <defs>
                {chartData.map((entry) => {
                  const c = REWARD_COLORS[entry.key];
                  return (
                    <linearGradient
                      key={entry.key}
                      id={`grad-rewards-${entry.key}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor={`color-mix(in oklab, ${c} 60%, transparent)`}
                      />
                      <stop offset="100%" stopColor={c} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid
                horizontal={false}
                stroke="hsl(var(--border))"
                strokeOpacity={0.12}
                strokeDasharray="2 4"
              />
              <XAxis
                type="number"
                tick={{ fill: "var(--gold)", fontSize: 9, opacity: 0.6 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "var(--gold)", fontSize: 10, opacity: 0.75, letterSpacing: "0.08em" }}
                axisLine={false}
                tickLine={false}
                width={92}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--accent) / 0.08)" }}
                content={renderTooltip as never}
              />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                barSize={10}
                isAnimationActive
                animationDuration={1100}
                animationEasing="ease-out"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={`url(#grad-rewards-${entry.key})`}
                    style={{
                      filter: `drop-shadow(0 0 6px color-mix(in oklab, ${REWARD_COLORS[entry.key]} 50%, transparent))`,
                    }}
                  />
                ))}
                <LabelList dataKey="value" content={renderValueLabel as never} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-5 w-full divide-y divide-border/40 border-t border-border/40">
          {REWARD_TYPES.map((k) => {
            const row = data.find((d) => d.key === k);
            const amount = row?.value ?? 0;
            const pct = total > 0 ? (amount / total) * 100 : 0;
            const color = REWARD_COLORS[k];
            return (
              <div key={k} className="flex items-center justify-between py-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.18em] text-gold/80">
                    {t(`charts.rewardTypes.${k}`, k)}
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-xs font-light tabular-nums tracking-[-0.02em]"
                    style={{ color }}
                  >
                    <CountUp value={amount} prefix="$" decimals={2} />
                  </span>
                  <span className="w-14 text-right text-[10px] tabular-nums text-muted-foreground/70">
                    <CountUp value={pct} decimals={2} suffix="%" />
                  </span>
                </div>
              </div>
            );
          })}
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

// maxValue is currently informational — LabelList auto-handles overflow with margin.right.
void 0;
