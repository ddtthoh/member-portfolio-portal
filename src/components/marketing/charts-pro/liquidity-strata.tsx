import { useEffect, useRef } from "react";

/**
 * Multi-layer area chart: DEX / CEX / L2 liquidity strata over 24 months.
 */
const LAYERS = [
  { k: "L2 ROLLUPS", c: "#a08bff", b: 0.6, d: 1.6 },
  { k: "DEX ON-CHAIN", c: "#ffd166", b: 1.0, d: 1.2 },
  { k: "CEX SPOT",   c: "#7fd4e4", b: 1.4, d: 0.7 },
];

function gen(n: number, base: number, drift: number) {
  const arr: number[] = [];
  let p = base;
  for (let i = 0; i < n; i++) {
    p += (Math.random() - 0.4) * 0.06 * p + drift * 0.04 * p;
    arr.push(p);
  }
  return arr;
}

export function LiquidityStrata() {
  const N = 24;
  const W = 720, H = 320, PAD = 36;
  const series = LAYERS.map((l) => ({ ...l, data: gen(N, l.b * 1000, l.d) }));

  // stacked
  const stacks: number[][] = Array.from({ length: N }, () => []);
  for (let i = 0; i < N; i++) {
    let acc = 0;
    for (const s of series) { acc += s.data[i]; stacks[i].push(acc); }
  }
  const max = Math.max(...stacks.flat());
  const stepX = (W - PAD * 2) / (N - 1);
  const yOf = (v: number) => PAD + (H - PAD * 2) - (v / max) * (H - PAD * 2);

  const paths = series.map((s, layerIdx) => {
    const top = stacks.map((row, i) => `${PAD + i * stepX},${yOf(row[layerIdx])}`).join(" L");
    const bottom = layerIdx === 0
      ? Array.from({ length: N }, (_, i) => `${PAD + (N - 1 - i) * stepX},${PAD + (H - PAD * 2)}`).join(" L")
      : stacks.map((row, i) => `${PAD + (N - 1 - i) * stepX},${yOf(row[layerIdx - 1])}`).reverse().join(" L");
    return `M${top} L${bottom} Z`;
  });

  return (
    <div className="lg-card relative p-6 md:p-8">
      <div className="lg-noise" />
      <div className="relative z-[3]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">Liquidity Strata · 24M</div>
            <div className="mt-2 font-display text-2xl md:text-3xl tracking-tight">Where liquidity actually lives.</div>
          </div>
          <div className="flex gap-5 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
            {series.map((s) => (
              <span key={s.k} className="inline-flex items-center gap-2"><span className="h-2 w-3 rounded-[1px]" style={{ background: s.c, boxShadow: `0 0 6px ${s.c}` }} /> {s.k}</span>
            ))}
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="mt-5 w-full">
          <defs>
            {series.map((s, i) => (
              <linearGradient key={i} id={`ls-${i}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={s.c} stopOpacity="0.85" />
                <stop offset="100%" stopColor={s.c} stopOpacity="0.18" />
              </linearGradient>
            ))}
          </defs>

          {[0.25, 0.5, 0.75].map((g) => (
            <g key={g}>
              <line x1={PAD} x2={W - PAD} y1={PAD + (H - PAD * 2) * g} y2={PAD + (H - PAD * 2) * g} stroke="rgba(255,255,255,0.05)" />
              <text x={PAD - 6} y={PAD + (H - PAD * 2) * g + 3} textAnchor="end" className="font-mono" fontSize="9" fill="rgba(255,255,255,0.3)">${((1 - g) * (max / 1000)).toFixed(0)}B</text>
            </g>
          ))}
          {[0, 6, 12, 18, 23].map((m) => (
            <text key={m} x={PAD + m * stepX} y={H - PAD + 14} textAnchor="middle" className="font-mono" fontSize="9" fill="rgba(255,255,255,0.3)">M{m + 1}</text>
          ))}

          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill={`url(#ls-${i})`}
              stroke={series[i].c}
              strokeWidth="1"
              style={{ filter: `drop-shadow(0 0 6px ${series[i].c})`, opacity: 0, animation: `ls-in 1s ${i * 0.2 + 0.2}s forwards cubic-bezier(.2,.8,.2,1)` }}
            />
          ))}
          <style>{`@keyframes ls-in { to { opacity: 1; } }`}</style>
        </svg>
      </div>
    </div>
  );
}
