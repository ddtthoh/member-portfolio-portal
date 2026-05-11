import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const Route = createFileRoute("/main/ncore/features")({
  head: () => ({
    meta: [
      { title: "Ncore 2.0 — Features — NASLAB" },
      { name: "description", content: "Real-time execution, gas optimization, and customizable risk controls for continuous, secure value capture." },
      { property: "og:title", content: "Ncore 2.0 — Features — NASLAB" },
      { property: "og:description", content: "Real-time execution, gas optimization, and customizable risk controls for continuous, secure value capture." },
    ],
  }),
  component: () => <ComingSoon title="Ncore 2.0 — Features" description="Real-time execution, gas optimization, and customizable risk controls for continuous, secure value capture." />,
});
