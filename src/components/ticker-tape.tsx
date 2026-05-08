import { useEffect, useRef, useState } from "react";

// BNB Chain — top liquidity pairs (50 coins). `token` = base token address used for PancakeSwap deep links.
const BSC_PAIRS: { sym: string; pair: string; token: string }[] = [
  { sym: "CAKE", pair: "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0", token: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82" },
  { sym: "ETH", pair: "0xD0e226f674bBf064f54aB47F42473fF80DB98CBA", token: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8" },
  { sym: "BTCB", pair: "0x6bbc40579ad1BBD243895cA0ACB086BB6300d636", token: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c" },
  { sym: "FLOKI", pair: "0x231d9e7181E8479A8B40930961e93E7ed798542C", token: "0xfb5B838b6cfEEdC2873aB27866079AC55363D37E" },
  { sym: "BABYDOGE", pair: "0xc736cA3d9b1E90Af4230BD8F9626528B3D4e0Ee0", token: "0xc748673057861a797275CD8A068AbB95A902e8de" },
  { sym: "BANANAS31", pair: "0x7F51BBf34156ba802dEB0E38B7671DC4fa32041d", token: "0x3d4f0513E8a29669B960f9dBcA61861548A9A760" },
  { sym: "DOGE", pair: "0x1D51f1f6Da2D274534c93a52303a39C286EC9B8F", token: "0x4206931337dc273a630d328dA6441786BfaD668f" },
  { sym: "BROCCOLI", pair: "0xA5067360b13Fc7A2685Dc82dcD1bF2B4B8D7868B", token: "0x6d5AD1592ed9D6D1dF9b93c793AB759573Ed6714" },
  { sym: "MUBARAK", pair: "0x90A54475D512B8f3852351611c38faD30a513491", token: "0x5C85D6C6825aB4032337F11Ee92a72DF936b46F6" },
  { sym: "SOL", pair: "0xbFFEc96e8f3b5058B1817c14E4380758Fada01EF", token: "0x570A5D26f7765Ecb712C0924E4De545B89fD43dF" },
  { sym: "XRP", pair: "0xd15B00E81F98A7DB25f1dC1BA6E983a4316c4CaC", token: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE" },
  { sym: "MBOX", pair: "0x8FA59693458289914dB0097F5F366d771B7a7C3F", token: "0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377" },
  { sym: "TST", pair: "0x16969FA79651Bae11736F2f6576a86fE2726b42B", token: "0x86Bb94DdD16Efc8bc58e6b056e8df71D9e666429" },
  { sym: "RACA", pair: "0x3f0CB8346ce04D8923Dcb1bE9552b011723e46AB", token: "0x12BB890508c125661E03b09EC06E404bc9289040" },
  { sym: "LINK", pair: "0x0E1893BEEb4d0913d26B9614B18Aea29c56d94b9", token: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD" },
  { sym: "TWT", pair: "0x8cCB4544b3030dACF3d4D71C658f04e8688e25b1", token: "0x4B0F1812e5Df2A09796481Ff14017e6005508003" },
  { sym: "ADA", pair: "0x28415ff2C35b65B9E5c7de82126b4015ab9d031F", token: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47" },
  { sym: "SHIB", pair: "0x98386f283E088ad53048376fc1c3bf2F726f775A", token: "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D" },
  { sym: "BITCOIN", pair: "0xd1EB9F7E21C1060AbB985b116bC20732Fb7360c1", token: "0x4C769928971548eb71A3392EAf66BeDC8bef4B80" },
  { sym: "HARD", pair: "0xaCBe4c0Faf42D3055A610359F18A7c631ca5AE00", token: "0xf79037F6f6bE66832DE4E7516be52826BC3cBcc4" },
  { sym: "ELON", pair: "0x6cd04D410Ea8e2D47b90A096B2d1bD7DAfeC2854", token: "0x7bd6FaBD64813c48545C9c0e312A0099d9be2540" },
  { sym: "TRX", pair: "0x3cd338c3BB249B6b3C55799F85a589FEbBBFf9Dd", token: "0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B" },
  { sym: "PEPE", pair: "0xdD82975ab85E745c84e497FD75ba409Ec02d4739", token: "0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00" },
  { sym: "DOT", pair: "0xDd5bAd8f8b360d76d12FdA230F8BAF42fe0022CF", token: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402" },
  { sym: "LTC", pair: "0xE3cBe4Dd1BD2F7101f17D586F44bAb944091D383", token: "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94" },
  { sym: "UNI", pair: "0x014608E87AF97a054C9a49f81E1473076D51d9a3", token: "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1" },
  { sym: "AVAX", pair: "0x151268db1579ebC5306D4aAa5DCC627646E6986F", token: "0x1CE0c2827e2eF14D5C4f29a091d735A204794041" },
  { sym: "BANANA", pair: "0x5c32c5956225BE663a5BE758fF0cc1cF891d62E1", token: "0xA444822905318D23A03eCa2AA5eF2Aaa381Bffff" },
  { sym: "INJ", pair: "0x1BdCebcA3b93af70b58C41272AEa2231754B23ca", token: "0xa2B726B1145A4773F68593CF171187d8EBe4d495" },
  { sym: "XVS", pair: "0x77d5b2560e4B84b3fC58875Cb0133F39560e8AE3", token: "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63" },
  { sym: "AAVE", pair: "0x3373A22CB07Cb49651B82CF6F174eF434E4DBAa8", token: "0xfb6115445Bff7b52FeB98650C87f44907E58f802" },
  { sym: "BSW", pair: "0x46492B26639Df0cda9b2769429845cb991591E0A", token: "0x965F527D9159dCe6288a2219DB51fc6Eef120dD1" },
  { sym: "FIL", pair: "0x16D7C51e9c59be9F18b19b608d53b37fa9890b8a", token: "0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153" },
  { sym: "BETH", pair: "0x2fC2aD3c28560C97CAcA6D2DcF9B38614F48769A", token: "0x250632378E573c6Be1AC2f97Fcdf00515d0Aa91B" },
  { sym: "NEAR", pair: "0x9191B027C26d44b86177E64f992cf4DCd1F4E0eF", token: "0x1Fa4a73a3F0133f0025378af00236f3aBDEE5D63" },
  { sym: "BONK", pair: "0x1A1703Bf5f1Da9DB0f62d17e8c54e84Fd732D695", token: "0xA697e272a73744b343528C3Bc4702F2565b2F422" },
  { sym: "AUTO", pair: "0x4d0228EBEB39f6d2f29bA528e2d15Fc9121Ead56", token: "0xa184088a740c695E156F91f5cC086a06bb78b827" },
  { sym: "MOG", pair: "0x58e609879B19f90B4Fdb3151bC24176B4B935B94", token: "0x1D0A4821FDEf156b0d051D08A166DE5DF2788Cf7" },
  { sym: "MATIC", pair: "0x29A4A3D77c010CE100A45831BF7e798f0f0B325D", token: "0xCC42724C6683B7E57334c4E856f4c9965ED682bD" },
  { sym: "BNBX", pair: "0xf2A4e4261FCDfBB891BCF703640Fbe713c6cD0fE", token: "0x1bdd3Cf7F79cfB8EdbB955f20ad99211551BA275" },
  { sym: "SUI", pair: "0x0AB4Ff4E36dBc8b46C417A74967747607b60622A", token: "0xd57f2e190C11cffc667AA5aD026Cd4C8DE0772a7" },
  { sym: "BTT", pair: "0x946696344e7d4346b223e1Cf77035a76690d6A73", token: "0x8595F9dA7b868b1822194fAEd312235E43007b49" },
  { sym: "ANDY", pair: "0x501fef55ac34982351aA4bb0B9D9ab8bb8856aa2", token: "0x01CA78a2B5F1a9152D8A3A625bd7dF5765eeE1D8" },
  { sym: "BABYBNB", pair: "0xf39978924D07710C741413a31fF89c7fcF2BDcc6", token: "0x2d5F3B0722aCd35fbb749cB936dfdd93247BBC95" },
  { sym: "DODO", pair: "0xA9986Fcbdb23c2E8B11AB40102990a08f8E58f06", token: "0x67ee3Cb086F8a16f34beE3ca72FAD36F7Db929e2" },
  { sym: "BAKE", pair: "0xc2Eed0F5a0dc28cfa895084bC0a9B8B8279aE492", token: "0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5" },
  { sym: "TRUMP", pair: "0x573247e58a0459B39d11D9bDf07f32d9D6761AfF", token: "0xfEEf9b675Fe3dE34E94028da6237f0670f78bEa7" },
  { sym: "ATOM", pair: "0x33dcD5381c0fd234867d5D7a49a19C009F82Af4e", token: "0x0Eb3a705fc54725037CC9e008bDede697f62F335" },
  { sym: "SXP", pair: "0xD8E2F8b6Db204c405543953Ef6359912FE3A88d6", token: "0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A" },
  { sym: "WOJAK", pair: "0x9a045cac70e3480e779d27e8a5E5b75980D4c08B", token: "0x44440ad85D8F2C67014b275de0b45fa0Df3A807D" },
];

type Tick = {
  sym: string;
  pair: string;
  token: string;
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
      token: c.token,
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
    <div className="ticker-wrap relative overflow-hidden border-y border-border bg-background/80">
      <div className="ticker-track flex gap-8 whitespace-nowrap py-2 text-xs">
        {items.map((t, i) => (
          <a
            key={i}
            href={`https://pancakeswap.finance/swap?outputCurrency=${t.token}`}
            target="_top"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 transition-colors hover:text-gold"
            title={`Trade ${t.sym} on PancakeSwap`}
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
