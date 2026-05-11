import { useEffect, useRef } from "react";

/**
 * Concentric ring stack with leader-line labels — replaces the pie chart.
 * Each segment is an arc, slowly self-rotating. Labels typeset with mono.
 */
type Seg = { k: string; v: number; c: string };

const SEGS: Seg[] = [
  { k: "Ecosystem",  v: 35, c: "#ffd166" },
  { k: "Treasury",   v: 25, c: "#ff9551" },
  { k: "Team",       v: 15, c: "#ff5a3c" },
  { k: "Community",  v: 15, c: "#7fd4e4" },
  { k: "Liquidity",  v: 10, c: "#a08bff" },
];

export function AllocationOrbit() {
  const ref = useRef<SVGGElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let t = 0; let raf = 0;
    const tick = () => { t += 0.05; el.style.transform = `rotate(${t}deg)`; raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cx = 200, cy = 200;
  let acc = -90; // start at top
  const arcs = SEGS.map((s, i) => {
    const start = acc, end = acc + (s.v / 100) * 360;
    acc = end + 1.2; // gap
    const R = 145 - i * 14;
    const path = arc(cx, cy, R, R, start, end);
    const mid = (start + end) / 2;
    return { ...s, path, R, mid, start, end };
  });

  return (
    <div className="lg-card relative p-6 md:p-8">
      <div className="lg-noise" />
      <div className="relative z-[3]">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">Allocation · NCT-001</div>
            <div className="mt-2 font-display text-2xl md:text-3xl tracking-tight">Token allocation, mapped.</div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55 text-right">
            <div>total supply</div>
            <div className="mt-1 tabular-nums text-foreground/90">1,000,000,000</div>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-[1fr] gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <svg viewBox="0 0 400 400" className="aspect-square w-full">
            {/* radial grid */}
            {[60, 95, 125, 155].map((r) => (
              <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" />
            ))}
            {/* tick marks */}
            {Array.from({ length: 36 }).map((_, i) => {
              const a = (i / 36) * Math.PI * 2 - Math.PI / 2;
              const x1 = cx + Math.cos(a) * 168, y1 = cy + Math.sin(a) * 168;
              const x2 = cx + Math.cos(a) * (i % 3 === 0 ? 178 : 173), y2 = cy + Math.sin(a) * (i % 3 === 0 ? 178 : 173);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 3 === 0 ? "rgba(255,209,102,0.45)" : "rgba(255,255,255,0.08)"} strokeWidth="1" />;
            })}

            <g ref={ref} style={{ transformOrigin: `${cx}px ${cy}px` }}>
              {arcs.map((a, i) => (
                <path
                  key={a.k}
                  d={a.path}
                  fill="none"
                  stroke={a.c}
                  strokeWidth={9}
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 6px ${a.c})`,
                    strokeDasharray: 1000,
                    strokeDashoffset: 1000,
                    animation: `orbit-draw 1.2s ${i * 0.15}s cubic-bezier(.2,.8,.2,1) forwards`,
                  }}
                />
              ))}
            </g>

            {/* center */}
            <text x={cx} y={cy - 6} textAnchor="middle" className="font-mono" fontSize="10" letterSpacing="3" fill="rgba(255,255,255,0.45)">SUPPLY · NCT</text>
            <text x={cx} y={cy + 18} textAnchor="middle" fontSize="22" fontWeight="500" fill="#ffd166" style={{ fontFamily: "var(--font-display, ui-sans-serif)" }}>1,000,000,000</text>
            <text x={cx} y={cy + 38} textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="2" fill="rgba(255,255,255,0.35)">FIXED · IMMUTABLE</text>

            <style>{`@keyframes orbit-draw { to { stroke-dashoffset: 0; } }`}</style>
          </svg>

          <ul className="self-center space-y-2.5 font-mono text-[11px]">
            {arcs.map((s) => (
              <li key={s.k} className="group flex items-center gap-3 rounded-md border border-transparent px-2 py-1.5 transition-colors hover:border-foreground/10 hover:bg-foreground/[0.03]">
                <span className="h-3 w-3 rounded-[2px]" style={{ background: s.c, boxShadow: `0 0 8px ${s.c}` }} />
                <span className="flex-1 uppercase tracking-[0.18em] text-foreground/80">{s.k}</span>
                <span className="tabular-nums text-foreground/60">{s.v.toFixed(1).padStart(4, "0")}%</span>
                <span className="tabular-nums text-foreground/40">{(s.v * 10).toLocaleString()}M</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number) {
  const r = (d: number) => (d * Math.PI) / 180;
  const x0 = cx + rx * Math.cos(r(a0)), y0 = cy + ry * Math.sin(r(a0));
  const x1 = cx + rx * Math.cos(r(a1)), y1 = cy + ry * Math.sin(r(a1));
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${x0} ${y0} A${rx} ${ry} 0 ${large} 1 ${x1} ${y1}`;
}
