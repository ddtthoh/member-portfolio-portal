import { useEffect, useRef, useState } from "react";

// BNB Chain meme coins — DexScreener BSC pair addresses (high liquidity)
const BSC_PAIRS: { sym: string; pair: string }[] = [
  { sym: "FLOKI", pair: "0x231d9e7181E8479A8B40930961e93E7ed798542C" },
  { sym: "BABYDOGE", pair: "0xc736cA3d9b1E90Af4230BD8F9626528B3D4e0Ee0" },
  { sym: "CAKE", pair: "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0" },
  { sym: "TST", pair: "0x16969FA79651Bae11736F2f6576a86fE2726b42B" },
  { sym: "BROCCOLI", pair: "0xA5067360b13Fc7A2685Dc82dcD1bF2B4B8D7868B" },
  { sym: "MUBARAK", pair: "0x90A54475D512B8f3852351611c38faD30a513491" },
  { sym: "BANANAS31", pair: "0x7F51BBf34156ba802dEB0E38B7671DC4fa32041d" },
  { sym: "SHIB", pair: "0x98386f283E088ad53048376fc1c3bf2F726f775A" },
  { sym: "BONK", pair: "0x1A1703Bf5f1Da9DB0f62d17e8c54e84Fd732D695" },
];

type Tick = {
  sym: string;
  pair: string;
  price: number;
  pct: number;
  flash: boolean;
};

function fmt(p: number) {
  if (!p) return "—";
  if (p < 0.001) return p.toFixed(8);
  if (p < 1) return p.toFixed(5);
  return p.toFixed(3);
}

export function TickerTape() {
  const [ticks, setTicks] = useState<Tick[]>(
    BSC_PAIRS.map((c) => ({
      sym: c.sym,
      pair: c.pair,
      price: 0,
      pct: 0,
      flash: false,
    })),
  );
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPrices() {
      try {
        const url = `https://api.dexscreener.com/latest/dex/pairs/bsc/${BSC_PAIRS.map(
          (c) => c.pair,
        ).join(",")}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data: { pairs?: Array<{ pairAddress: string; priceUsd?: string; priceChange?: { h24?: number } }> } =
          await res.json();
        if (cancelled || !data.pairs) return;

        const map = new Map(data.pairs.map((p) => [p.pairAddress.toLowerCase(), p]));
        setTicks((prev) =>
          prev.map((t) => {
            const p = map.get(t.pair.toLowerCase());
            if (!p) return t;
            const newPrice = p.priceUsd ? parseFloat(p.priceUsd) : t.price;
            const pct = p.priceChange?.h24 ?? t.pct;
            return {
              ...t,
              price: newPrice,
              pct,
              flash: t.price !== 0 && newPrice !== t.price,
            };
          }),
        );

        if (flashTimer.current) clearTimeout(flashTimer.current);
        flashTimer.current = setTimeout(() => {
          setTicks((prev) => prev.map((t) => ({ ...t, flash: false })));
        }, 600);
      } catch {
        // network hiccup — keep prior prices
      }
    }

    fetchPrices();
    const id = setInterval(fetchPrices, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  const items = [...ticks, ...ticks];

  return (
    <div className="ticker-wrap relative overflow-hidden border-y border-border bg-background/60 backdrop-blur">
      <div className="ticker-track flex gap-8 whitespace-nowrap py-2 text-xs">
        {items.map((t, i) => (
          <a
            key={i}
            href={`https://dexscreener.com/bsc/${t.pair}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 transition-colors hover:text-gold"
            title={`Open ${t.sym} on DexScreener`}
          >
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
          </a>
        ))}
      </div>
    </div>
  );
}
