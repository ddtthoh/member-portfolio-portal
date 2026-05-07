import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { CountUp } from "@/components/count-up";

export function TotalAssetsGauge({
  staking,
  usd,
  rewards,
}: {
  staking: number;
  usd: number;
  rewards: number;
}) {
  const total = staking + usd + rewards;
  const stakingPct = total > 0 ? (staking / total) * 100 : 0;
  const usdPct = total > 0 ? (usd / total) * 100 : 0;
  const rewardsPct = total > 0 ? (rewards / total) * 100 : 0;

  // Normalized segment fractions (0..1) along pathLength=1
  const GAP = 0.008;
  const sFrac = total > 0 ? staking / total : 0;
  const cFrac = total > 0 ? usd / total : 0;
  const eFrac = total > 0 ? rewards / total : 0;

  // Visible length of each segment (subtract gap when the segment isn't the last/only)
  const sLen = Math.max(0, sFrac - (sFrac > 0 && (cFrac > 0 || eFrac > 0) ? GAP : 0));
  const cLen = Math.max(0, cFrac - (cFrac > 0 && eFrac > 0 ? GAP : 0));
  const eLen = Math.max(0, eFrac);

  // Cumulative offsets (where each segment starts along the arc)
  const sOffset = 0;
  const cOffset = sFrac;
  const eOffset = sFrac + cFrac;

  const r = 90;
  const cx = 110;
  const cy = 110;
  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [sDraw, setSDraw] = useState(0);
  const [cDraw, setCDraw] = useState(0);
  const [eDraw, setEDraw] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const a0 = animate(0, sLen, { duration: 1.2, ease: [0.16, 1, 0.3, 1], onUpdate: setSDraw });
    const a1 = animate(0, cLen, { duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1], onUpdate: setCDraw });
    const a2 = animate(0, eLen, { duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1], onUpdate: setEDraw });
    return () => { a0.stop(); a1.stop(); a2.stop(); };
  }, [inView, sLen, cLen, eLen]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg ref={ref} viewBox="0 0 220 130" className="h-40 w-56">
          {/* track */}
          <path
            d={arcPath}
            fill="none"
            stroke="hsl(var(--accent))"
            strokeOpacity={0.25}
            strokeWidth="14"
            strokeLinecap="round"
            pathLength={1}
          />
          {/* Participation */}
          <path
            d={arcPath}
            fill="none"
            stroke="var(--asset-participation)"
            strokeWidth="14"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${sDraw} 1`}
            strokeDashoffset={-sOffset}
            style={{ filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--asset-participation) 55%, transparent))" }}
          />
          {/* Cash */}
          <path
            d={arcPath}
            fill="none"
            stroke="var(--asset-cash)"
            strokeWidth="14"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${cDraw} 1`}
            strokeDashoffset={-cOffset}
            style={{ filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--asset-cash) 55%, transparent))" }}
          />
          {/* Earnings */}
          <path
            d={arcPath}
            fill="none"
            stroke="var(--asset-earnings)"
            strokeWidth="14"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${eDraw} 1`}
            strokeDashoffset={-eOffset}
            style={{ filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--asset-earnings) 55%, transparent))" }}
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-1">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Total Assets · USD
          </div>
          <div className="text-2xl font-light tabular-nums tracking-[-0.04em] text-gold">
            <CountUp value={total} prefix="$" decimals={2} />
          </div>
        </div>
      </div>
      <div className="mt-4 grid w-full grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--asset-participation)" }}
            />
            Participation
          </div>
          <div
            className="font-light tabular-nums tracking-[-0.02em]"
            style={{ color: "var(--asset-participation)" }}
          >
            <CountUp value={stakingPct} decimals={2} suffix="%" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--asset-cash)" }}
            />
            Cash
          </div>
          <div
            className="font-light tabular-nums tracking-[-0.02em]"
            style={{ color: "var(--asset-cash)" }}
          >
            <CountUp value={usdPct} decimals={2} suffix="%" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--asset-earnings)" }}
            />
            Earnings
          </div>
          <div
            className="font-light tabular-nums tracking-[-0.02em]"
            style={{ color: "var(--asset-earnings)" }}
          >
            <CountUp value={rewardsPct} decimals={2} suffix="%" />
          </div>
        </div>
      </div>
    </div>
  );
}
