import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/reports/par-rank-rewards")({
  component: ParRankRewardsPage,
});

function ParRankRewardsPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t("nav.reportsParRank")} />
      <ReportShell title={t("pages.reportsParRank.transactionsTitle")}>
        <DataTable minWidth={640}>
          <colgroup>
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/4" />
          </colgroup>
          <Thead>
            <Th>{t("pages.deposit.tableHeaders.date")}</Th>
            <Th>{t("pages.reportsTeam.tableHeaders.amount")}</Th>
            <Th>{t("pages.reportsTeam.tableHeaders.rate")}</Th>
            <Th>{t("pages.reportsParRank.tableHeaders.rank")}</Th>
          </Thead>
          <tbody>
            <EmptyRow colSpan={4}>{t("pages.transactions.empty.noTransactions")}</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
