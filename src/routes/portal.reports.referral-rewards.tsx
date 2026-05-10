import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { RewardsOverviewPanel } from "@/components/rewards-overview-panel";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/reports/referral-rewards")({
  component: ReferralRewardsPage,
});

function ReferralRewardsPage() {
  const { t } = useTranslation();

  const headers = [
    t("pages.deposit.tableHeaders.date"),
    t("pages.profile.memberId"),
    t("pages.reportsReferral.tableHeaders.referralRate"),
    t("pages.withdrawal.confirm.amount"),
  ];
  return (
    <div>
      <PageHeader title={t("nav.reportsReferral")} />
      <RewardsOverviewPanel />
      <ReportShell
        title={t("pages.reportsReferral.transactionsTitle")}
        filterTextLabel={t("pages.profile.memberId")}
        getExportRows={() => ({ headers, rows: [], filename: "referral-rewards" })}
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
