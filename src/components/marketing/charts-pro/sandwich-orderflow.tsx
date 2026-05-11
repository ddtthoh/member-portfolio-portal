import { useEffect, useRef } from "react";

/**
 * Sandwich orderflow: candlestick spine + front-run / target / back-run markers
 * connected by light arcs. PnL pops at end.
 */
type Candle = { o: number; h: number; l: number; c: number };

function genCandles(n: number, base = 100): Candle[] {
  const out: Candle[] = [];
  let p = base;
  for (let i = 0; i < n; i++) {
    const o = p;
    const drift = (Math.random() - 0.48) * 1.2;
    const c = +(o + drift).toFixed(2);
    const h = Math.max(o, c) + Math.random() * 0.6;
    const l = Math.min(o, c) - Math.random() * 0.6;
    out.push({ o, h, l, c });
    p = c;
  }
  return out;
}

export function SandwichOrderflow() {
  const ref = useRef<SVGSVGElement>(null);
  const candles = genCandles(48);
  const min = Math.min(...candles.map((c) => c.l));
  const max = Math.max(...candles.map((c) => c.h));

  const W = 760, H = 320, PAD = 36;
  const colW = (W - PAD * 2) / candles.length;

  const yOf = (v: number) => PAD + (H - PAD * 2) - ((v - min) / (max - min)) * (H - PAD * 2);

  const front = 18, target = 22, back = 26;
  const px = (i: number) => PAD + i * colW + colW / 2;

  return (
    <div className="lg-card relative p-6 md:p-8">
      <div className="lg-noise" />
      <div className="relative z-[3]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">Sandwich Orderflow</div>
            <div className="mt-2 font-display text-2xl md:text-3xl tracking-tight">Three transactions. One block.</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-right font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
            <Stat k="front" v="t+0ms" />
            <Stat k="target" v="t+12ms" />
            <Stat k="back" v="t+24ms" highlight />
          </div>
        </div>

        <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="mt-5 w-full">
          <defs>
            <linearGradient id="so-arc" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#ffd166" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffd166" stopOpacity="1" />
              <stop offset="100%" stopColor="#ff5a3c" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="so-pnl" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* gridlines */}
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1={PAD} x2={W - PAD} y1={PAD + (H - PAD * 2) * g} y2={PAD + (H - PAD * 2) * g} stroke="rgba(255,255,255,0.05)" />
          ))}

          {/* PnL fill window */}
          <rect x={px(front) - colW / 2} y={PAD} width={px(back) - px(front) + colW} height={H - PAD * 2} fill="url(#so-pnl)" />

          {/* candles */}
          {candles.map((c, i) => {
            const x = px(i);
            const up = c.c >= c.o;
            const col = up ? "#7ce9a0" : "#ff5a3c";
            return (
              <g key={i} style={{ animation: `so-in 0.5s ${i * 0.018}s both`, opacity: 0 }}>
                <line x1={x} x2={x} y1={yOf(c.h)} y2={yOf(c.l)} stroke={col} strokeWidth={1} opacity={0.55} />
                <rect
                  x={x - colW * 0.35}
                  width={colW * 0.7}
                  y={yOf(Math.max(c.o, c.c))}
                  height={Math.max(1, Math.abs(yOf(c.o) - yOf(c.c)))}
                  fill={col}
                  opacity={0.85}
                />
              </g>
            );
          })}

          {/* front-run arrow */}
          {[
            { i: front, label: "FRONT", color: "#ffd166", dy: -38 },
            { i: target, label: "TARGET", color: "#ff5a3c", dy: -56 },
            { i: back, label: "BACK", color: "#7ce9a0", dy: -38 },
          ].map((m) => {
            const x = px(m.i); const y = yOf(candles[m.i].c);
            return (
              <g key={m.label} style={{ animation: `so-pop 0.5s 1.2s both`, opacity: 0 }}>
                <line x1={x} y1={y} x2={x} y2={y + m.dy} stroke={m.color} strokeDasharray="2 3" />
                <circle cx={x} cy={y} r={5} fill={m.color} stroke="#fff" strokeWidth="1" style={{ filter: `drop-shadow(0 0 8px ${m.color})` }} />
                <rect x={x - 30} y={y + m.dy - 16} width={60} height={16} rx={3} fill="rgba(0,0,0,0.85)" stroke={m.color} />
                <text x={x} y={y + m.dy - 5} textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="1.5" fill={m.color}>{m.label}</text>
              </g>
            );
          })}

          {/* arc connecting front -> target -> back */}
          <path
            d={`M${px(front)} ${yOf(candles[front].c) - 38} Q${px(target)} ${yOf(candles[target].c) - 80} ${px(back)} ${yOf(candles[back].c) - 38}`}
            fill="none"
            stroke="url(#so-arc)"
            strokeWidth="1.3"
            strokeDasharray="4 4"
            style={{ animation: "so-arc 4s linear infinite" }}
          />

          {/* PnL label */}
          <g transform={`translate(${px(back) + 20}, ${yOf(candles[back].c)})`} style={{ animation: "so-pop 0.6s 1.6s both", opacity: 0 }}>
            <rect x={-6} y={-26} width={94} height={48} rx={6} fill="rgba(0,0,0,0.85)" stroke="#10b981" />
            <text x={6} y={-12} className="font-mono" fontSize="9" letterSpacing="2" fill="#7ce9a0">PNL CAPTURED</text>
            <text x={6} y={6} className="font-mono" fontSize="16" fontWeight="600" fill="#fff">+0.42 ETH</text>
            <text x={6} y={18} className="font-mono" fontSize="9" fill="rgba(255,255,255,0.5)">~ $1,392</text>
          </g>

          <style>{`
            @keyframes so-in { to { opacity: 1; } }
            @keyframes so-pop { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes so-arc { to { stroke-dashoffset: -32; } }
          `}</style>
        </svg>
      </div>
    </div>
  );
}

function Stat({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div>
      <div>{k}</div>
      <div className={`mt-1 ${highlight ? "text-emerald-400/90" : "text-foreground/85"} tabular-nums`}>{v}</div>
    </div>
  );
}
