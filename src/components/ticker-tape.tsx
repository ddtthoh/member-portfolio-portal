import { useEffect, useRef, useState } from "react";

// BNB Chain — top liquidity DexScreener BSC pairs (50 coins)
const BSC_PAIRS: { sym: string; pair: string }[] = [
  { sym: "CAKE", pair: "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0" },
  { sym: "ETH", pair: "0xD0e226f674bBf064f54aB47F42473fF80DB98CBA" },
  { sym: "BTCB", pair: "0x6bbc40579ad1BBD243895cA0ACB086BB6300d636" },
  { sym: "FLOKI", pair: "0x231d9e7181E8479A8B40930961e93E7ed798542C" },
  { sym: "BABYDOGE", pair: "0xc736cA3d9b1E90Af4230BD8F9626528B3D4e0Ee0" },
  { sym: "BANANAS31", pair: "0x7F51BBf34156ba802dEB0E38B7671DC4fa32041d" },
  { sym: "DOGE", pair: "0x1D51f1f6Da2D274534c93a52303a39C286EC9B8F" },
  { sym: "BROCCOLI", pair: "0xA5067360b13Fc7A2685Dc82dcD1bF2B4B8D7868B" },
  { sym: "MUBARAK", pair: "0x90A54475D512B8f3852351611c38faD30a513491" },
  { sym: "SOL", pair: "0xbFFEc96e8f3b5058B1817c14E4380758Fada01EF" },
  { sym: "XRP", pair: "0xd15B00E81F98A7DB25f1dC1BA6E983a4316c4CaC" },
  { sym: "MBOX", pair: "0x8FA59693458289914dB0097F5F366d771B7a7C3F" },
  { sym: "TST", pair: "0x16969FA79651Bae11736F2f6576a86fE2726b42B" },
  { sym: "RACA", pair: "0x3f0CB8346ce04D8923Dcb1bE9552b011723e46AB" },
  { sym: "LINK", pair: "0x0E1893BEEb4d0913d26B9614B18Aea29c56d94b9" },
  { sym: "TWT", pair: "0x8cCB4544b3030dACF3d4D71C658f04e8688e25b1" },
  { sym: "ADA", pair: "0x28415ff2C35b65B9E5c7de82126b4015ab9d031F" },
  { sym: "SHIB", pair: "0x98386f283E088ad53048376fc1c3bf2F726f775A" },
  { sym: "BITCOIN", pair: "0xd1EB9F7E21C1060AbB985b116bC20732Fb7360c1" },
  { sym: "HARD", pair: "0xaCBe4c0Faf42D3055A610359F18A7c631ca5AE00" },
  { sym: "ELON", pair: "0x6cd04D410Ea8e2D47b90A096B2d1bD7DAfeC2854" },
  { sym: "TRX", pair: "0x3cd338c3BB249B6b3C55799F85a589FEbBBFf9Dd" },
  { sym: "PEPE", pair: "0xdD82975ab85E745c84e497FD75ba409Ec02d4739" },
  { sym: "DOT", pair: "0xDd5bAd8f8b360d76d12FdA230F8BAF42fe0022CF" },
  { sym: "LTC", pair: "0xE3cBe4Dd1BD2F7101f17D586F44bAb944091D383" },
  { sym: "UNI", pair: "0x014608E87AF97a054C9a49f81E1473076D51d9a3" },
  { sym: "AVAX", pair: "0x151268db1579ebC5306D4aAa5DCC627646E6986F" },
  { sym: "BANANA", pair: "0x5c32c5956225BE663a5BE758fF0cc1cF891d62E1" },
  { sym: "INJ", pair: "0x1BdCebcA3b93af70b58C41272AEa2231754B23ca" },
  { sym: "XVS", pair: "0x77d5b2560e4B84b3fC58875Cb0133F39560e8AE3" },
  { sym: "AAVE", pair: "0x3373A22CB07Cb49651B82CF6F174eF434E4DBAa8" },
  { sym: "BSW", pair: "0x46492B26639Df0cda9b2769429845cb991591E0A" },
  { sym: "FIL", pair: "0x16D7C51e9c59be9F18b19b608d53b37fa9890b8a" },
  { sym: "BETH", pair: "0x2fC2aD3c28560C97CAcA6D2DcF9B38614F48769A" },
  { sym: "NEAR", pair: "0x9191B027C26d44b86177E64f992cf4DCd1F4E0eF" },
  { sym: "BONK", pair: "0x1A1703Bf5f1Da9DB0f62d17e8c54e84Fd732D695" },
  { sym: "AUTO", pair: "0x4d0228EBEB39f6d2f29bA528e2d15Fc9121Ead56" },
  { sym: "MOG", pair: "0x58e609879B19f90B4Fdb3151bC24176B4B935B94" },
  { sym: "MATIC", pair: "0x29A4A3D77c010CE100A45831BF7e798f0f0B325D" },
  { sym: "BNBX", pair: "0xf2A4e4261FCDfBB891BCF703640Fbe713c6cD0fE" },
  { sym: "SUI", pair: "0x0AB4Ff4E36dBc8b46C417A74967747607b60622A" },
  { sym: "BTT", pair: "0x946696344e7d4346b223e1Cf77035a76690d6A73" },
  { sym: "ANDY", pair: "0x501fef55ac34982351aA4bb0B9D9ab8bb8856aa2" },
  { sym: "BABYBNB", pair: "0xf39978924D07710C741413a31fF89c7fcF2BDcc6" },
  { sym: "DODO", pair: "0xA9986Fcbdb23c2E8B11AB40102990a08f8E58f06" },
  { sym: "BAKE", pair: "0xc2Eed0F5a0dc28cfa895084bC0a9B8B8279aE492" },
  { sym: "TRUMP", pair: "0x573247e58a0459B39d11D9bDf07f32d9D6761AfF" },
  { sym: "ATOM", pair: "0x33dcD5381c0fd234867d5D7a49a19C009F82Af4e" },
  { sym: "SXP", pair: "0xD8E2F8b6Db204c405543953Ef6359912FE3A88d6" },
  { sym: "WOJAK", pair: "0x9a045cac70e3480e779d27e8a5E5b75980D4c08B" },
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

    type Pair = { pairAddress: string; priceUsd?: string; priceChange?: { h24?: number } };
    const CHUNK = 30;
    const chunks: string[][] = [];
    for (let i = 0; i < BSC_PAIRS.length; i += CHUNK) {
      chunks.push(BSC_PAIRS.slice(i, i + CHUNK).map((c) => c.pair));
    }

    async function fetchPrices() {
      try {
        const results = await Promise.all(
          chunks.map((c) =>
            fetch(`https://api.dexscreener.com/latest/dex/pairs/bsc/${c.join(",")}`)
              .then((r) => (r.ok ? r.json() : { pairs: [] }))
              .catch(() => ({ pairs: [] })),
          ),
        );
        if (cancelled) return;
        const allPairs: Pair[] = results.flatMap((r) => (r as { pairs?: Pair[] }).pairs ?? []);
        if (!allPairs.length) return;

        const map = new Map(allPairs.map((p) => [p.pairAddress.toLowerCase(), p]));
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
