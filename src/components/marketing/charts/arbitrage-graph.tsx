import { useMemo } from "react";

/* Cross-platform arbitrage path graph: nodes = exchanges, animated coin flow. */
type Node = { id: string; x: number; y: number; type: "DEX" | "CEX" };
type Edge = { from: string; to: string; pulse?: boolean };

const NODES: Node[] = [
  { id: "Uniswap", x: 80, y: 80, type: "DEX" },
  { id: "Curve", x: 80, y: 220, type: "DEX" },
  { id: "Sushi", x: 200, y: 50, type: "DEX" },
  { id: "Binance", x: 420, y: 80, type: "CEX" },
  { id: "Kraken", x: 420, y: 220, type: "CEX" },
  { id: "Coinbase", x: 540, y: 150, type: "CEX" },
];
const EDGES: Edge[] = [
  { from: "Uniswap", to: "Sushi", pulse: true },
  { from: "Uniswap", to: "Curve" },
  { from: "Curve", to: "Kraken", pulse: true },
  { from: "Sushi", to: "Binance", pulse: true },
  { from: "Binance", to: "Coinbase", pulse: true },
  { from: "Kraken", to: "Coinbase" },
  { from: "Sushi", to: "Kraken" },
];

export function ArbitrageGraph() {
  const nMap = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);

  return (
    <div className="lg-card relative h-[420px] p-6">
      <div className="lg-noise" />
      <div className="relative z-[3] h-full">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-foreground/55">
          <span>Cross-platform arbitrage · live paths</span>
          <span className="text-gold">Δ price &gt; 0.12%</span>
        </div>
        <svg viewBox="0 0 620 320" className="mt-2 h-[calc(100%-2rem)] w-full">
          <defs>
            <radialGradient id="dexG"><stop offset="0%" stopColor="#ffd166" /><stop offset="100%" stopColor="#7a5b13" /></radialGradient>
            <radialGradient id="cexG"><stop offset="0%" stopColor="#ff8a5a" /><stop offset="100%" stopColor="#7a2a13" /></radialGradient>
            <linearGradient id="edgG" x1="0" x2="1"><stop offset="0%" stopColor="#ffd166" /><stop offset="100%" stopColor="#ff5a3c" /></linearGradient>
          </defs>

          {EDGES.map((e, i) => {
            const a = nMap[e.from], b = nMap[e.to];
            const id = `edge-${i}`;
            return (
              <g key={i}>
                <path id={id} d={`M${a.x} ${a.y} Q${(a.x + b.x) / 2} ${(a.y + b.y) / 2 - 30} ${b.x} ${b.y}`}
                  fill="none" stroke="url(#edgG)" strokeWidth={e.pulse ? 1.6 : 0.8}
                  opacity={e.pulse ? 0.85 : 0.35}
                  strokeDasharray={e.pulse ? "6 6" : undefined}
                >
                  {e.pulse && <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.6s" repeatCount="indefinite" />}
                </path>
                {e.pulse && (
                  <circle r="4" fill="#ffd166" style={{ filter: "drop-shadow(0 0 6px #ffd166)" }}>
                    <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite">
                      <mpath href={`#${id}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            );
          })}

          {NODES.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={26} fill={`url(#${n.type === "DEX" ? "dexG" : "cexG"})`}
                stroke={n.type === "DEX" ? "#ffd166" : "#ff5a3c"} strokeOpacity="0.6" />
              <circle cx={n.x} cy={n.y} r={26} fill="none"
                stroke={n.type === "DEX" ? "#ffd166" : "#ff5a3c"} strokeOpacity="0.3">
                <animate attributeName="r" from="26" to="40" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="2.8s" repeatCount="indefinite" />
              </circle>
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="9" fontWeight="600"
                fill="rgba(0,0,0,.85)">{n.type}</text>
              <text x={n.x} y={n.y + 44} textAnchor="middle" fontSize="10"
                fill="rgba(255,255,255,.8)" letterSpacing="1">{n.id}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
