import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/transactions")({
  component: TransactionsPage,
});

type Tx = {
  id: string; type: string; asset: string | null; amount: number;
  quantity: number | null; price: number | null; status: string; occurred_at: string;
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function TransactionsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rows, setRows] = useState<Tx[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("transactions").select("*").eq("user_id", user.id).order("occurred_at", { ascending: false })
      .then(({ data }) => setRows((data ?? []) as Tx[]));
  }, [user]);

  return (
    <div>
      <PageHeader eyebrow={t("pages.transactions.eyebrow")} title={t("pages.transactions.title")} description={t("pages.transactions.description")} />

      <div className="liquid-glass overflow-hidden rounded-xl">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Type</th>
              <th className="px-5 py-3 text-left">Asset</th>
              <th className="px-5 py-3 text-right">Quantity</th>
              <th className="px-5 py-3 text-right">Price</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">No transactions yet.</td></tr>
            )}
            {rows.map((t) => (
              <tr key={t.id} className="border-b border-border/50 last:border-0">
                <td className="px-5 py-4 text-muted-foreground">{new Date(t.occurred_at).toLocaleDateString()}</td>
                <td className="px-5 py-4 capitalize">{t.type}</td>
                <td className="px-5 py-4">{t.asset ?? "—"}</td>
                <td className="px-5 py-4 text-right">{t.quantity ?? "—"}</td>
                <td className="px-5 py-4 text-right">{t.price != null ? fmt(Number(t.price)) : "—"}</td>
                <td className="px-5 py-4 text-right font-medium">{fmt(Number(t.amount))}</td>
                <td className="px-5 py-4 text-right">
                  <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted-foreground">
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
