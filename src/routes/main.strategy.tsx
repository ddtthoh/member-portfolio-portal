import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const Route = createFileRoute("/main/strategy")({
  head: () => ({
    meta: [
      { title: "Strategy — NASLAB" },
      { name: "description", content: "A long-term roadmap outlining Naslab's evolution from automated trading systems to a scalable, global digital finance infrastructure." },
      { property: "og:title", content: "Strategy — NASLAB" },
      { property: "og:description", content: "A long-term roadmap outlining Naslab's evolution from automated trading systems to a scalable, global digital finance infrastructure." },
    ],
  }),
  component: () => <ComingSoon title="Strategy" description="A long-term roadmap outlining Naslab's evolution from automated trading systems to a scalable, global digital finance infrastructure." />,
});
