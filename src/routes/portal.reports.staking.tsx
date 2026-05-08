import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";

export const Route = createFileRoute("/portal/reports/staking")({
  component: StakingReportPage,
});

function StakingReportPage() {
  return (
    <div>
      <PageHeader title="Staking" />
      <ReportShell title="Staking Transactions">
        <DataTable minWidth={760}>
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[34%]" />
            <col className="w-[22%]" />
            <col className="w-[22%]" />
          </colgroup>
          <Thead>
            <Th>Date</Th>
            <Th>transaction number</Th>
            <Th>amount</Th>
            <Th>Package</Th>
          </Thead>
          <tbody>
            <EmptyRow colSpan={4}>No transactions yet.</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
