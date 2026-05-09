import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/reports/leader-rewards")({
  component: LeaderRewardsPage,
});

function LeaderRewardsPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t("nav.reportsLeader")} />
      <ReportShell title={t("pages.reportsLeader.transactionsTitle")}>
        <DataTable minWidth={760}>
          <colgroup>
            {Array.from({ length: 5 }).map((_, i) => (
              <col key={i} className="w-1/5" />
            ))}
          </colgroup>
          <Thead>
            <Th>{t("pages.reportsTeam.tableHeaders.date")}</Th>
            <Th>{t("pages.reportsTeam.tableHeaders.amount")}</Th>
            <Th>{t("pages.reportsTeam.tableHeaders.rate")}</Th>
            <Th>{t("pages.reportsLeader.tableHeaders.contributedBy")}</Th>
            <Th>{t("pages.reportsLeader.tableHeaders.totalSubscriptionCount")}</Th>
          </Thead>
          <tbody>
            <EmptyRow colSpan={5}>{t("pages.transactions.empty.noTransactions")}</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
