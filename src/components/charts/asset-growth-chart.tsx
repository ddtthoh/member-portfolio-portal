import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  AreaChart,
  Area,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { SpotlightCard } from "@/components/spotlight-card";
import {
  useRewardsCumulative,
  REWARD_TYPES,
  REWARD_COLORS,
  type RewardType,
} from "@/hooks/use-rewards-data";
import { useWallet } from "@/hooks/use-wallet";
import { useInViewOnce } from "@/hooks/use-in-view-once";

const RANGES: { key: 7 | 30 | 90; label: string }[] = [
  { key: 7, label: "7D" },
  { key: 30, label: "30D" },
  { key: 90, label: "90D" },
];

const fmtMoney = (n: number) =>
  `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

// 0 → 1 ramp triggered when `enabled` is true; restarts whenever `key` changes.
function useCountProgress(key: unknown, enabled: boolean, duration = 2200) {
  const [p, setP] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!enabled) {
      setP(0);
      return;
    }
    setP(0);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setP(eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [key, duration, enabled]);
  return p;
}

export function AssetGrowthChart() {
  const { t } = useTranslation();
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const { data, hasData } = useRewardsCumulative(range);
  const { wallet } = useWallet();
  const { ref: viewRef, inView } = useInViewOnce<HTMLDivElement>({ amount: 0.2 });
  const progress = useCountProgress(`${range}-${data.length}`, inView);

  const stakingBase = wallet.staking || 0;
  const hasBase = stakingBase > 0;
  const roi = (v: number) => (hasBase ? (v / stakingBase) * 100 : 0);
  const roiLabel = (v: number) =>
    hasBase ? `${v >= 0 ? "+" : ""}${roi(v).toFixed(2)}%` : "—";

  const lastPoint = data[data.length - 1];
  const lastTotal = lastPoint?.total ?? 0;

  const typeShare: Record<RewardType, number> = {
    staking: 0, referral: 0, team: 0, leader: 0, global: 0, par_rank: 0,
  };
  REWARD_TYPES.forEach((k) => {
    typeShare[k] = lastPoint ? (Number(lastPoint[k]) || 0) : 0;
  });

  // ---------- Main tooltip (Total) ----------
  const renderTooltip = ({ active, payload, label }: {
    active?: boolean;
    label?: string;
    payload?: Array<{ dataKey: string; value: number }>;
  }) => {
    if (!active || !payload?.length) return null;
    const totalRow = payload.find((p) => p.dataKey === "total");
    const total = Number(totalRow?.value) || 0;
    return (
      <div className="liquid-glass rounded-lg border border-border/60 px-3 py-2 text-xs shadow-xl" style={{ minWidth: 180 }}>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <span className="text-[10px] uppercase tracking-[0.18em] text-gold/80">
            {t("charts.assetGrowth.totalRoi", "Total")}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="tabular-nums text-gold">{fmtMoney(total)}</span>
            <span className="w-14 text-right text-[10px] tabular-nums text-gold/80">
              {roiLabel(total)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ---------- Total line end-point pulse ----------
  const renderTotalDot = (props: { cx?: number; cy?: number; index?: number }) => {
    const { cx = 0, cy = 0, index = 0 } = props;
    if (index !== data.length - 1) return <g key={`td-${index}`} />;
    return (
      <g key={`td-${index}`}>
        <circle cx={cx} cy={cy} r={4} fill="var(--gold)" opacity={0.35}>
          <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.45;0;0.45" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={cx} cy={cy} r={3.5} fill="var(--gold)"
          style={{ filter: "drop-shadow(0 0 6px var(--gold))" }} />
      </g>
    );
  };

  const renderTotalEndLabel = (props: { x?: number; y?: number; index?: number; value?: number }) => {
    const { x = 0, y = 0, index = 0, value = 0 } = props;
    if (index !== data.length - 1) return null;
    const v = (Number(value) || 0) * progress;
    const text = `${fmtMoney(v)}  ${roiLabel(v)}`;
    const padX = 6;
    const charW = 5.6;
    const w = Math.max(80, text.length * charW + padX * 2);
    const h = 16;
    return (
      <g>
        <rect
          x={x + 10} y={y - h / 2} rx={8} ry={8} width={w} height={h}
          fill="color-mix(in oklab, var(--gold) 18%, transparent)"
          stroke="color-mix(in oklab, var(--gold) 60%, transparent)"
          strokeWidth={1}
          style={{ filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--gold) 50%, transparent))" }}
        />
        <text
          x={x + 10 + padX} y={y} dy={3.5}
          fontSize={10} fontWeight={600} fill="var(--gold)"
          style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}
        >
          {text}
        </text>
      </g>
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

        {/* ===== Main chart: Total only ===== */}
        <div className="h-52 w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 12, right: 110, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad-total" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border) / 0.2)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--gold)", fontSize: 10, opacity: 0.75 }}
                  tickFormatter={(v) => v.slice(5)}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  tick={{ fill: "var(--gold)", fontSize: 10, opacity: 0.75 }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                  tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                />
                <Tooltip content={renderTooltip as never} cursor={{ stroke: "var(--gold)", strokeOpacity: 0.3, strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="none"
                  fill="url(#grad-total)"
                  isAnimationActive
                  animationDuration={1100}
                  animationEasing="ease-out"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="var(--gold)"
                  strokeWidth={2.5}
                  dot={renderTotalDot as never}
                  activeDot={{ r: 4, fill: "var(--gold)" }}
                  isAnimationActive
                  animationDuration={1100}
                  animationEasing="ease-out"
                  className="gold-line-breathe"
                >
                  <LabelList dataKey="total" content={renderTotalEndLabel as never} />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
              {t("charts.empty", "暂无数据")}
            </div>
          )}
        </div>

        {/* ===== 6 reward sparkline cards ===== */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {REWARD_TYPES.map((k) => {
            const c = REWARD_COLORS[k];
            const v = typeShare[k];
            const gradId = `mini-grad-${k}`;
            return (
              <div
                key={k}
                className="group relative overflow-hidden rounded-xl border border-border/40 bg-background/30 p-3 transition-all hover:border-[color:var(--c)] hover:bg-background/50"
                style={{ ["--c" as never]: c }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: c, boxShadow: `0 0 6px ${c}` }}
                    />
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
                    {hasBase ? `${(roi(v) * progress).toFixed(2)}%` : "—"}
                  </span>
                </div>
                <div className="mt-1 font-light tabular-nums" style={{ color: c, fontSize: 16 }}>
                  {fmtMoney(v * progress)}
                </div>
                <div className="mt-1 h-7 w-full">
                  {hasData && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={c} stopOpacity={0.5} />
                            <stop offset="100%" stopColor={c} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey={k}
                          stroke={c}
                          strokeWidth={1.5}
                          fill={`url(#${gradId})`}
                          isAnimationActive
                          animationDuration={1100}
                          animationEasing="ease-out"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
