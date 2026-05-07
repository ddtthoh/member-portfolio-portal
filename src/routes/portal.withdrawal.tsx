import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpFromLine, Building2, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";

export const Route = createFileRoute("/portal/withdrawal")({
  component: WithdrawalPage,
});

function WithdrawalPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader eyebrow={t("pages.withdrawal.eyebrow")} title={t("pages.withdrawal.title")} description={t("pages.withdrawal.description")} />

      <div className="grid gap-4 md:grid-cols-2">
        <SpotlightCard className="liquid-glass rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2 text-gold">
            <Building2 className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-[0.2em]">Payout Account</span>
          </div>
          <dl className="space-y-3 text-sm">
            <Row label="Beneficiary" value="On file" />
            <Row label="Bank" value="JP Morgan Chase, NY" />
            <Row label="SWIFT / BIC" value="CHASUS33" />
            <Row label="Account" value="•••• 7392" />
            <Row label="Currency" value="USD" />
            <Row label="Daily Limit" value="$500,000" />
          </dl>
        </SpotlightCard>

        <SpotlightCard className="liquid-glass rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2 text-gold">
            <ArrowUpFromLine className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-[0.2em]">Notes</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Minimum withdrawal: $1,000 USD equivalent.</li>
            <li>• Requests submitted before 2pm EST settle same day.</li>
            <li>• Wires to a new account require advisor verification.</li>
            <li>• Contact your advisor to add a new payout destination.</li>
          </ul>
        </SpotlightCard>
      </div>
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
