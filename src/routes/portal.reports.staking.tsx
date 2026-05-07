import { createFileRoute } from "@tanstack/react-router";
import { ReportPlaceholder } from "@/components/report-placeholder";

export const Route = createFileRoute("/portal/reports/participation")({
  component: () => <ReportPlaceholder title="Staking" />,
});
