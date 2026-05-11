import { createFileRoute } from "@tanstack/react-router";
import { Eye, ListOrdered, Route as RouteIcon, Layers, ShieldAlert, Globe } from "lucide-react";
import { NcoreHero, NcoreSection, FeatureGrid, SectionHeader, StepList } from "@/components/marketing/ncore-shell";
import { MReveal } from "@/components/marketing/m-reveal";
import { MempoolTape as MempoolFlow } from "@/components/marketing/charts-pro/mempool-tape";

export const Route = createFileRoute("/main/ncore/basic")({
  head: () => ({
    meta: [
      { title: "Ncore 2.0 — Basic Understanding — NASLAB" },
      { name: "description", content: "Foundational logic of on-chain execution: visibility, ordering, and execution paths in a public, permissionless environment." },
      { property: "og:title", content: "Ncore 2.0 — Basic — NASLAB" },
      { property: "og:description", content: "Visibility, ordering, and execution paths in a public on-chain environment." },
    ],
  }),
  component: BasicPage,
});

function BasicPage() {
  return (
    <>
      <NcoreHero
        eyebrow="Ncore 2.0 · Basic Understanding"
        title="On-chain markets are"
        highlight="public, ordered, and contested."
        description="Before strategy, comes structure. Ncore 2.0 begins with the foundational logic of on-chain execution — what is visible, how it is ordered, and which paths a transaction can take from intent to settlement."
      />

      <NcoreSection>
        <MReveal><MempoolFlow /></MReveal>
      </NcoreSection>

      <NcoreSection>
        <SectionHeader eyebrow="The Three Primitives" title="What every DEX trade" highlight="actually looks like." />
        <div className="mt-12">
          <FeatureGrid items={[
            { Icon: Eye, t: "Visibility (Mempool)", d: "Pending transactions are public before they are confirmed. The mempool is a real-time signal of intent — and the foundation of every predictive strategy." },
            { Icon: ListOrdered, t: "Ordering (Block Position)", d: "Within a block, position matters. Front-run, sandwich, and back-run are not exotic — they are direct consequences of who signs the order first." },
            { Icon: RouteIcon, t: "Execution Paths", d: "A trade can be routed across pools, AMMs, and aggregators. The path chosen determines slippage, gas, and ultimately profit." },
          ]} />
        </div>
      </NcoreSection>

      <NcoreSection>
        <SectionHeader eyebrow="From Visibility to Edge" title="How Ncore turns" highlight="public data into private advantage." />
        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-start">
          <MReveal>
            <StepList steps={[
              { n: "01", t: "Observe", d: "Stream the mempool across multiple nodes for redundancy and latency edge." },
              { n: "02", t: "Decode", d: "Parse pending swaps, decode router calldata and reconstruct the implied price impact." },
              { n: "03", t: "Decide", d: "Score opportunity against gas, slippage, MEV competition and risk tolerance in milliseconds." },
              { n: "04", t: "Execute", d: "Submit through optimized pathways with deterministic ordering to capture the spread." },
            ]} />
          </MReveal>
          <MReveal delay={150}>
            <div className="m-luxe-border">
              <div className="p-8">
                <h3 className="font-serif text-2xl">Why this matters</h3>
                <p className="mt-3 text-sm text-foreground/70">
                  On-chain execution is not a fairer version of TradFi — it is a different game with different physics.
                  Understanding visibility, ordering and routing is the prerequisite to building any durable strategy.
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {[
                    { Icon: Layers, t: "Liquidity is fragmented across pools and chains." },
                    { Icon: ShieldAlert, t: "Risk is technical — failed txs, reverts, and MEV competition." },
                    { Icon: Globe, t: "The market never closes — and neither does the opportunity." },
                  ].map(({ Icon, t }) => (
                    <li key={t} className="flex items-start gap-3 text-foreground/80">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </MReveal>
        </div>
      </NcoreSection>
    </>
  );
}
