import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";

export const Route = createFileRoute("/portal/reports/team-rewards")({
  component: TeamRewardsPage,
});

function TeamRewardsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader title={t("nav.reportsTeam")} />
      <ReportShell title={t("pages.reportsTeam.reportTitle")}>
        <DataTable minWidth={960}>
          <colgroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <col key={i} className="w-1/6" />
            ))}
          </colgroup>
          <Thead>
            <Th>{t("pages.reportsTeam.tableHeaders.date")}</Th>
            <Th>{t("pages.reportsTeam.tableHeaders.memberId")}</Th>
            <Th>{t("pages.reportsTeam.tableHeaders.level")}</Th>
            <Th>{t("pages.reportsTeam.tableHeaders.divisionRoi")}</Th>
            <Th>{t("pages.reportsTeam.tableHeaders.rate")}</Th>
            <Th>{t("pages.reportsTeam.tableHeaders.amount")}</Th>
          </Thead>
          <tbody>
            <EmptyRow colSpan={6}>{t("pages.transactions.empty.noTransactions")}</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
