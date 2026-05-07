import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";

export const Route = createFileRoute("/portal/reports/leader-rewards")({
  component: LeaderRewardsPage,
});

function LeaderRewardsPage() {
  return (
    <div>
      <PageHeader title="Leader Rewards" />
      <ReportShell title="Leader Rewards Transactions">
        <DataTable minWidth={760}>
          <colgroup>
            {Array.from({ length: 5 }).map((_, i) => (
              <col key={i} className="w-1/5" />
            ))}
          </colgroup>
          <Thead>
            <Th>Date</Th>
            <Th>Referral rates</Th>
            <Th>Percentage</Th>
            <Th>Contributed by Referral rates</Th>
            <Th>Total Subscription Count</Th>
          </Thead>
          <tbody>
            <EmptyRow colSpan={5}>No transactions yet.</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
