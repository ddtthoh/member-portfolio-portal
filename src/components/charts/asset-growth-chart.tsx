import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ComposedChart,
  Area,
  Line,
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
import { CountUp } from "@/components/count-up";

const RANGES: { key: 7 | 30 | 90; label: string }[] = [
  { key: 7, label: "7D" },
  { key: 30, label: "30D" },
  { key: 90, label: "90D" },
];

const fmtMoney = (n: number) =>
  `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

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

  // Type ROI shares (for legend + label hiding rule)
  const typeShare: Record<RewardType, number> = {
    staking: 0, referral: 0, team: 0, leader: 0, global: 0, par_rank: 0,
  };
  REWARD_TYPES.forEach((k) => {
    typeShare[k] = lastPoint ? (Number(lastPoint[k]) || 0) : 0;
  });

  // ---------- Tooltip ----------
  const renderTooltip = ({ active, payload, label }: {
    active?: boolean;
    label?: string;
    payload?: Array<{ dataKey: string; value: number }>;
  }) => {
    if (!active || !payload?.length) return null;
    const areaRows = payload.filter((p) => p.dataKey !== "total");
    const total = areaRows.reduce((s, p) => s + (Number(p.value) || 0), 0);
    const ordered = [...areaRows].reverse();
    return (
      <div className="liquid-glass rounded-lg border border-border/60 px-3 py-2.5 text-xs shadow-xl" style={{ minWidth: 220 }}>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        <div className="mt-1.5 space-y-1">
          {ordered.map((p) => {
            const k = p.dataKey as RewardType;
            const color = REWARD_COLORS[k];
            const v = Number(p.value) || 0;
            return (
              <div key={k} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/90">
                    {t(`charts.rewardTypes.${k}`, k)}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="tabular-nums" style={{ color }}>{fmtMoney(v)}</span>
                  <span className="w-14 text-right text-[10px] tabular-nums text-muted-foreground/70">
                    {hasBase ? `${roi(v).toFixed(2)}%` : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-1.5">
          <span className="text-[10px] uppercase tracking-[0.18em] text-gold/80">
            {t("charts.assetGrowth.totalRoi", "Total ROI")}
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

  // ---------- End-point label for each Area ----------
  const renderAreaEndLabel = (typeKey: RewardType) =>
    (props: { x?: number; y?: number; index?: number; value?: number }) => {
      const { x = 0, y = 0, index = 0, value = 0 } = props;
      if (index !== data.length - 1) return null;
      const v = Number(value) || 0;
      const share = lastTotal > 0 ? (typeShare[typeKey] / lastTotal) * 100 : 0;
      // Hide tiny slivers to avoid overlap, keep just a color dot
      if (share < 6) {
        return (
          <circle cx={x + 4} cy={y} r={2} fill={REWARD_COLORS[typeKey]} />
        );
      }
      return (
        <g>
          <circle cx={x + 4} cy={y} r={2.2} fill={REWARD_COLORS[typeKey]} />
          <text
            x={x + 10}
            y={y}
            dy={3}
            fontSize={9}
            fontWeight={500}
            fill={REWARD_COLORS[typeKey]}
            style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}
          >
            ${Math.round(v).toLocaleString()}
          </text>
        </g>
      );
    };

  // ---------- Total line end-point pulse + pill label ----------
  const renderTotalDot = (props: { cx?: number; cy?: number; index?: number }) => {
    const { cx = 0, cy = 0, index = 0 } = props;
    if (index !== data.length - 1) {
      return <g key={`td-${index}`} />;
    }
    return (
      <g key={`td-${index}`}>
        {/* outer pulsing halo */}
        <circle cx={cx} cy={cy} r={4} fill="var(--gold)" opacity={0.35}>
          <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.45;0;0.45" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* solid core */}
        <circle
          cx={cx}
          cy={cy}
          r={3.5}
          fill="var(--gold)"
          style={{ filter: "drop-shadow(0 0 6px var(--gold))" }}
        />
      </g>
    );
  };

  const renderTotalEndLabel = (props: { x?: number; y?: number; index?: number; value?: number }) => {
    const { x = 0, y = 0, index = 0, value = 0 } = props;
    if (index !== data.length - 1) return null;
    const v = Number(value) || 0;
    const text = `${fmtMoney(v)}  ${roiLabel(v)}`;
    const padX = 6;
    const charW = 5.6;
    const w = Math.max(80, text.length * charW + padX * 2);
    const h = 16;
    return (
      <g>
        <rect
          x={x + 10}
          y={y - h / 2}
          rx={8}
          ry={8}
          width={w}
          height={h}
          fill="color-mix(in oklab, var(--gold) 18%, transparent)"
          stroke="color-mix(in oklab, var(--gold) 60%, transparent)"
          strokeWidth={1}
          style={{ filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--gold) 50%, transparent))" }}
        />
        <text
          x={x + 10 + padX}
          y={y}
          dy={3.5}
          fontSize={10}
          fontWeight={600}
          fill="var(--gold)"
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

        <div className="h-60 w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 12, right: 96, left: 0, bottom: 0 }}>
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
                  <Line
                    key={k}
                    type="monotone"
                    dataKey={k}
                    stroke={REWARD_COLORS[k]}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 3, fill: REWARD_COLORS[k] }}
                    isAnimationActive
                    animationDuration={900}
                    animationEasing="ease-out"
                  >
                    <LabelList dataKey={k} content={renderAreaEndLabel(k) as never} />
                  </Line>
                ))}
                {/* Total Sum highlight line */}
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
                  style={{ filter: "drop-shadow(0 0 8px color-mix(in oklab, var(--gold) 65%, transparent))" }}
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

        {/* legend with per-type ROI */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {REWARD_TYPES.map((k) => {
            const c = REWARD_COLORS[k];
            const v = typeShare[k];
            return (
              <div key={k} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
                <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  {t(`charts.rewardTypes.${k}`, k)}
                </span>
                <span className="text-[9px] tabular-nums text-muted-foreground/60">
                  {hasBase ? `${roi(v).toFixed(1)}%` : "—"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 border-t border-border/30 pt-3">
          <div className="flex items-baseline justify-between">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {t("charts.assetGrowth.current", "当前累计")}
            </div>
            <div className="flex items-center gap-2">
              <div className="font-light tabular-nums text-gold text-base">
                <CountUp value={lastTotal} prefix="$" decimals={2} />
              </div>
              <span
                className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-medium tabular-nums text-gold"
                style={{ boxShadow: "0 0 10px color-mix(in oklab, var(--gold) 25%, transparent)" }}
              >
                {roiLabel(lastTotal)} {hasBase ? "ROI" : ""}
              </span>
            </div>
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
            {hasBase
              ? `${t("charts.assetGrowth.basis", "vs")} ${fmtMoney(stakingBase)} ${t("charts.assetGrowth.basisSuffix", "staking 本金")}`
              : t("charts.assetGrowth.noBase", "暂无 staking 本金，无法计算 ROI")}
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
