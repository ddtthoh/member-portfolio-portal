import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftRight, Building2, Boxes } from "lucide-react";
import { NcoreHero, NcoreSection, SectionHeader } from "@/components/marketing/ncore-shell";
import { MReveal } from "@/components/marketing/m-reveal";

export const Route = createFileRoute("/main/ncore/x")({
  head: () => ({
    meta: [
      { title: "Ncore X — Cross-Platform Arbitrage — NASLAB" },
      { name: "description", content: "Ncore X is the cross-platform arbitrage engine covering DEX↔DEX, CEX↔CEX and DEX↔CEX paths — turning fragmented liquidity into systematic returns." },
      { property: "og:title", content: "Ncore X — NASLAB" },
      { property: "og:description", content: "Cross-platform arbitrage covering DEX↔DEX, CEX↔CEX and DEX↔CEX." },
    ],
  }),
  component: NcoreXPage,
});

const PATHS = [
  { Icon: Boxes, k: "DEX ↔ DEX", t: "On-chain to on-chain", d: "Capture price discrepancies across AMMs, aggregators and pools — atomic where possible, hedged where not." },
  { Icon: Building2, k: "CEX ↔ CEX", t: "Venue to venue", d: "Cross-exchange spread capture across global centralized venues with latency-sensitive routing." },
  { Icon: ArrowLeftRight, k: "DEX ↔ CEX", t: "On-chain to off-chain", d: "Bridge price discovery between AMMs and order books — turning microstructure dislocations into structured returns." },
];

function NcoreXPage() {
  return (
    <>
      <NcoreHero
        variant="cyan"
        eyebrow="Ncore X · Cross-Platform Arbitrage"
        title="Unifying"
        highlight="fragmented liquidity."
        description="Markets are not one market — they are dozens of partially connected venues. Ncore X turns the seams between them into a continuous, programmable surface for arbitrage."
      />

      <NcoreSection>
        <SectionHeader eyebrow="Three Arbitrage Paths" title="The full" highlight="liquidity surface." />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PATHS.map(({ Icon, k, t, d }, i) => (
            <MReveal key={k} delay={i * 100}>
              <div className="m-luxe-border h-full">
                <div className="flex h-full flex-col p-8">
                  <Icon className="h-7 w-7 text-gold" />
                  <div className="mt-5 font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/80">{k}</div>
                  <div className="mt-2 font-serif text-2xl">{t}</div>
                  <p className="mt-3 flex-1 text-sm text-foreground/70">{d}</p>
                </div>
              </div>
            </MReveal>
          ))}
        </div>
      </NcoreSection>

      <NcoreSection>
        <div className="m-glass p-10 md:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <MReveal>
              <span className="m-eyebrow">Why Ncore X</span>
              <h2 className="mt-5 font-serif text-3xl md:text-4xl">
                Spread capture, <span className="m-cyan-glow">automated</span> across the venue map.
              </h2>
              <p className="mt-5 text-foreground/75">
                Ncore X transforms fleeting price discrepancies into a repeatable production system —
                hedged, capital-efficient and operating across DEX and CEX surfaces in parallel.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-foreground/80">
                <li>• Multi-venue inventory and risk netting</li>
                <li>• Latency-aware routing across regions</li>
                <li>• Automated rebalancing and treasury management</li>
                <li>• Real-time PnL attribution per path</li>
              </ul>
            </MReveal>
            <MReveal delay={150}>
              <FlowDiagram />
            </MReveal>
          </div>
        </div>
      </NcoreSection>
    </>
  );
}

function FlowDiagram() {
  const nodes = [
    { id: "DEX A", x: 12, y: 22 },
    { id: "DEX B", x: 12, y: 78 },
    { id: "CEX 1", x: 88, y: 22 },
    { id: "CEX 2", x: 88, y: 78 },
    { id: "Ncore X", x: 50, y: 50, hub: true },
  ];
  return (
    <div className="relative aspect-square w-full max-w-md">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="lx" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.14 200)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--gold)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 200)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {nodes.filter((n) => !n.hub).map((n) => (
          <line key={n.id} x1={n.x} y1={n.y} x2={50} y2={50} stroke="url(#lx)" strokeWidth="0.5" />
        ))}
      </svg>
      {nodes.map((n) => (
        <div
          key={n.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <div className={`grid place-items-center rounded-full border text-[10px] font-bold uppercase tracking-wider ${
            n.hub
              ? "h-20 w-20 border-gold bg-gradient-to-br from-gold/40 to-gold/10 text-gold shadow-[0_0_30px_color-mix(in_oklab,var(--gold)_60%,transparent)]"
              : "h-12 w-12 border-cyan-400/60 bg-[color:var(--m-bg)] text-cyan-300"
          }`}>
            {n.id}
          </div>
        </div>
      ))}
    </div>
  );
}
