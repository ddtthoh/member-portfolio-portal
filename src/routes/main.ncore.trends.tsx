import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Layers, Bot, Waves, Globe2, GitBranch } from "lucide-react";
import { NcoreHero, NcoreSection, FeatureGrid, SectionHeader } from "@/components/marketing/ncore-shell";

export const Route = createFileRoute("/main/ncore/trends")({
  head: () => ({
    meta: [
      { title: "Ncore 2.0 — Market Trends — NASLAB" },
      { name: "description", content: "Adaptive low-latency trading capabilities built on DeFi growth, MEV dynamics, L2 scaling and AI-driven trading regimes." },
      { property: "og:title", content: "Ncore 2.0 — Market Trends — NASLAB" },
      { property: "og:description", content: "DeFi growth, MEV dynamics, L2 scaling and AI-driven trading." },
    ],
  }),
  component: TrendsPage,
});

function TrendsPage() {
  return (
    <>
      <NcoreHero
        eyebrow="Ncore 2.0 · Market Trends"
        title="The structural forces"
        highlight="shaping on-chain alpha."
        description="Ncore is positioned against six structural trends compounding the size and complexity of on-chain markets — and the technical edge required to operate inside them."
      />

      <NcoreSection>
        <SectionHeader eyebrow="The Six Vectors" title="Where the next decade of" highlight="execution alpha lives." />
        <div className="mt-12">
          <FeatureGrid items={[
            { Icon: TrendingUp, t: "DeFi Growth", d: "On-chain trading volumes continue to migrate from CEX-only flow to hybrid liquidity, expanding the surface for predictive execution." },
            { Icon: GitBranch, t: "MEV Dynamics", d: "Block-space competition and ordering markets are maturing — favoring operators with disciplined infrastructure over opportunistic actors." },
            { Icon: Layers, t: "L2 Scaling", d: "Rollups change latency, finality and gas economics — opening new strategy classes that did not exist on L1 alone." },
            { Icon: Bot, t: "AI-Driven Trading", d: "Model-driven decisioning compresses reaction time. Engines that pair ML with deterministic execution outpace heuristic-only systems." },
            { Icon: Waves, t: "Volatility Regimes", d: "Cycle-driven volatility creates asymmetric windows — the ability to safely scale into them is the real moat." },
            { Icon: Globe2, t: "Global Liquidity", d: "Cross-region, cross-venue and cross-chain liquidity continues to fragment. Unification through software is the durable edge." },
          ]} />
        </div>
      </NcoreSection>
    </>
  );
}
