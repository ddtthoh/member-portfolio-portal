import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/marketing/coming-soon";

export const Route = createFileRoute("/main/collaboration")({
  head: () => ({
    meta: [
      { title: "Collaboration — NASLAB" },
      { name: "description", content: "We collaborate with partners who value execution quality, technical rigor, and long-term system building." },
      { property: "og:title", content: "Collaboration — NASLAB" },
      { property: "og:description", content: "We collaborate with partners who value execution quality, technical rigor, and long-term system building." },
    ],
  }),
  component: () => <ComingSoon title="Collaboration" description="We collaborate with partners who value execution quality, technical rigor, and long-term system building." />,
});
