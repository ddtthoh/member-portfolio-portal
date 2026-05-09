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

  return (
    <div>
      <PageHeader title={t("nav.reportsParticipation")} />
      <ReportShell title={t("pages.reportsStaking.transactionsTitle")}>
        <DataTable minWidth={760}>
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[34%]" />
            <col className="w-[22%]" />
            <col className="w-[22%]" />
          </colgroup>
          <Thead>
            <Th>{t("pages.deposit.tableHeaders.date")}</Th>
            <Th>{t("pages.reportsStaking.tableHeaders.transactionNumber")}</Th>
            <Th>{t("pages.reportsStaking.tableHeaders.amount")}</Th>
            <Th>{t("pages.reportsStaking.tableHeaders.stakingPlan")}</Th>
          </Thead>
          <tbody>
            <EmptyRow colSpan={4}>{t("pages.transactions.empty.noTransactions")}</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
