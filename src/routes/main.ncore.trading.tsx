import { createFileRoute } from "@tanstack/react-router";
import { Radio, Sandwich, Cpu, Gauge, Boxes, Timer } from "lucide-react";
import { NcoreHero, NcoreSection, FeatureGrid, SectionHeader, StepList } from "@/components/marketing/ncore-shell";
import { MReveal } from "@/components/marketing/m-reveal";

export const Route = createFileRoute("/main/ncore/trading")({
  head: () => ({
    meta: [
      { title: "Ncore 2.0 — Trading Logic — NASLAB" },
      { name: "description", content: "Mempool monitoring, sandwich execution and optimized transaction ordering — engineered to execute before the market reacts." },
      { property: "og:title", content: "Ncore 2.0 — Trading Logic — NASLAB" },
      { property: "og:description", content: "Mempool intelligence, sandwich execution and ordering optimization." },
    ],
  }),
  component: TradingPage,
});

function TradingPage() {
  return (
    <>
      <NcoreHero
        eyebrow="Ncore 2.0 · Trading Logic"
        title="Execute"
        highlight="before the market reacts."
        description="Ncore 2.0 fuses mempool intelligence with deterministic ordering. The result: structured, repeatable strategies that capture value at the exact moment liquidity moves."
      />

      <NcoreSection>
        <SectionHeader eyebrow="Core Strategies" title="Three families of" highlight="MEV execution." />
        <div className="mt-12">
          <FeatureGrid items={[
            { Icon: Radio, t: "Front-Run", d: "Identify a high-impact pending swap and place a buy order immediately before it, profiting from the price impact the original order will cause." },
            { Icon: Sandwich, t: "Sandwich", d: "Pair a front-run buy with a back-run sell around a target order, capturing the round-trip spread the victim trade creates." },
            { Icon: Cpu, t: "Back-Run", d: "Wait for a market-moving event — a large swap, a liquidation, an oracle update — and immediately execute against the new price." },
          ]} />
        </div>
      </NcoreSection>

      <NcoreSection>
        <SectionHeader eyebrow="The Pipeline" title="From mempool signal to" highlight="settled profit." />
        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-start">
          <MReveal>
            <StepList steps={[
              { n: "01", t: "Mempool Stream", d: "Multi-region nodes feed a low-latency pipeline of pending transactions." },
              { n: "02", t: "Opportunity Filter", d: "Pending txs are decoded and filtered by size, pool depth and expected slippage." },
              { n: "03", t: "Strategy Selection", d: "Front / sandwich / back is selected dynamically based on context, gas and competition." },
              { n: "04", t: "Bundle & Submit", d: "Transactions are bundled, signed and submitted with deterministic ordering guarantees." },
              { n: "05", t: "Settle & Recycle", d: "Profit is settled, capital is recycled, and the engine returns to mempool listening — within the same block." },
            ]} />
          </MReveal>
          <MReveal delay={150}>
            <div className="m-luxe-border">
              <div className="grid grid-cols-2 gap-px p-px">
                {[
                  { Icon: Timer, k: "Decision Window", v: "<50ms" },
                  { Icon: Gauge, k: "Throughput", v: "Block-level" },
                  { Icon: Boxes, k: "Strategies", v: "3 Families" },
                  { Icon: Cpu, k: "Execution", v: "Deterministic" },
                ].map(({ Icon, k, v }) => (
                  <div key={k} className="bg-[color:var(--m-bg)] p-8">
                    <Icon className="h-6 w-6 text-gold" />
                    <div className="mt-4 font-serif text-3xl m-gold-text">{v}</div>
                    <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-foreground/60">{k}</div>
                  </div>
                ))}
              </div>
            </div>
          </MReveal>
        </div>
      </NcoreSection>
    </>
  );
}
