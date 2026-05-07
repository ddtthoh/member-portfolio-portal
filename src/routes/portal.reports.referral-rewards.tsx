import { createFileRoute } from "@tanstack/react-router";
import { ReportPlaceholder } from "@/components/report-placeholder";

export const Route = createFileRoute("/portal/reports/referral-rewards")({
  component: () => <ReportPlaceholder title="Referral Rewards" />,
});
