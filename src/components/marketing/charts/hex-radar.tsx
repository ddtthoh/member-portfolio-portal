/* Hexagonal radar showing 6 capabilities, animated draw on mount. */
export function HexRadar({
  metrics = [
    { k: "Real-time", v: 0.92 },
    { k: "Gas Opt.", v: 0.85 },
    { k: "Risk Ctrl", v: 0.88 },
    { k: "Coverage", v: 0.78 },
    { k: "Latency", v: 0.95 },
    { k: "Reliability", v: 0.9 },
  ],
}: { metrics?: { k: string; v: number }[] }) {
  const cx = 160, cy = 160, R = 110;
  const N = metrics.length;
  const angle = (i: number) => -Math.PI / 2 + (i / N) * Math.PI * 2;
  const point = (i: number, scale: number) => {
    const a = angle(i);
    return [cx + Math.cos(a) * R * scale, cy + Math.sin(a) * R * scale] as const;
  };
  const polyAt = (scale: number) =>
    metrics.map((_, i) => point(i, scale).join(",")).join(" ");
  const dataPoly = metrics.map((m, i) => point(i, m.v).join(",")).join(" ");

  return (
    <div className="lg-card relative h-[360px] p-6">
      <div className="lg-noise" />
      <div className="relative z-[3] flex h-full flex-col">
        <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/55">
          Capability radar
        </div>
        <svg viewBox="0 0 320 320" className="mx-auto mt-2 h-full w-full max-w-[340px]">
          <defs>
            <radialGradient id="radG">
              <stop offset="0%" stopColor="#ffd166" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ff5a3c" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((s) => (
            <polygon key={s} points={polyAt(s)} fill="none" stroke="rgba(255,209,102,.18)" />
          ))}
          {metrics.map((_, i) => {
            const [x, y] = point(i, 1);
            return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,209,102,.18)" />;
          })}
          <polygon
            points={dataPoly}
            fill="url(#radG)"
            stroke="#ffd166"
            strokeWidth="1.5"
            style={{ filter: "drop-shadow(0 0 8px rgba(255,209,102,.6))" }}
          >
            <animate attributeName="opacity" from="0" to="1" dur="1.4s" fill="freeze" />
          </polygon>
          {metrics.map((m, i) => {
            const [x, y] = point(i, 1.18);
            return (
              <g key={m.k}>
                <circle cx={point(i, m.v)[0]} cy={point(i, m.v)[1]} r="3" fill="#ffd166" />
                <text x={x} y={y} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,.7)" letterSpacing="2">
                  {m.k}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
