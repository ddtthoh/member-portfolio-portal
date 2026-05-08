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
            {Array.from({ length: 6 }).map((_, i) => (
              <col key={i} className="w-1/6" />
            ))}
          </colgroup>
          <Thead>
            <Th>Date</Th>
            <Th>amount</Th>
            <Th>Level</Th>
            <Th>amount</Th>
            <Th>Percentage</Th>
            <Th>​division roi</Th>
          </Thead>
          <tbody>
            <EmptyRow colSpan={6}>No transactions yet.</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
