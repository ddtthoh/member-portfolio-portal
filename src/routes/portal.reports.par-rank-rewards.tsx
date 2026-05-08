import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";

export const Route = createFileRoute("/portal/reports/par-rank-rewards")({
  component: ParRankRewardsPage,
});

function ParRankRewardsPage() {
  return (
    <div>
      <PageHeader title="Par Rank Rewards" />
      <ReportShell title="Par Rank Rewards Transactions">
        <DataTable minWidth={640}>
          <colgroup>
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/4" />
          </colgroup>
          <Thead>
            <Th>Date</Th>
            <Th>Rank</Th>
            <Th>Percentage</Th>
            <Th>Amount</Th>
          </Thead>
          <tbody>
            <EmptyRow colSpan={4}>No transactions yet.</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
