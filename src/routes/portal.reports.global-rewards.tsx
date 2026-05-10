import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";
import { SpotlightCard } from "@/components/spotlight-card";
import { PLCalendar } from "@/components/pl-calendar";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/reports/global-rewards")({
  component: GlobalRewardsPage,
});

function GlobalRewardsPage() {
  const { t } = useTranslation();
  const headers = [
    t("pages.reportsTeam.tableHeaders.date"),
    "Rank",
    "Share count",
  ];
  return (
    <div>
      <PageHeader title={t("nav.reportsGlobal", "Global Rewards")} />
      <ReportShell
        title={t("nav.reportsGlobal", "Global Rewards")}
        getExportRows={() => ({ headers, rows: [], filename: "global-rewards" })}
      >
        <DataTable minWidth={640}>
          <colgroup>
            <col className="w-1/3" />
            <col className="w-1/3" />
            <col className="w-1/3" />
          </colgroup>
          <Thead>
            {headers.map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </Thead>
          <tbody>
            <EmptyRow colSpan={3}>{t("pages.transactions.empty.noTransactions")}</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
