## Plan: live BNB-chain meme coin ticker

Replace the mocked ticker in `src/components/ticker-tape.tsx` with **live prices from DexScreener** (free public API, no key, no backend needed) for **BNB Chain meme coins only**. Each ticker item becomes a clickable link that opens that coin's DexScreener page in a new tab.

### Coin list (BNB Chain memes, by pair address)

Hardcoded list of ~12 coins with their BSC pair addresses (PancakeSwap V2/V3 pools vs WBNB/USDT). Examples:

- FLOKI, BABYDOGE, SHIB (bsc-peg), DOGE (bsc-peg), PEPE (bsc), BONK (bsc), TST, BROCCOLI, CAKE, TUKTUK, MUBARAK, BANANA

(Final addresses verified against DexScreener at build time — only top-liquidity pairs included.)

### Data fetch

- Endpoint: `https://api.dexscreener.com/latest/dex/pairs/bsc/<pair1>,<pair2>,...` (batch up to 30 pairs in one request).
- Polled every **30 seconds** via `setInterval` inside `useEffect`.
- Response gives `priceUsd` and `priceChange.h24` for each pair.
- On successful fetch, diff vs previous price → trigger 600 ms gold flash (existing animation kept).
- On fetch error: keep last known prices, no UI break.

### Click behaviour

Each ticker item wraps in:
```tsx
<a href={`https://dexscreener.com/bsc/${pairAddress}`} target="_blank" rel="noopener noreferrer">
```
Hover: subtle gold underline (matches existing gold accent).

### Files touched

- `src/components/ticker-tape.tsx` — full rewrite: replace COINS array with `BSC_PAIRS`, add fetch logic, wrap items in anchors. Keep existing CSS classes (`ticker-wrap`, `ticker-track`, gold flash) untouched.

No new deps, no backend, no env vars. DexScreener API is CORS-enabled and free.

Approve and I'll build it.