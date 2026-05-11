/* NCT token: deflationary burn curve (exponential decay) + allocation donut. */
export function BurnCurve() {
  const w = 500, h = 200;
  const N = 60;
  const start = 1_000_000_000;
  const data = Array.from({ length: N }, (_, i) => start * Math.exp(-0.03 * i));
  const max = data[0];
  const stepX = w / (N - 1);
  const path = data.map((v, i) => {
    const x = i * stepX;
    const y = h - (v / max) * (h - 10) - 5;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const area = path + ` L${w} ${h} L0 ${h} Z`;

  return (
    <div className="lg-card relative p-6">
      <div className="lg-noise" />
      <div className="relative z-[3]">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/55">
            Deflationary supply curve
          </div>
          <div className="text-[10px] text-gold">10y projection</div>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full">
          <defs>
            <linearGradient id="bcg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffd166" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff5a3c" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="rgba(255,255,255,.06)" />
          ))}
          <path d={area} fill="url(#bcg)" />
          <path d={path} stroke="#ffd166" strokeWidth="1.8" fill="none"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,209,102,.6))" }}
            strokeDasharray="2000" strokeDashoffset="2000">
            <animate attributeName="stroke-dashoffset" from="2000" to="0" dur="2.4s" fill="freeze" />
          </path>
        </svg>
        <div className="mt-2 flex justify-between text-[10px] text-foreground/55">
          <span>Y0 · 1B NCT</span>
          <span>Y10 · ~150M NCT</span>
        </div>
      </div>
    </div>
  );
}

export function AllocationDonut() {
  const cx = 110, cy = 110, R = 80, r = 50;
  const segments = [
    { k: "Ecosystem", v: 35, c: "#ffd166" },
    { k: "Treasury", v: 25, c: "#ff8a3c" },
    { k: "Team", v: 15, c: "#ff5a3c" },
    { k: "Community", v: 15, c: "#7fd4e4" },
    { k: "Liquidity", v: 10, c: "#9d7df1" },
  ];
  let acc = 0;
  const arcs = segments.map((s) => {
    const start = acc;
    acc += s.v;
    const end = acc;
    const a0 = (start / 100) * Math.PI * 2 - Math.PI / 2;
    const a1 = (end / 100) * Math.PI * 2 - Math.PI / 2;
    const large = end - start > 50 ? 1 : 0;
    const x0 = cx + Math.cos(a0) * R, y0 = cy + Math.sin(a0) * R;
    const x1 = cx + Math.cos(a1) * R, y1 = cy + Math.sin(a1) * R;
    const ix1 = cx + Math.cos(a1) * r, iy1 = cy + Math.sin(a1) * r;
    const ix0 = cx + Math.cos(a0) * r, iy0 = cy + Math.sin(a0) * r;
    const d = `M${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1} L${ix1} ${iy1} A${r} ${r} 0 ${large} 0 ${ix0} ${iy0} Z`;
    return { ...s, d };
  });

  return (
    <div className="lg-card relative p-6">
      <div className="lg-noise" />
      <div className="relative z-[3]">
        <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/55">
          Token allocation
        </div>
        <div className="mt-2 grid grid-cols-[auto_1fr] items-center gap-6">
          <svg viewBox="0 0 220 220" className="h-[200px] w-[200px]">
            <g style={{ transformOrigin: "110px 110px", animation: "donut-rot 40s linear infinite" }}>
              {arcs.map((a, i) => (
                <path key={a.k} d={a.d} fill={a.c} opacity="0.9"
                  style={{ filter: `drop-shadow(0 0 6px ${a.c})`, transition: "transform .3s" }}>
                  <animate attributeName="opacity" from="0" to="0.9" dur="0.8s" begin={`${i * 0.12}s`} fill="freeze" />
                </path>
              ))}
            </g>
            <text x="110" y="105" textAnchor="middle" fontSize="10" letterSpacing="3"
              fill="rgba(255,255,255,.5)">SUPPLY</text>
            <text x="110" y="124" textAnchor="middle" fontSize="14" fontWeight="600" fill="#ffd166" fontFamily="serif">
              1,000,000,000
            </text>
            <style>{`@keyframes donut-rot { to { transform: rotate(360deg); } }`}</style>
          </svg>
          <ul className="space-y-2 text-xs">
            {segments.map((s) => (
              <li key={s.k} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.c }} />
                  <span className="text-foreground/75">{s.k}</span>
                </span>
                <span className="font-mono text-foreground/55">{s.v}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
