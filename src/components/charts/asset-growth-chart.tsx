import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { SpotlightCard } from "@/components/spotlight-card";
import { useAssetGrowth } from "@/hooks/use-rewards-data";
import { CountUp } from "@/components/count-up";

const RANGES: { key: 7 | 30 | 90; label: string }[] = [
  { key: 7, label: "7D" },
  { key: 30, label: "30D" },
  { key: 90, label: "90D" },
];

export function AssetGrowthChart() {
  const { t } = useTranslation();
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const { data, hasData } = useAssetGrowth(range);

  const last = data[data.length - 1]?.value ?? 0;
  const first = data[0]?.value ?? 0;
  const delta = last - first;
  const pct = first !== 0 ? (delta / Math.abs(first)) * 100 : 0;

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
              {t("charts.assetGrowth.eyebrow", "Asset Growth")}
            </div>
            <h3 className="mt-1 font-serif text-lg font-semibold text-gold">
              {t("charts.assetGrowth.title", "资产增长趋势")}
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

        <div className="h-48 w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="growth-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.42} />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border) / 0.25)" vertical={false} />
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
                  width={48}
                  tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                  formatter={(v: number) => [`$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, "Total"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--gold)"
                  strokeWidth={2}
                  fill="url(#growth-grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
              {t("charts.empty", "暂无数据")}
            </div>
          )}
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
