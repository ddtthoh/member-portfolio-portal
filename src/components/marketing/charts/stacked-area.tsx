/* Stacked area showing DeFi growth across multiple categories. */
export function StackedArea() {
  const w = 600, h = 220;
  const series = [
    { name: "DEX volume", color: "#ffd166", data: [10, 14, 18, 22, 28, 36, 44, 52, 58, 64, 72, 80] },
    { name: "Lending TVL", color: "#ff8a3c", data: [8, 10, 13, 16, 20, 24, 28, 33, 38, 44, 50, 57] },
    { name: "L2 activity", color: "#ff5a3c", data: [4, 6, 9, 12, 16, 20, 26, 32, 40, 48, 56, 65] },
  ];
  const cum: number[][] = series.map(() => []);
  for (let i = 0; i < series[0].data.length; i++) {
    let sum = 0;
    series.forEach((s, si) => {
      sum += s.data[i];
      cum[si][i] = sum;
    });
  }
  const maxY = Math.max(...cum[cum.length - 1]);
  const stepX = w / (series[0].data.length - 1);

  const areaPath = (top: number[], bottom: number[]) => {
    let d = `M0 ${h - (top[0] / maxY) * h}`;
    top.forEach((v, i) => {
      d += ` L${i * stepX} ${h - (v / maxY) * h}`;
    });
    for (let i = bottom.length - 1; i >= 0; i--) {
      d += ` L${i * stepX} ${h - (bottom[i] / maxY) * h}`;
    }
    d += " Z";
    return d;
  };

  return (
    <div className="lg-card relative p-6">
      <div className="lg-noise" />
      <div className="relative z-[3]">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/55">
            DeFi growth · 12m rolling
          </div>
          <div className="flex gap-3 text-[10px]">
            {series.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5 text-foreground/65">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full">
          <defs>
            {series.map((s, i) => (
              <linearGradient key={i} id={`sa${i}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.85" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.1" />
              </linearGradient>
            ))}
          </defs>
          {series.map((s, i) => {
            const top = cum[i];
            const bottom = i === 0 ? new Array(top.length).fill(0) : cum[i - 1];
            return (
              <path
                key={i}
                d={areaPath(top, bottom)}
                fill={`url(#sa${i})`}
                stroke={s.color}
                strokeWidth="1"
                opacity="0"
              >
                <animate attributeName="opacity" from="0" to="1" dur="1.2s" begin={`${i * 0.2}s`} fill="freeze" />
              </path>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
