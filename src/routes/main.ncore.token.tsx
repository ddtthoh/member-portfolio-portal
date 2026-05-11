import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const Route = createFileRoute("/main/ncore/token")({
  head: () => ({
    meta: [
      { title: "NCT Token — NASLAB" },
      { name: "description", content: "Ncore Token (NCT) — the exclusive settlement, access, and incentive layer of the Ncore ecosystem." },
      { property: "og:title", content: "NCT Token — NASLAB" },
      { property: "og:description", content: "Ncore Token (NCT) — the exclusive settlement, access, and incentive layer of the Ncore ecosystem." },
    ],
  }),
  component: () => <ComingSoon title="NCT Token" description="Ncore Token (NCT) — the exclusive settlement, access, and incentive layer of the Ncore ecosystem." />,
});
