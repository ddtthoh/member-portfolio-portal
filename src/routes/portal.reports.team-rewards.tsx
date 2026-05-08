import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";

export const Route = createFileRoute("/portal/reports/team-rewards")({
  component: TeamRewardsPage,
});

function TeamRewardsPage() {
  return (
    <div>
      <PageHeader title="Team Rewards" />
      <ReportShell title="Team Rewards Report">
        <DataTable minWidth={720}>
          <colgroup>
            <col className="w-auto" />
            <col className="w-px" />
            <col className="w-px" />
            <col className="w-px" />
            <col className="w-px" />
            <col className="w-px" />
          </colgroup>
          <Thead>
            <Th>Date</Th>
            <Th className="whitespace-nowrap">Member ID</Th>
            <Th className="whitespace-nowrap">Level</Th>
            <Th className="whitespace-nowrap">division roi</Th>
            <Th className="whitespace-nowrap">Percentage</Th>
            <Th className="whitespace-nowrap">amount</Th>
          </Thead>
          <tbody>
            <EmptyRow colSpan={6}>No transactions yet.</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
