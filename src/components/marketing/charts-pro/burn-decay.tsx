import { useEffect, useRef } from "react";

export function BurnDecay() {
  const pathRef = useRef<SVGPathElement>(null);

  const W = 720, H = 280, PAD = 32;
  const N = 120;
  const start = 1_000_000_000;
  const data = Array.from({ length: N }, (_, i) => start * Math.exp(-0.024 * i));
  const max = data[0];
  const stepX = (W - PAD * 2) / (N - 1);
  const path = data
    .map((v, i) => {
      const x = PAD + i * stepX;
      const y = PAD + (H - PAD * 2) - (v / max) * (H - PAD * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const area = path + ` L${W - PAD} ${H - PAD} L${PAD} ${H - PAD} Z`;

  useEffect(() => {
    const p = pathRef.current; if (!p) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          p.style.transition = "stroke-dashoffset 2.4s cubic-bezier(.2,.8,.2,1)";
          p.style.strokeDashoffset = "0";
          obs.disconnect();
        }
      }),
      { threshold: 0.3 },
    );
    obs.observe(p);
    return () => obs.disconnect();
  }, []);

  const milestones = [
    { x: 0, label: "GENESIS", v: "1.00B" },
    { x: 24, label: "Y2 · TGE+24M", v: "562M" },
    { x: 60, label: "Y5 · DEEP", v: "237M" },
    { x: 119, label: "Y10 · HORIZON", v: "57M" },
  ];

  return (
    <div className="lg-card relative p-6 md:p-8">
      <div className="lg-noise" />
      <div className="relative z-[3]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">Burn Decay · 10y</div>
            <div className="mt-2 font-display text-2xl md:text-3xl tracking-tight">Scarcity, by design.</div>
          </div>
          <div className="text-right font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
            <div>half-life</div>
            <div className="mt-1 text-foreground/85 tabular-nums">~28.8 mo</div>
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="mt-5 w-full">
          <defs>
            <linearGradient id="bd-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffd166" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#ff7a3c" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ff5a3c" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="bd-stroke" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#ffe0a3" />
              <stop offset="55%" stopColor="#ffb347" />
              <stop offset="100%" stopColor="#ff5a3c" />
            </linearGradient>
          </defs>

          {/* gridlines */}
          {[0.25, 0.5, 0.75].map((g) => (
            <g key={g}>
              <line x1={PAD} x2={W - PAD} y1={PAD + (H - PAD * 2) * g} y2={PAD + (H - PAD * 2) * g} stroke="rgba(255,255,255,0.05)" />
              <text x={PAD - 6} y={PAD + (H - PAD * 2) * g + 3} textAnchor="end" className="font-mono" fontSize="9" fill="rgba(255,255,255,0.3)">
                {((1 - g) * 100).toFixed(0)}%
              </text>
            </g>
          ))}
          {/* x labels */}
          {[0, 30, 60, 90, 119].map((i) => (
            <text key={i} x={PAD + i * stepX} y={H - PAD + 14} textAnchor="middle" className="font-mono" fontSize="9" fill="rgba(255,255,255,0.3)">
              Y{(i / 12).toFixed(0)}
            </text>
          ))}

          <path d={area} fill="url(#bd-fill)" />
          <path
            ref={pathRef}
            d={path}
            stroke="url(#bd-stroke)"
            strokeWidth={2}
            fill="none"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,180,80,0.55))" }}
          />

          {/* milestones */}
          {milestones.map((m, i) => {
            const x = PAD + m.x * stepX;
            const y = PAD + (H - PAD * 2) - (data[m.x] / max) * (H - PAD * 2);
            return (
              <g key={m.label} style={{ animation: `ms-in 0.6s ${1.2 + i * 0.15}s both`, opacity: 0 }}>
                <line x1={x} y1={y} x2={x} y2={H - PAD} stroke="rgba(255,209,102,0.25)" strokeDasharray="2 3" />
                <circle cx={x} cy={y} r="3.5" fill="#ffd166" stroke="#fff" strokeWidth="1" />
                <text x={x} y={y - 14} textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="1.5" fill="#ffd166">{m.label}</text>
                <text x={x} y={y - 26} textAnchor="middle" className="font-mono" fontSize="11" fontWeight="600" fill="#fff">{m.v}</text>
              </g>
            );
          })}
          <style>{`@keyframes ms-in { to { opacity: 1; } }`}</style>
        </svg>
      </div>
    </div>
  );
}
