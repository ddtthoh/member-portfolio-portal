import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const Route = createFileRoute("/main/ncore/trading")({
  head: () => ({
    meta: [
      { title: "Ncore 2.0 — Trading — NASLAB" },
      { name: "description", content: "Mempool monitoring, sandwich execution, and optimized transaction ordering before the market reacts." },
      { property: "og:title", content: "Ncore 2.0 — Trading — NASLAB" },
      { property: "og:description", content: "Mempool monitoring, sandwich execution, and optimized transaction ordering before the market reacts." },
    ],
  }),
  component: () => <ComingSoon title="Ncore 2.0 — Trading" description="Mempool monitoring, sandwich execution, and optimized transaction ordering before the market reacts." />,
});
