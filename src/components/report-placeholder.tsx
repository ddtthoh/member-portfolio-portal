import { PageHeader } from "@/components/page-header";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";

export function ReportPlaceholder({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <ReportShell title={`${title} Transactions`}>
        <DataTable minWidth={640}>
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[20%]" />
            <col className="w-[15%]" />
            <col className="w-[35%]" />
          </colgroup>
          <Thead>
            <Th>Date</Th>
            <Th>​division roi</Th>
            <Th>Referral rates</Th>
            <Th>Member ID</Th>
          </Thead>
          <tbody>
            <EmptyRow colSpan={4}>No transactions yet.</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
