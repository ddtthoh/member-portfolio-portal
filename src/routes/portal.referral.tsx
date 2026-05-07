import { createFileRoute } from "@tanstack/react-router";
import { Users, Gift, Copy } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";

export const Route = createFileRoute("/portal/referral")({
  component: ReferralPage,
});

function ReferralPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const code = (user?.id ?? "").slice(0, 8).toUpperCase() || "—";
  const link = `https://members.example.com/join?ref=${code}`;

  return (
    <div>
      <PageHeader eyebrow={t("pages.referral.eyebrow")} title={t("pages.referral.title")} description={t("pages.referral.description")} />

      <div className="grid gap-4 md:grid-cols-2">
        <SpotlightCard className="liquid-glass rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-2 text-gold">
            <Users className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-[0.2em]">Your Code</span>
          </div>
          <dl className="space-y-3 text-sm">
            <Row label="Referral Code" value={code} />
            <Row label="Invite Link" value={link} />
            <Row label="Tier" value="Gold" />
            <Row label="Active Referrals" value="0" />
            <Row label="Lifetime Rebate" value="$0.00" />
          </dl>
        </SpotlightCard>

        <SpotlightCard className="liquid-glass rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-2 text-gold">
            <Gift className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-[0.2em]">Program Terms</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 1.0% rebate on first-year management fees per funded referral.</li>
            <li>• Referred accounts must meet the $25,000 minimum to qualify.</li>
            <li>• Rebates settle quarterly to your portfolio cash balance.</li>
            <li>• Contact your advisor to upgrade to Platinum tier.</li>
          </ul>
        </SpotlightCard>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-2">
      <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-2 truncate font-sans text-sm">
        <span className="truncate">{value}</span>
        <Copy className="h-3 w-3 shrink-0 cursor-pointer text-muted-foreground hover:text-gold" />
      </dd>
    </div>
  );
}
