import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ReportShell } from "@/components/report-shell";
import { DataTable, Thead, Th, EmptyRow } from "@/components/portal-ui";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/reports/referral-rewards")({
  component: ReferralRewardsPage,
});

function ReferralRewardsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader title={t("nav.reportsReferral")} />
      <ReportShell title={t("pages.reportsReferral.transactionsTitle")}>
        <DataTable minWidth={640}>
          <colgroup>
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/4" />
          </colgroup>
          <Thead>
            <Th>{t("pages.deposit.tableHeaders.date")}</Th>
            <Th>{t("pages.profile.memberId")}</Th>
            <Th>{t("pages.reportsReferral.tableHeaders.referralRate")}</Th>
            <Th>{t("pages.withdrawal.confirm.amount")}</Th>
          </Thead>
          <tbody>
            <EmptyRow colSpan={4}>{t("pages.transactions.empty.noTransactions")}</EmptyRow>
          </tbody>
        </DataTable>
      </ReportShell>
    </div>
  );
}
