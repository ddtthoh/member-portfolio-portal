import { useEffect, useRef, useState } from "react";

const AXES = [
  { k: "LATENCY", v: 0.94 },
  { k: "GAS EFF.", v: 0.86 },
  { k: "FILL RATE", v: 0.91 },
  { k: "RISK CTRL", v: 0.88 },
  { k: "UPTIME", v: 0.99 },
  { k: "COVERAGE", v: 0.82 },
  { k: "SECURITY", v: 0.95 },
  { k: "MEV WIN", v: 0.78 },
  { k: "SLIPPAGE", v: 0.84 },
  { k: "ROUTING", v: 0.9 },
  { k: "PNL ATTR.", v: 0.87 },
  { k: "TELEMETRY", v: 0.93 },
];

export function CapabilityWeb() {
  const cx = 250, cy = 250, R = 180;
  const N = AXES.length;
  const [active, setActive] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setDrawn(true)), { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const points = AXES.map((a, i) => {
    const ang = (i / N) * Math.PI * 2 - Math.PI / 2;
    const v = drawn ? a.v : 0.05;
    return [cx + Math.cos(ang) * R * v, cy + Math.sin(ang) * R * v, ang, a];
  });

  const poly = points.map(([x, y]) => `${(x as number).toFixed(1)},${(y as number).toFixed(1)}`).join(" ");

  return (
    <div className="lg-card relative p-6 md:p-8">
      <div className="lg-noise" />
      <div className="relative z-[3]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">Capability Web · v2.4</div>
            <div className="mt-2 font-display text-2xl md:text-3xl tracking-tight">Twelve dimensions of execution.</div>
          </div>
          <div className="text-right font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
            <div>composite score</div>
            <div className="mt-1 font-display text-3xl text-gold">88.4</div>
          </div>
        </div>

        <svg ref={ref} viewBox="0 0 500 500" className="mt-4 mx-auto aspect-square w-full max-w-[520px]">
          {/* concentric */}
          {[0.25, 0.5, 0.75, 1].map((s) => (
            <polygon
              key={s}
              points={Array.from({ length: N }).map((_, i) => {
                const a = (i / N) * Math.PI * 2 - Math.PI / 2;
                return `${(cx + Math.cos(a) * R * s).toFixed(1)},${(cy + Math.sin(a) * R * s).toFixed(1)}`;
              }).join(" ")}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
            />
          ))}
          {/* axes */}
          {AXES.map((_, i) => {
            const a = (i / N) * Math.PI * 2 - Math.PI / 2;
            return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * R} y2={cy + Math.sin(a) * R} stroke="rgba(255,255,255,0.06)" />;
          })}
          {/* shape */}
          <polygon
            points={poly}
            fill="rgba(255,209,102,0.18)"
            stroke="#ffd166"
            strokeWidth={1.5}
            style={{ filter: "drop-shadow(0 0 10px rgba(255,209,102,0.5))", transition: "all 1.4s cubic-bezier(.2,.8,.2,1)" }}
          />
          {/* points */}
          {points.map(([x, y, , a], i) => {
            const ax = a as { k: string; v: number };
            return (
              <g key={i} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
                <circle
                  cx={x as number}
                  cy={y as number}
                  r={active === i ? 6 : 3.2}
                  fill={active === i ? "#fff" : "#ffd166"}
                  stroke="#ffd166"
                  strokeWidth="1.5"
                  style={{ filter: `drop-shadow(0 0 6px #ffd166)`, transition: "all .3s" }}
                />
              </g>
            );
          })}
          {/* axis labels */}
          {AXES.map((a, i) => {
            const ang = (i / N) * Math.PI * 2 - Math.PI / 2;
            const lx = cx + Math.cos(ang) * (R + 22);
            const ly = cy + Math.sin(ang) * (R + 22);
            return (
              <g key={a.k}>
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="font-mono"
                  fontSize="9"
                  letterSpacing="2"
                  fill={active === i ? "#ffd166" : "rgba(255,255,255,0.55)"}
                >
                  {a.k}
                </text>
                <text
                  x={lx}
                  y={ly + 11}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize="9"
                  fill={active === i ? "#fff" : "rgba(255,255,255,0.3)"}
                >
                  {(a.v * 100).toFixed(0)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
