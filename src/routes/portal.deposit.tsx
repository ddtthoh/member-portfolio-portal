import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/deposit")({
  component: DepositPage,
});

function DepositPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader eyebrow={t("pages.deposit.eyebrow")} title={t("pages.deposit.title")} description={t("pages.deposit.description")} />
    </div>
  );
}
