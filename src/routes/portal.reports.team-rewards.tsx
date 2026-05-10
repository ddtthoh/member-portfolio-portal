import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { RewardsOverviewPanel } from "@/components/rewards-overview-panel";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";

export const Route = createFileRoute("/portal/reports/team-rewards")({
  component: TeamRewardsPage,
});

function TeamRewardsPage() {
  const { t } = useTranslation();

  const headers = [
    t("pages.reportsTeam.tableHeaders.date"),
    t("pages.reportsTeam.tableHeaders.memberId"),
    t("pages.reportsTeam.tableHeaders.level"),
    t("pages.reportsTeam.tableHeaders.divisionRoi"),
    t("pages.reportsTeam.tableHeaders.rate"),
    t("pages.reportsTeam.tableHeaders.amount"),
  ];
  return (
    <div>
      <PageHeader title={t("nav.reportsTeam")} />
      <RewardsOverviewPanel />
      <ReportShell
        title={t("pages.reportsTeam.reportTitle")}
        filterTextLabel={t("components.reportShell.memberId")}
        getExportRows={() => ({ headers, rows: [], filename: "team-rewards" })}
      >
        <DataTable minWidth={960}>
          <colgroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <col key={i} className="w-1/6" />
            ))}
          </colgroup>
          <Thead>
            {headers.map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </Thead>
          <tbody>
            <EmptyRow colSpan={6}>{t("pages.transactions.empty.noTransactions")}</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
