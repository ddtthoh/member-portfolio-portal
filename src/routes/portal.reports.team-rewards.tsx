import { createFileRoute } from "@tanstack/react-router";
import { ReportPlaceholder } from "@/components/report-placeholder";

export const Route = createFileRoute("/portal/reports/team-rewards")({
  component: () => <ReportPlaceholder title="Team Rewards" />,
});
