import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SpotlightCard } from "@/components/spotlight-card";
import {
  useRewardsCumulative,
  REWARD_TYPES,
  REWARD_COLORS,
  type RewardType,
} from "@/hooks/use-rewards-data";
import { useWallet } from "@/hooks/use-wallet";

const RANGES: { key: 7 | 30 | 90; label: string }[] = [
  { key: 7, label: "7D" },
  { key: 30, label: "30D" },
  { key: 90, label: "90D" },
];

const fmtMoney = (n: number) =>
  `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

function makePath(values: number[], width: number, height: number) {
  if (!values.length) return "";
  const max = Math.max(1, ...values);
  return values
    .map((value, i) => {
      const x = values.length === 1 ? 0 : (i / (values.length - 1)) * width;
      const y = height - (Math.max(0, value) / max) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function makeAreaPath(values: number[], width: number, height: number) {
  const line = makePath(values, width, height);
  return line ? `${line} L ${width} ${height} L 0 ${height} Z` : "";
}

export function AssetGrowthChart() {
  const { t } = useTranslation();
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const { data, hasData } = useRewardsCumulative(range);
  const { wallet } = useWallet();

  const stakingBase = wallet.staking || 0;
  const hasBase = stakingBase > 0;
  const roi = (v: number) => (hasBase ? (v / stakingBase) * 100 : 0);
  const roiLabel = (v: number) =>
    hasBase ? `${v >= 0 ? "+" : ""}${roi(v).toFixed(2)}%` : "—";

  const lastPoint = data[data.length - 1];
  const lastTotal = lastPoint?.total ?? 0;
  const values = useMemo(() => data.map((d) => Number(d.total) || 0), [data]);
  const width = 640;
  const height = 180;
  const linePath = useMemo(() => makePath(values, width, height), [values]);
  const areaPath = useMemo(() => makeAreaPath(values, width, height), [values]);
  const maxValue = Math.max(1, ...values);
  const lastX = values.length <= 1 ? 0 : width;
  const lastY = height - (lastTotal / maxValue) * height;

  const typeShare: Record<RewardType, number> = {
    staking: 0, referral: 0, team: 0, leader: 0, global: 0, par_rank: 0,
  };
  REWARD_TYPES.forEach((k) => {
    typeShare[k] = lastPoint ? (Number(lastPoint[k]) || 0) : 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
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

        <div className="h-52 w-full">
          {hasData ? (
            <svg viewBox={`0 0 ${width + 130} ${height + 36}`} className="h-full w-full overflow-visible" role="img">
              <defs>
                <linearGradient id="asset-growth-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                <line
                  key={p}
                  x1="0"
                  x2={width}
                  y1={height * p}
                  y2={height * p}
                  stroke="hsl(var(--border))"
                  strokeOpacity="0.18"
                  strokeDasharray="2 5"
                />
              ))}
              <path d={areaPath} fill="url(#asset-growth-fill)" />
              <path d={linePath} fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={lastX} cy={lastY} r="3.5" fill="var(--gold)" />
              <text x={lastX + 12} y={lastY + 4} fontSize="10" fontWeight="600" fill="var(--gold)" style={{ fontVariantNumeric: "tabular-nums" }}>
                {fmtMoney(lastTotal)}  {roiLabel(lastTotal)}
              </text>
              {data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 5)) === 0).map((d, i, arr) => {
                const dataIndex = data.indexOf(d);
                const x = data.length === 1 ? 0 : (dataIndex / (data.length - 1)) * width;
                return (
                  <text key={`${d.date}-${i}`} x={x} y={height + 24} textAnchor={i === arr.length - 1 ? "end" : "middle"} fontSize="10" fill="var(--gold)" opacity="0.72">
                    {d.date.slice(5)}
                  </text>
                );
              })}
            </svg>
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
              {t("charts.empty", "暂无数据")}
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {REWARD_TYPES.map((k) => {
            const c = REWARD_COLORS[k];
            const v = typeShare[k];
            const miniValues = data.map((d) => Number(d[k]) || 0);
            const miniPath = makePath(miniValues, 120, 28);
            const miniArea = makeAreaPath(miniValues, 120, 28);
            const gradId = `mini-grad-${k}`;
            return (
              <div
                key={k}
                className="group relative overflow-hidden rounded-xl border border-border/40 bg-background/30 p-3 transition-colors hover:border-[color:var(--c)] hover:bg-background/50"
                style={{ ["--c" as never]: c }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
                    <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground/85">
                      {t(`charts.rewardTypes.${k}`, k)}
                    </span>
                  </div>
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] tabular-nums"
                    style={{
                      color: c,
                      background: `color-mix(in oklab, ${c} 12%, transparent)`,
                      border: `1px solid color-mix(in oklab, ${c} 35%, transparent)`,
                    }}
                  >
                    {hasBase ? `${roi(v).toFixed(2)}%` : "—"}
                  </span>
                </div>
                <div className="mt-1 font-light tabular-nums" style={{ color: c, fontSize: 16 }}>
                  {fmtMoney(v)}
                </div>
                <svg viewBox="0 0 120 28" className="mt-1 h-7 w-full" aria-hidden>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c} stopOpacity="0.45" />
                      <stop offset="100%" stopColor={c} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={miniArea} fill={`url(#${gradId})`} />
                  <path d={miniPath} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            );
          })}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
