import { useEffect, useState } from "react";

type Tick = { sym: string; px: number; chg: number };

const SEED: Tick[] = [
  { sym: "BTC",  px: 96420.13, chg: 1.42 },
  { sym: "ETH",  px:  3318.55, chg: -0.83 },
  { sym: "SOL",  px:   213.42, chg: 2.91 },
  { sym: "NCT",  px:     1.84, chg: 4.27 },
  { sym: "BNB",  px:   698.10, chg: 0.32 },
  { sym: "AVAX", px:    42.71, chg: -1.18 },
  { sym: "LINK", px:    24.86, chg: 1.05 },
  { sym: "ARB",  px:     0.84, chg: -2.31 },
  { sym: "OP",   px:     2.13, chg: 0.74 },
  { sym: "MATIC",px:     0.54, chg: -0.49 },
  { sym: "INJ",  px:    27.40, chg: 3.18 },
  { sym: "SUI",  px:     4.62, chg: 5.04 },
];

export function TickerTape() {
  const [ticks, setTicks] = useState<Tick[]>(SEED);

  useEffect(() => {
    const id = setInterval(() => {
      setTicks((prev) =>
        prev.map((t) => {
          const drift = (Math.random() - 0.5) * 0.004;
          const newPx = +(t.px * (1 + drift)).toFixed(t.px < 5 ? 4 : 2);
          const newChg = +(t.chg + (Math.random() - 0.5) * 0.12).toFixed(2);
          return { ...t, px: newPx, chg: newChg };
        }),
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const row = ticks.concat(ticks);
  return (
    <div className="lg-ticker relative overflow-hidden border-y border-gold/15 bg-black/40 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[color:var(--m-bg)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[color:var(--m-bg)] to-transparent" />
      <div className="lg-ticker-track flex gap-10 whitespace-nowrap py-2 font-mono text-[11px] tracking-wider">
        {row.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold/80 shadow-[0_0_6px_var(--gold)]" />
            <span className="text-foreground/85">{t.sym}</span>
            <span className="tabular-nums text-foreground/60">{t.px.toLocaleString(undefined, { minimumFractionDigits: t.px < 5 ? 4 : 2, maximumFractionDigits: t.px < 5 ? 4 : 2 })}</span>
            <span className={`tabular-nums ${t.chg >= 0 ? "text-emerald-400/90" : "text-rose-400/90"}`}>
              {t.chg >= 0 ? "▲" : "▼"} {Math.abs(t.chg).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes lg-tape-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .lg-ticker-track { animation: lg-tape-scroll 60s linear infinite; width: max-content; }
        .lg-ticker:hover .lg-ticker-track { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
