import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Activity, Cpu, TrendingUp, Network, Coins } from "lucide-react";
import { MReveal } from "@/components/marketing/m-reveal";

export const Route = createFileRoute("/main/ncore/")({
  head: () => ({
    meta: [
      { title: "Ncore Overview — NASLAB" },
      { name: "description", content: "Ncore is Naslab's predictive execution stack — a DEX-focused MEV engine, a cross-platform arbitrage layer, and a tokenized incentive economy." },
      { property: "og:title", content: "Ncore Overview — NASLAB" },
      { property: "og:description", content: "A unified execution stack: predictive MEV, cross-platform arbitrage, and the NCT token economy." },
    ],
  }),
  component: NcoreOverview,
});

const PRODUCTS = [
  { Icon: BookOpen, t: "Basic Understanding", d: "Foundational logic of on-chain execution: visibility, ordering, and execution paths.", to: "/main/ncore/basic" as const },
  { Icon: Activity, t: "Trading Logic", d: "Mempool monitoring, sandwich execution and optimized ordering before the market reacts.", to: "/main/ncore/trading" as const },
  { Icon: Cpu, t: "Features", d: "Real-time execution, gas optimization and customizable risk controls.", to: "/main/ncore/features" as const },
  { Icon: TrendingUp, t: "Market Trends", d: "DeFi growth, MEV dynamics, L2 scaling, AI-driven trading and volatility regimes.", to: "/main/ncore/trends" as const },
  { Icon: Network, t: "Ncore X", d: "Cross-platform arbitrage covering DEX↔DEX, CEX↔CEX and DEX↔CEX paths.", to: "/main/ncore/x" as const },
  { Icon: Coins, t: "NCT Token", d: "The exclusive settlement, access and incentive layer of the Ncore ecosystem.", to: "/main/ncore/token" as const },
];

function NcoreOverview() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute right-10 top-40 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-10">
          <MReveal>
            <span className="m-eyebrow">Ncore Product Family</span>
          </MReveal>
          <MReveal delay={120}>
            <h1 className="mt-6 max-w-5xl m-h1">
              The execution stack <span className="m-gold-text">behind a new digital economy</span>.
            </h1>
          </MReveal>
          <MReveal delay={240}>
            <p className="mt-7 max-w-2xl text-lg text-foreground/75">
              Ncore is a connected family of products that turn raw market microstructure
              — mempool flow, latency, fragmented liquidity — into systematic, repeatable returns.
            </p>
          </MReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map(({ Icon, t, d, to }, i) => (
            <MReveal key={t} delay={i * 80}>
              <Link to={to} className="m-glass m-tilt block h-full p-7">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-gold/40 bg-gradient-to-br from-gold/20 to-transparent">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="mt-5 m-card-title">{t}</h3>
                <p className="mt-3 text-sm text-foreground/70">{d}</p>
                <div className="mt-5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/85">
                  Read more <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </MReveal>
          ))}
        </div>
      </section>
    </>
  );
}
