import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const Route = createFileRoute("/main/careers")({
  head: () => ({
    meta: [
      { title: "Careers — NASLAB" },
      { name: "description", content: "Join Naslab — we're building technology-driven systems for fast-moving digital markets, looking for people who care about execution, precision, and impact." },
      { property: "og:title", content: "Careers — NASLAB" },
      { property: "og:description", content: "Join Naslab — we're building technology-driven systems for fast-moving digital markets, looking for people who care about execution, precision, and impact." },
    ],
  }),
  component: () => <ComingSoon title="Careers" description="Join Naslab — we're building technology-driven systems for fast-moving digital markets, looking for people who care about execution, precision, and impact." />,
});
