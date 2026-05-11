import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const Route = createFileRoute("/main/ncore/basic")({
  head: () => ({
    meta: [
      { title: "Ncore 2.0 — Basic — NASLAB" },
      { name: "description", content: "Foundational logic of on-chain execution: visibility, ordering, and execution paths in a public environment." },
      { property: "og:title", content: "Ncore 2.0 — Basic — NASLAB" },
      { property: "og:description", content: "Foundational logic of on-chain execution: visibility, ordering, and execution paths in a public environment." },
    ],
  }),
  component: () => <ComingSoon title="Ncore 2.0 — Basic" description="Foundational logic of on-chain execution: visibility, ordering, and execution paths in a public environment." />,
});
