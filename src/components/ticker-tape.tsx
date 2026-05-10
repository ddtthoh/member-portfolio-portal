import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TrendingUp, TrendingDown } from "lucide-react";

type Tick = {
  sym: string;
  chainId: string;
  pairAddress: string;
  tokenAddress: string;
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

type BoostedToken = {
  chainId: string;
  tokenAddress: string;
};

type DexPair = {
  chainId: string;
  pairAddress: string;
  baseToken: { address: string; symbol: string };
  priceUsd?: string;
  priceChange?: { h24?: number };
  liquidity?: { usd?: number };
};

export function TickerTape() {
  const { t } = useTranslation();
  const [ticks, setTicks] = useState<Tick[]>([]);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTrending() {
      try {
        // 1. Get top boosted (trending/hot) tokens from dexscreener
        const boostedRes = await fetch("https://api.dexscreener.com/token-boosts/top/v1");
        if (!boostedRes.ok) return;
        const boosted: BoostedToken[] = await boostedRes.json();
        if (!Array.isArray(boosted) || cancelled) return;

        // Take top 50, group by chain for batch fetching
        const top = boosted.slice(0, 50);
        const byChain = new Map<string, string[]>();
        for (const b of top) {
          if (!b.chainId || !b.tokenAddress) continue;
          if (!byChain.has(b.chainId)) byChain.set(b.chainId, []);
          byChain.get(b.chainId)!.push(b.tokenAddress);
        }

        // 2. Fetch pair info per chain (batch up to 30 tokens per call)
        const allPairs: DexPair[] = [];
        for (const [chainId, addrs] of byChain.entries()) {
          for (let i = 0; i < addrs.length; i += 30) {
            const chunk = addrs.slice(i, i + 30);
            try {
              const r = await fetch(
                `https://api.dexscreener.com/tokens/v1/${chainId}/${chunk.join(",")}`,
              );
              if (!r.ok) continue;
              const data = await r.json();
              if (Array.isArray(data)) allPairs.push(...(data as DexPair[]));
            } catch {
              // skip chunk
            }
          }
        }

        if (cancelled) return;

        // 3. Pick best (highest liquidity) pair per token
        const bestByToken = new Map<string, DexPair>();
        for (const p of allPairs) {
          const key = `${p.chainId}:${p.baseToken?.address?.toLowerCase()}`;
          const existing = bestByToken.get(key);
          const liq = p.liquidity?.usd ?? 0;
          if (!existing || (existing.liquidity?.usd ?? 0) < liq) {
            bestByToken.set(key, p);
          }
        }

        // 4. Build tick list in original boosted order
        const next: Tick[] = [];
        for (const b of top) {
          const key = `${b.chainId}:${b.tokenAddress.toLowerCase()}`;
          const p = bestByToken.get(key);
          if (!p || !p.priceUsd) continue;
          next.push({
            sym: p.baseToken.symbol,
            chainId: p.chainId,
            pairAddress: p.pairAddress,
            tokenAddress: p.baseToken.address,
            price: parseFloat(p.priceUsd),
            pct: p.priceChange?.h24 ?? 0,
            flash: false,
          });
        }

        setTicks((prev) => {
          // mark flash on price change
          const prevMap = new Map(prev.map((x) => [`${x.chainId}:${x.pairAddress}`, x.price]));
          return next.map((n) => {
            const old = prevMap.get(`${n.chainId}:${n.pairAddress}`);
            return { ...n, flash: old !== undefined && old !== n.price };
          });
        });

        if (flashTimer.current) clearTimeout(flashTimer.current);
        flashTimer.current = setTimeout(() => {
          setTicks((prev) => prev.map((x) => ({ ...x, flash: false })));
        }, 600);
      } catch {
        // network hiccup
      }
    }

    loadTrending();
    const id = setInterval(loadTrending, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  if (ticks.length === 0) {
    return (
      <div className="ticker-wrap relative overflow-hidden border-y border-border bg-background/80">
        <div className="py-2 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {t("components.ticker.loading", "Loading trending tokens…")}
        </div>
      </div>
    );
  }

  const items = [...ticks, ...ticks];

  return (
    <div className="ticker-wrap relative overflow-hidden border-y border-border bg-background/80">
      {/* Live pill */}
      <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 hidden md:flex items-center gap-1.5 rounded-full border border-gold/40 bg-background/90 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-gold backdrop-blur">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-gold/30" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
        </span>
        Live · DexScreener
      </div>
      <div className="ticker-mask">
        <div className="ticker-track flex gap-3 whitespace-nowrap py-2.5 pl-3 pr-3 md:pl-44">
          {items.map((tick, i) => {
            const up = tick.pct >= 0;
            const Arrow = up ? TrendingUp : TrendingDown;
            return (
              <a
                key={i}
                href={`https://dexscreener.com/${tick.chainId}/${tick.pairAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                title={t("components.ticker.viewOnDexscreener", { sym: tick.sym, defaultValue: `View ${tick.sym} on Dexscreener` })}
                className={`group inline-flex shrink-0 items-center gap-2 rounded-full border bg-card/40 px-3 py-1 backdrop-blur-sm transition-all duration-200 hover:-translate-y-px hover:border-gold/60 hover:shadow-[0_4px_18px_-6px_color-mix(in_oklab,var(--gold)_55%,transparent)] ${
                  tick.flash ? "border-gold/70 ring-1 ring-gold/40" : "border-border/40"
                }`}
              >
                <Arrow
                  className={`h-3 w-3 ${up ? "text-success" : "text-destructive"}`}
                  strokeWidth={2.5}
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground group-hover:text-foreground">
                  {tick.sym}
                </span>
                <span
                  className={`font-mono text-xs tabular-nums transition-colors duration-500 ${
                    tick.flash ? "text-gold" : "text-foreground"
                  }`}
                >
                  ${fmt(tick.price)}
                </span>
                <span
                  className={`rounded-sm px-1.5 py-0.5 font-mono text-[10px] tabular-nums ${
                    up
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {up ? "+" : ""}
                  {tick.pct.toFixed(2)}%
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
