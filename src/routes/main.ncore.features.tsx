import { createFileRoute } from "@tanstack/react-router";
import { Zap, Fuel, SlidersHorizontal, ShieldCheck, Activity, Lock, Workflow, Eye } from "lucide-react";
import { NcoreSection, FeatureGrid, SectionHeader } from "@/components/marketing/ncore-shell";
import { NcoreHeroPro } from "@/components/marketing/ncore-hero-pro";
import { MReveal } from "@/components/marketing/m-reveal";
import { CapabilityWeb as HexRadar } from "@/components/marketing/charts-pro/capability-web";

export const Route = createFileRoute("/main/ncore/features")({
  head: () => ({
    meta: [
      { title: "Ncore 2.0 — Features — NASLAB" },
      { name: "description", content: "Real-time execution, gas optimization and customizable risk controls — built for continuous, secure value capture." },
      { property: "og:title", content: "Ncore 2.0 — Features — NASLAB" },
      { property: "og:description", content: "Real-time execution, gas optimization, and risk controls." },
    ],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <>
      <NcoreHeroPro
        ch="CH.03 / NCORE 2.0"
        eyebrow="Features"
        titleA="Engineered for"
        titleB="continuous, secure capture."
        description="Speed without control is fragility. Ncore 2.0 pairs real-time execution with gas-aware routing and risk controls you can actually configure."
        visual={<div className="h-full min-h-[58vh] flex items-center justify-center"><HexRadar /></div>}
      />

      <NcoreSection>
        <SectionHeader eyebrow="Core Capabilities" title="What sits inside the" highlight="Ncore engine." />
        <div className="mt-12">
          <FeatureGrid items={[
            { Icon: Zap, t: "Real-Time Execution", d: "Sub-50ms decision pipeline with multi-region mempool ingestion and deterministic submission." },
            { Icon: Fuel, t: "Gas Optimization", d: "Dynamic gas pricing, bundle deduplication and EIP-1559 aware routing keep edge above cost." },
            { Icon: SlidersHorizontal, t: "Risk Controls", d: "Per-strategy slippage caps, position sizing, exposure limits and kill-switch protection." },
            { Icon: ShieldCheck, t: "Audited Custody", d: "Hardened key management, multi-sig governance, and segregated execution wallets." },
            { Icon: Activity, t: "Observability", d: "Live PnL, latency and competition telemetry feeds back into strategy selection." },
            { Icon: Lock, t: "Hardened Operations", d: "Defense-in-depth across infra, network and signing layers — minimizing attack surface." },
            { Icon: Workflow, t: "Modular Strategies", d: "Strategy modules can be added, retired or rebalanced without redeploying the core engine." },
            { Icon: Eye, t: "Transparent Reporting", d: "Capital activity, performance and risk are surfaced cleanly to operators and partners." },
          ]} />
        </div>
      </NcoreSection>
    </>
  );
}
