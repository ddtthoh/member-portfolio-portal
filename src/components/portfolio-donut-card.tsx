import { useEffect, useRef, useState } from "react";
import { animate, useInView, motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CountUp } from "@/components/count-up";
import { SpotlightCard } from "@/components/spotlight-card";

type Props = {
  totalAssets: number;
  usd: number;
  rewards: number;
  staking: number;
  stakingDays: number;
  sinceDate: string;
  stakingEarned?: number;
  stakingRoi?: number;
};

const MASK = "••••••";
const GAP = 0.006;

export function PortfolioDonutCard({
  totalAssets,
  usd,
  rewards,
  staking,
  stakingDays,
  sinceDate,
  stakingEarned = 0,
  stakingRoi = 0,
}: Props) {
  const { t } = useTranslation();
  const [showAmount, setShowAmount] = useState(true);
  const [open, setOpen] = useState(true);

  const total = Math.max(staking + usd + rewards, 0.0001);
  const sFrac = staking / total;
  const cFrac = usd / total;
  const eFrac = rewards / total;

  const sLen = Math.max(0, sFrac - (sFrac > 0 && (cFrac > 0 || eFrac > 0) ? GAP : 0));
  const cLen = Math.max(0, cFrac - (cFrac > 0 && eFrac > 0 ? GAP : 0));
  const eLen = Math.max(0, eFrac - (eFrac > 0 ? GAP : 0));

  const sOffset = 0;
  const cOffset = sFrac;
  const eOffset = sFrac + cFrac;

  const cx = 120;
  const cy = 120;
  const r = 88;

  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [sDraw, setSDraw] = useState(0);
  const [cDraw, setCDraw] = useState(0);
  const [eDraw, setEDraw] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setSDraw(sLen); setCDraw(cLen); setEDraw(eLen);
      return;
    }
    const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
    const a0 = animate(0, sLen, { duration: 1.2, ease, onUpdate: setSDraw });
    const a1 = animate(0, cLen, { duration: 1.2, delay: 0.2, ease, onUpdate: setCDraw });
    const a2 = animate(0, eLen, { duration: 1.2, delay: 0.4, ease, onUpdate: setEDraw });
    return () => { a0.stop(); a1.stop(); a2.stop(); };
  }, [inView, sLen, cLen, eLen]);

  const segments = [
    { key: "staking", color: "var(--asset-participation)", len: sDraw, off: sOffset,
      label: t("components.totalAssets.labels.staking"), value: staking, pct: sFrac * 100,
      sub: `${stakingDays} ${t("pages.holdings.daysUnit")} · ${t("pages.holdings.since", { date: sinceDate })}` },
    { key: "usd", color: "var(--asset-cash)", len: cDraw, off: cOffset,
      label: t("components.totalAssets.labels.usd"), value: usd, pct: cFrac * 100, sub: "" },
    { key: "rewards", color: "var(--asset-earnings)", len: eDraw, off: eOffset,
      label: t("components.totalAssets.labels.rewardsAsset"), value: rewards, pct: eFrac * 100, sub: "" },
  ];

  return (
    <SpotlightCard className="liquid-glass relative rounded-2xl px-6 py-8 sm:px-10 sm:py-10">
      <div className="text-[10px] uppercase tracking-[0.22em] text-gold/80">
        {t("pages.holdings.eyebrow")}
      </div>

      {/* Donut */}
      <div className="relative mx-auto mt-4 flex w-full max-w-[280px] items-center justify-center">
        <svg ref={ref} viewBox="0 0 240 240" className="h-64 w-64 sm:h-72 sm:w-72">
          {/* track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="hsl(var(--accent))"
            strokeOpacity={0.18}
            strokeWidth={16}
          />
          {/* segments — rotated so drawing starts at 9 o'clock and sweeps clockwise */}
          <g transform={`rotate(180 ${cx} ${cy})`}>
            {segments.map((s) => (
              <circle
                key={s.key}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={16}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={`${s.len} 1`}
                strokeDashoffset={-s.off}
                style={{
                  filter: `drop-shadow(0 0 6px color-mix(in oklab, ${s.color} 70%, transparent)) drop-shadow(0 0 16px color-mix(in oklab, ${s.color} 40%, transparent))`,
                  transition: "stroke-dashoffset 0.4s ease",
                }}
              />
            ))}
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {t("pages.holdings.totalAssets")}
          </div>
          <div className="font-light tabular-nums tracking-[-0.04em] text-gold text-2xl sm:text-3xl">
            {showAmount ? <CountUp value={totalAssets} prefix="$" decimals={2} /> : <span>{MASK}</span>}
          </div>
          <button
            type="button"
            onClick={() => setShowAmount((s) => !s)}
            className="pointer-events-auto mt-1 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-gold/70 transition-colors hover:text-gold"
            aria-label={showAmount ? t("common.hideAmount") : t("common.showAmount")}
          >
            {showAmount ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showAmount ? t("common.hideAmount") : t("common.showAmount")}
          </button>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-6 border-t border-border/40 pt-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5">
              {segments.map((s) => (
                <span
                  key={s.key}
                  className="h-3 w-3 rounded-full ring-2 ring-background"
                  style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }}
                />
              ))}
            </div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-gold">
              {open ? t("pages.holdings.hideAccounts") : t("pages.holdings.showAccounts")}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gold/70 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 divide-y divide-border/40">
                {segments.map((row) => (
                  <div key={row.key} className="flex items-start justify-between gap-3 py-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ background: row.color, boxShadow: `0 0 8px ${row.color}` }}
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          {row.label}
                        </div>
                        {row.sub && (
                          <div className="mt-0.5 text-[10px] tracking-[0.04em] text-muted-foreground/60">
                            {row.sub}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-sm font-light tabular-nums tracking-[-0.02em]"
                        style={{ color: row.color }}
                      >
                        {showAmount ? (
                          <CountUp value={row.value} prefix="$" decimals={2} />
                        ) : (
                          <span>{MASK}</span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[10px] tabular-nums text-muted-foreground/70">
                        <CountUp value={row.pct} decimals={2} suffix="%" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SpotlightCard>
  );
}
