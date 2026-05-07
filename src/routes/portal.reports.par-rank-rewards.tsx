import { createFileRoute } from "@tanstack/react-router";
import { ReportPlaceholder } from "@/components/report-placeholder";

export const Route = createFileRoute("/portal/reports/par-rank-rewards")({
  component: () => <ReportPlaceholder title="Par Rank Rewards" />,
});
