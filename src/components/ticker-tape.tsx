import { useEffect, useState } from "react";

const COINS = [
  { sym: "DOGE", price: 0.142 },
  { sym: "SHIB", price: 0.0000234 },
  { sym: "PEPE", price: 0.0000178 },
  { sym: "WIF", price: 2.14 },
  { sym: "BONK", price: 0.0000312 },
  { sym: "FLOKI", price: 0.000186 },
  { sym: "BRETT", price: 0.0823 },
  { sym: "MOG", price: 0.00000162 },
  { sym: "POPCAT", price: 0.412 },
  { sym: "MEW", price: 0.0067 },
  { sym: "TURBO", price: 0.0089 },
  { sym: "NEIRO", price: 0.0024 },
];

type Tick = { sym: string; price: number; pct: number; flash: boolean };

function fmt(p: number) {
  if (p < 0.001) return p.toFixed(8);
  if (p < 1) return p.toFixed(5);
  return p.toFixed(3);
}

export function TickerTape() {
  const [ticks, setTicks] = useState<Tick[]>(
    COINS.map((c) => ({
      sym: c.sym,
      price: c.price,
      pct: (Math.random() - 0.4) * 14,
      flash: false,
    })),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTicks((prev) =>
        prev.map((t) => {
          const drift = (Math.random() - 0.5) * 0.04;
          const newPrice = Math.max(t.price * (1 + drift), 0.00000001);
          return {
            ...t,
            price: newPrice,
            pct: t.pct + (Math.random() - 0.5) * 0.6,
            flash: true,
          };
        }),
      );
      setTimeout(() => {
        setTicks((prev) => prev.map((t) => ({ ...t, flash: false })));
      }, 600);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const items = [...ticks, ...ticks];

  return (
    <div className="ticker-wrap relative overflow-hidden border-y border-border bg-background/60 backdrop-blur">
      <div className="ticker-track flex gap-8 whitespace-nowrap py-2 text-xs">
        {items.map((t, i) => (
          <div key={i} className="inline-flex shrink-0 items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {t.sym}
            </span>
            <span
              className={`font-mono tabular-nums transition-colors duration-500 ${
                t.flash ? "text-gold" : "text-foreground"
              }`}
            >
              ${fmt(t.price)}
            </span>
            <span
              className={`font-mono text-[11px] tabular-nums ${
                t.pct >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {t.pct >= 0 ? "+" : ""}
              {t.pct.toFixed(2)}%
            </span>
            <span className="text-border">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
