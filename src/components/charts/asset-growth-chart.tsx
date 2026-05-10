import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { SpotlightCard } from "@/components/spotlight-card";
import {
  useRewardsCumulative,
  REWARD_TYPES,
  REWARD_COLORS,
  type RewardType,
} from "@/hooks/use-rewards-data";
import { CountUp } from "@/components/count-up";

const RANGES: { key: 7 | 30 | 90; label: string }[] = [
  { key: 7, label: "7D" },
  { key: 30, label: "30D" },
  { key: 90, label: "90D" },
];

export function AssetGrowthChart() {
  const { t } = useTranslation();
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const { data, hasData } = useRewardsCumulative(range);

  const last = data[data.length - 1]?.total ?? 0;
  const first = data[0]?.total ?? 0;
  const delta = last - first;
  const pct = first !== 0 ? (delta / Math.abs(first)) * 100 : 0;

  const renderTooltip = ({ active, payload, label }: {
    active?: boolean;
    label?: string;
    payload?: Array<{ dataKey: string; value: number; color: string }>;
  }) => {
    if (!active || !payload?.length) return null;
    const total = payload.reduce((s, p) => s + (Number(p.value) || 0), 0);
    // Recharts payload comes in stack order (bottom-first). Show top-first for readability.
    const ordered = [...payload].reverse();
    return (
      <div className="liquid-glass rounded-lg border border-border/60 px-3 py-2.5 text-xs shadow-xl" style={{ minWidth: 180 }}>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        <div className="mt-1.5 space-y-1">
          {ordered.map((p) => {
            const k = p.dataKey as RewardType;
            const color = REWARD_COLORS[k];
            return (
              <div key={k} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/90">
                    {t(`charts.rewardTypes.${k}`, k)}
                  </span>
                </div>
                <span className="tabular-nums" style={{ color }}>
                  ${Number(p.value).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-1.5">
          <span className="text-[10px] uppercase tracking-[0.18em] text-gold/80">
            {t("charts.assetGrowth.current", "当前累计")}
          </span>
          <span className="tabular-nums text-gold">
            ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="mb-4"
    >
      <SpotlightCard className="liquid-glass rounded-2xl p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-gold/80">
              {t("charts.assetGrowth.eyebrow", "Rewards Growth")}
            </div>
            <h3 className="mt-1 font-serif text-lg font-semibold text-gold">
              {t("charts.assetGrowth.title", "奖励累计趋势")}
            </h3>
          </div>
          <div className="flex gap-1 rounded-full border border-border/40 bg-background/40 p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] transition-colors ${
                  range === r.key ? "bg-gold/20 text-gold" : "text-muted-foreground hover:text-gold"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-56 w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  {REWARD_TYPES.map((k) => {
                    const c = REWARD_COLORS[k];
                    return (
                      <linearGradient key={k} id={`grad-cum-${k}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={c} stopOpacity={0.55} />
                        <stop offset="100%" stopColor={c} stopOpacity={0.05} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid stroke="hsl(var(--border) / 0.2)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  tickFormatter={(v) => v.slice(5)}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                  tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                />
                <Tooltip content={renderTooltip as never} />
                {REWARD_TYPES.map((k) => (
                  <Area
                    key={k}
                    type="monotone"
                    dataKey={k}
                    stackId="1"
                    stroke={REWARD_COLORS[k]}
                    strokeWidth={1.25}
                    fill={`url(#grad-cum-${k})`}
                    isAnimationActive
                    animationDuration={900}
                    animationEasing="ease-out"
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
              {t("charts.empty", "暂无数据")}
            </div>
          )}
        </div>

        {/* legend */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {REWARD_TYPES.map((k) => {
            const c = REWARD_COLORS[k];
            return (
              <div key={k} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
                <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  {t(`charts.rewardTypes.${k}`, k)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-border/30 pt-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {t("charts.assetGrowth.current", "当前累计")}
          </div>
          <div className="text-right">
            <div className="font-light tabular-nums text-gold text-base">
              <CountUp value={last} prefix="$" decimals={2} />
            </div>
            <div className={`text-[10px] tabular-nums ${delta >= 0 ? "text-success" : "text-destructive"}`}>
              {delta >= 0 ? "+" : ""}
              {pct.toFixed(2)}%
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
