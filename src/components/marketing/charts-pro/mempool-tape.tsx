import { useEffect, useRef, useState } from "react";

/**
 * Bloomberg-style horizontal mempool tape. 64 cells, each a pending tx,
 * gas-priority colored, taller = larger value. Updates in real time.
 */
type Cell = { id: number; gas: number; size: number; kind: "swap" | "add" | "rem" | "burn" };

const KINDS: Cell["kind"][] = ["swap", "swap", "swap", "swap", "add", "rem", "swap", "burn"];

function rand(): Cell {
  return {
    id: Math.random(),
    gas: Math.random(),
    size: 0.2 + Math.random() * 0.8,
    kind: KINDS[Math.floor(Math.random() * KINDS.length)],
  };
}

const COLOR: Record<Cell["kind"], string> = {
  swap: "rgba(255,209,102,",
  add: "rgba(124,233,160,",
  rem: "rgba(255,90,60,",
  burn: "rgba(255,170,80,",
};

export function MempoolTape() {
  const [cells, setCells] = useState<Cell[]>(() => Array.from({ length: 64 }, rand));
  const [block, setBlock] = useState(20_184_502);
  const [tps, setTps] = useState(184);
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setCells((prev) => {
        const drop = Math.floor(1 + Math.random() * 3);
        const next = prev.slice(drop).concat(Array.from({ length: drop }, rand));
        return next;
      });
      setTps((t) => Math.max(80, Math.min(420, t + (Math.random() - 0.5) * 25)));
      if (Math.random() < 0.18) setBlock((b) => b + 1);
    }, 350);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="lg-card relative p-6 md:p-8">
      <div className="lg-noise" />
      <div className="relative z-[3]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">CH.01 / Mempool Tape</div>
            <div className="mt-2 font-display text-2xl md:text-3xl tracking-tight">Pending order flow, decoded.</div>
          </div>
          <div className="flex gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
            <Stat k="block" v={`#${block.toLocaleString()}`} />
            <Stat k="tps" v={tps.toFixed(0)} pulse />
            <Stat k="window" v="2.4s" />
          </div>
        </div>

        <div ref={ref} className="relative mt-6 grid h-40 grid-cols-[repeat(64,1fr)] items-end gap-[2px] rounded-md border border-foreground/10 bg-black/35 p-2 md:h-52">
          {/* Grid rules */}
          <div className="pointer-events-none absolute inset-2 z-0">
            {[0.25, 0.5, 0.75].map((g) => (
              <div key={g} className="absolute left-0 right-0 border-t border-foreground/[0.04]" style={{ top: `${g * 100}%` }} />
            ))}
          </div>
          {cells.map((c, i) => {
            const h = 6 + c.size * 92;
            const a = 0.35 + c.gas * 0.6;
            return (
              <div
                key={c.id}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="relative z-[1] rounded-[2px] transition-all"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(180deg, ${COLOR[c.kind]}${a}), ${COLOR[c.kind]}0.05))`,
                  boxShadow: c.gas > 0.85 ? `0 0 8px ${COLOR[c.kind]}0.6)` : undefined,
                  transform: hover === i ? "scaleY(1.06)" : undefined,
                  transformOrigin: "bottom",
                }}
              />
            );
          })}
          {hover !== null && cells[hover] && (
            <div className="pointer-events-none absolute -top-3 left-1/2 z-10 -translate-x-1/2 -translate-y-full rounded-md border border-gold/30 bg-black/85 px-3 py-1.5 font-mono text-[10px] tracking-wider text-foreground/80 backdrop-blur">
              {cells[hover].kind.toUpperCase()} · gas {(cells[hover].gas * 240).toFixed(0)}gwei · {(cells[hover].size * 1.2).toFixed(2)} ETH
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
          <Legend c="rgba(255,209,102,0.85)" l="Swap" />
          <Legend c="rgba(124,233,160,0.85)" l="Add Liquidity" />
          <Legend c="rgba(255,90,60,0.85)" l="Remove" />
          <Legend c="rgba(255,170,80,0.85)" l="Burn" />
        </div>
      </div>
    </div>
  );
}

function Stat({ k, v, pulse }: { k: string; v: string | number; pulse?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {pulse && <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />}
      <span className="text-foreground/45">{k}</span>
      <span className="tabular-nums text-foreground/85">{v}</span>
    </div>
  );
}

function Legend({ c, l }: { c: string; l: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block h-2 w-3 rounded-[1px]" style={{ background: c }} />
      <span>{l}</span>
    </span>
  );
}
