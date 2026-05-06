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
      <PageHeader 
        eyebrow="Portfolio" 
        title={<div className="flex flex-col gap-1">
          <div>Total participation amount : $50,000</div>
          <div className="text-xl opacity-80 font-sans">Participation days : 54 days</div>
        </div>}
        description=""
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="liquid-glass overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-border/60 text-[10px] uppercase tracking-[0.18em] text-gold">
                  <th className="px-5 py-3.5 text-left font-medium">Date</th>
                  <th className="px-5 py-3.5 text-left font-medium">Staking Plan</th>
                  <th className="px-5 py-3.5 text-left font-medium">Participation Date</th>
                  <th className="px-5 py-3.5 text-left font-medium">Participation Amount</th>
                  <th className="px-5 py-3.5 text-left font-medium">ROI % Min</th>
                  <th className="px-5 py-3.5 text-left font-medium">ROI % Max</th>
                  <th className="px-5 py-3.5 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                      No staking plan yet.
                    </td>
                  </tr>
                )}
                {rows.map((h) => {
                  const value = Number(h.quantity) * Number(h.current_price);
                  return (
                    <tr key={h.id} className="border-t border-border/40">
                      <td className="px-5 py-3.5 text-left font-mono text-xs text-muted-foreground">—</td>
                      <td className="px-5 py-3.5 text-left font-medium">{h.asset_name}</td>
                      <td className="px-5 py-3.5 text-left font-mono text-xs text-muted-foreground">—</td>
                      <td className="px-5 py-3.5 text-left font-mono text-xs">{fmt(value)}</td>
                      <td className="px-5 py-3.5 text-left font-mono text-xs">{fmt(Number(h.avg_cost))}</td>
                      <td className="px-5 py-3.5 text-left font-mono text-xs">{fmt(Number(h.current_price))}</td>
                      <td className="px-5 py-3.5 text-left">
                        <span className="inline-flex items-center rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-success">
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
