import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export const Route = createFileRoute("/portal/holdings")({
  component: HoldingsPage,
});

type Holding = {
  id: string; asset_name: string; ticker: string | null; asset_class: string;
  quantity: number; avg_cost: number; current_price: number; currency: string;
};

const COLORS = ["oklch(0.78 0.13 80)", "oklch(0.55 0.13 155)", "oklch(0.6 0.1 250)", "oklch(0.65 0.15 30)", "oklch(0.5 0.05 280)"];

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function HoldingsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Holding[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("holdings").select("*").eq("user_id", user.id).order("asset_name")
      .then(({ data }) => setRows((data ?? []) as Holding[]));
  }, [user]);

  const allocation = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((h) => {
      const v = Number(h.quantity) * Number(h.current_price);
      map[h.asset_class] = (map[h.asset_class] ?? 0) + v;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [rows]);

  return (
    <div>
      <PageHeader eyebrow="Portfolio" title="Holdings & Allocation"
        description="A complete view of every position and your exposure across asset classes." />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="liquid-glass overflow-hidden rounded-xl">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">DATE</th>
                <th className="px-5 py-3 text-left">STAKING PLAN</th>
                <th className="px-5 py-3 text-left">PARTICIPATION DATE</th>
                <th className="px-5 py-3 text-right">PARTICIPATION AMOUNT</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                  No holdings on file. Your advisor will populate this shortly.
                </td></tr>
              )}
              {rows.map((h) => {
                const value = Number(h.quantity) * Number(h.current_price);
                const pl = (Number(h.current_price) - Number(h.avg_cost)) * Number(h.quantity);
                return (
                  <tr key={h.id} className="border-b border-border/50 last:border-0">
                    <td className="px-5 py-4">
                      <div className="font-medium">{h.asset_name}</div>
                      {h.ticker && <div className="text-xs text-muted-foreground">{h.ticker}</div>}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{h.asset_class}</td>
                    <td className="px-5 py-4 text-right">{Number(h.quantity).toLocaleString()}</td>
                    <td className="px-5 py-4 text-right">{fmt(Number(h.avg_cost))}</td>
                    <td className="px-5 py-4 text-right">{fmt(Number(h.current_price))}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="font-medium">{fmt(value)}</div>
                      <div className={`text-xs ${pl >= 0 ? "text-success" : "text-destructive"}`}>
                        {pl >= 0 ? "+" : ""}{fmt(pl)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="liquid-glass rounded-xl p-6">
          <div className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Allocation</div>
          {allocation.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No allocation data</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} stroke="none">
                    {allocation.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 4 }}
                    formatter={(v: number) => fmt(v)}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
