import { createFileRoute } from "@tanstack/react-router";
import { Building2, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";

export const Route = createFileRoute("/portal/deposit")({
  component: DepositPage,
});

function DepositPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader eyebrow={t("pages.deposit.eyebrow")} title={t("pages.deposit.title")} description={t("pages.deposit.description")} />

      <SpotlightCard className="liquid-glass rounded-xl p-6">
        <div className="mb-4 flex items-center gap-2 text-gold">
          <Building2 className="h-4 w-4" />
          <span className="text-[11px] uppercase tracking-[0.2em]">Wire Instructions</span>
        </div>
        <dl className="space-y-3 text-sm">
          <Row label="Beneficiary" value="Ivory & Vale Private Wealth" />
          <Row label="Bank" value="State Street Bank, NY" />
          <Row label="SWIFT / BIC" value="SBOSUS33" />
          <Row label="Routing (ABA)" value="011000028" />
          <Row label="Account" value="•••• 4821" />
          <Row label="Reference" value="Your account number" />
        </dl>
      </SpotlightCard>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-2">
      <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-2 font-sans text-sm">
        {value}
        <Copy className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-gold" />
      </dd>
    </div>
  );
}
