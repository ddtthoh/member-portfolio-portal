import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/portal/staking")({
  head: () => ({
    meta: [
      { title: "Staking — Portal" },
      { name: "description", content: "Your active staking subscriptions." },
    ],
  }),
  component: StakingPage,
});

type Row = {
  id: string;
  started_at: string;
  stake_amount: number;
  total_profit: number;
  status: "active" | "terminated" | "upgraded";
  plan: { name: string; base_daily_rate: number } | null;
};

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
const fmtDate = (s: string) => s.slice(0, 10);

function StakingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("subscriptions")
      .select("id, started_at, stake_amount, total_profit, status, plan:staking_plans(name, base_daily_rate)")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .then(({ data }) => {
        setRows(((data ?? []) as unknown) as Row[]);
        setLoading(false);
      });
  }, [user]);

  return (
    <div>
      <PageHeader
        eyebrow={t("pages.participation.eyebrow")}
        title={t("pages.participation.title")}
        description={t("pages.participation.description")}
      />

      <SpotlightCard className="liquid-glass rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2 text-gold">
          <Users className="h-4 w-4" />
          <span className="text-[11px] uppercase tracking-[0.2em]">
            {t("pages.staking.activePrograms")}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("pages.staking.empty.noStakings")}
          </p>
        ) : (
          <div className="-mx-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.18em] text-gold">
                  <th className="px-4 py-3 text-left font-medium">Started</th>
                  <th className="px-4 py-3 text-left font-medium">Plan</th>
                  <th className="px-4 py-3 text-right font-medium">Stake</th>
                  <th className="px-4 py-3 text-right font-medium">Base Daily Rate</th>
                  <th className="px-4 py-3 text-right font-medium">Total Profit</th>
                  <th className="px-4 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border/40">
                    <td className="px-4 py-3.5 font-sans text-xs text-muted-foreground">
                      {fmtDate(r.started_at)}
                    </td>
                    <td className="px-4 py-3.5 font-medium">{r.plan?.name ?? "—"}</td>
                    <td className="px-4 py-3.5 text-right font-sans tabular-nums">
                      {fmtUSD(Number(r.stake_amount))}
                    </td>
                    <td className="px-4 py-3.5 text-right font-sans tabular-nums">
                      {r.plan ? `${(Number(r.plan.base_daily_rate) * 100).toFixed(2)}%` : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-right font-sans tabular-nums text-gold">
                      {fmtUSD(Number(r.total_profit))}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
}

function StatusBadge({ status }: { status: Row["status"] }) {
  const tone =
    status === "active"
      ? "border-success/40 bg-success/10 text-success"
      : status === "upgraded"
        ? "border-gold/40 bg-gold/10 text-gold"
        : "border-border bg-muted/30 text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] ${tone}`}>
      {status}
    </span>
  );
}
