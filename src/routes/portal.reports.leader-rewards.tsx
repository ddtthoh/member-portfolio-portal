import { createFileRoute } from "@tanstack/react-router";
import { ReportPlaceholder } from "@/components/report-placeholder";

export const Route = createFileRoute("/portal/reports/leader-rewards")({
  component: () => <ReportPlaceholder title="Leader Rewards" />,
});
