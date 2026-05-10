import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { RewardsOverviewPanel } from "@/components/rewards-overview-panel";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/reports/par-rank-rewards")({
  component: ParRankRewardsPage,
});

function ParRankRewardsPage() {
  const { t } = useTranslation();
  const headers = [
    t("pages.deposit.tableHeaders.date"),
    t("pages.reportsTeam.tableHeaders.amount"),
    t("pages.reportsTeam.tableHeaders.rate"),
    t("pages.reportsParRank.tableHeaders.rank"),
  ];
  return (
    <div>
      <PageHeader title={t("nav.reportsParRank")} />
      <RewardsOverviewPanel />
      <ReportShell
        title={t("pages.reportsParRank.transactionsTitle")}
        filterTextLabel={t("pages.reportsParRank.tableHeaders.rank")}
        getExportRows={() => ({ headers, rows: [], filename: "par-rank-rewards" })}
      >
        <DataTable minWidth={640}>
          <colgroup>
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/4" />
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
