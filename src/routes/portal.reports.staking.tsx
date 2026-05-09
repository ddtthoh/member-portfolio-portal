import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/reports/staking")({
  component: StakingReportPage,
});

function StakingReportPage() {
  const { t } = useTranslation();

  const headers = [
    t("pages.deposit.tableHeaders.date"),
    t("pages.reportsStaking.tableHeaders.transactionNumber"),
    t("pages.reportsStaking.tableHeaders.amount"),
    t("pages.reportsStaking.tableHeaders.stakingPlan"),
  ];
  return (
    <div>
      <PageHeader title={t("nav.reportsParticipation")} />
      <ReportShell
        title={t("pages.reportsStaking.transactionsTitle")}
        filterTextLabel={t("pages.reportsStaking.tableHeaders.transactionNumber")}
        getExportRows={() => ({ headers, rows: [], filename: "staking" })}
      >
        <DataTable minWidth={760}>
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[34%]" />
            <col className="w-[22%]" />
            <col className="w-[22%]" />
          </colgroup>
          <Thead>
            {headers.map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </Thead>
          <tbody>
            <EmptyRow colSpan={4}>{t("pages.transactions.empty.noTransactions")}</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
