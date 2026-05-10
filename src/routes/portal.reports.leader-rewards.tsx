import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";
import { SpotlightCard } from "@/components/spotlight-card";
import { PLCalendar } from "@/components/pl-calendar";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/reports/leader-rewards")({
  component: LeaderRewardsPage,
});

function LeaderRewardsPage() {
  const { t } = useTranslation();
  const headers = [
    t("pages.reportsTeam.tableHeaders.date"),
    "Division staked amount",
    t("pages.reportsTeam.tableHeaders.rate"),
    "Amount",
  ];
  return (
    <div>
      <PageHeader title={t("nav.reportsLeader")} />
      <ReportShell
        title={t("pages.reportsLeader.transactionsTitle")}
        filterTextLabel={t("pages.reportsLeader.tableHeaders.contributedBy")}
        getExportRows={() => ({ headers, rows: [], filename: "leader-rewards" })}
      >
        <DataTable minWidth={760}>
          <colgroup>
            {Array.from({ length: 4 }).map((_, i) => (
              <col key={i} className="w-1/4" />
            ))}
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
