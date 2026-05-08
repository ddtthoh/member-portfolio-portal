import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";

export const Route = createFileRoute("/portal/reports/referral-rewards")({
  component: ReferralRewardsPage,
});

function ReferralRewardsPage() {
  return (
    <div>
      <PageHeader title="Referral Rewards" />
      <ReportShell title="Referral Rewards Transactions">
        <DataTable minWidth={640}>
          <colgroup>
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/4" />
          </colgroup>
          <Thead>
            <Th>Date</Th>
            <Th>Member ID</Th>
            <Th>referral rate</Th>
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
