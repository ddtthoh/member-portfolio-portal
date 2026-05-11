import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const Route = createFileRoute("/main/ncore")({
  head: () => ({
    meta: [
      { title: "Ncore — NASLAB" },
      { name: "description", content: "The Ncore product family — predictive MEV trading, intelligent cross-platform arbitrage, and the NCT token ecosystem." },
      { property: "og:title", content: "Ncore — NASLAB" },
      { property: "og:description", content: "The Ncore product family — predictive MEV trading, intelligent cross-platform arbitrage, and the NCT token ecosystem." },
    ],
  }),
  component: () => <ComingSoon title="Ncore" description="The Ncore product family — predictive MEV trading, intelligent cross-platform arbitrage, and the NCT token ecosystem." />,
});
