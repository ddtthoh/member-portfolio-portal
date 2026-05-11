import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const Route = createFileRoute("/main/ncore/x")({
  head: () => ({
    meta: [
      { title: "Ncore X — NASLAB" },
      { name: "description", content: "Cross-platform arbitrage engine covering DEX-DEX, CEX-CEX, and DEX-CEX paths for systematic returns." },
      { property: "og:title", content: "Ncore X — NASLAB" },
      { property: "og:description", content: "Cross-platform arbitrage engine covering DEX-DEX, CEX-CEX, and DEX-CEX paths for systematic returns." },
    ],
  }),
  component: () => <ComingSoon title="Ncore X" description="Cross-platform arbitrage engine covering DEX-DEX, CEX-CEX, and DEX-CEX paths for systematic returns." />,
});
