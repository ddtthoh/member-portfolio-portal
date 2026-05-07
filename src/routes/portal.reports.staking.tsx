import { createFileRoute } from "@tanstack/react-router";
import { ReportPlaceholder } from "@/components/report-placeholder";

export const Route = createFileRoute("/portal/reports/staking")({
  component: () => <ReportPlaceholder title="Staking" />,
});
