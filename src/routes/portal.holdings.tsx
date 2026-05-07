import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { MetricValue } from "@/components/metric-value";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { SpotlightCard } from "@/components/spotlight-card";

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
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rows, setRows] = useState<Holding[]>([]);
  const [showAmount, setShowAmount] = useState(true);
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
    <div className="space-y-6">
      <PageHeader eyebrow={t("pages.holdings.eyebrow")} title={t("pages.holdings.title")} description={t("pages.holdings.description")} />

      <div className="grid gap-4 sm:grid-cols-2">
        <SpotlightCard className="liquid-glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.2em] text-gold">
              Total Participation Amount
            </div>
            <button
              type="button"
              onClick={() => setShowAmount((s) => !s)}
              aria-label={showAmount ? "Hide amount" : "Show amount"}
              className="text-gold transition-colors hover:text-gold/80"
            >
              {showAmount ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-2 text-3xl">
            {showAmount ? (
              <MetricValue value={50000} prefix="$" decimals={0} size="lg" />
            ) : (
              <span className="font-light tabular-nums tracking-[-0.04em] text-gold">******</span>
            )}
          </div>
        </SpotlightCard>
        <SpotlightCard className="liquid-glass rounded-xl p-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold">
            Participation Days
          </div>
          <div className="mt-2">
            <MetricValue value={54} decimals={0} size="lg" unit="days" />
          </div>
        </SpotlightCard>
      </div>

      <SpotlightCard className="liquid-glass overflow-hidden rounded-xl">
        <div className="border-b border-border/60 px-6 py-4">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-gold">
            Staking Plans
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-[10px] uppercase tracking-[0.18em] text-gold">
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium">Staking Plan</th>
                <th className="px-6 py-3 text-left font-medium">Participation Date</th>
                <th className="px-6 py-3 text-right font-medium">Participation Amount</th>
                <th className="px-6 py-3 text-right font-medium">Min Monthly Rate</th>
                <th className="px-6 py-3 text-right font-medium">Max Monthly Rate</th>
                <th className="px-6 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-gold">
                    No staking plan yet.
                  </td>
                </tr>
              )}
              {rows.map((h) => {
                const value = Number(h.quantity) * Number(h.current_price);
                return (
                  <tr key={h.id} className="border-t border-border/40 transition-colors hover:bg-muted/20">
                    <td className="px-6 py-4 text-left font-light text-sm tabular-nums tracking-[-0.02em] text-gold">—</td>
                    <td className="px-6 py-4 text-left text-sm font-medium text-gold">{h.asset_name}</td>
                    <td className="px-6 py-4 text-left font-light text-sm tabular-nums tracking-[-0.02em] text-gold">—</td>
                    <td className="px-6 py-4 text-right font-light text-sm tabular-nums tracking-[-0.02em] text-gold">{fmt(value)}</td>
                    <td className="px-6 py-4 text-right font-light text-sm tabular-nums tracking-[-0.02em] text-gold">{fmt(Number(h.avg_cost))}</td>
                    <td className="px-6 py-4 text-right font-light text-sm tabular-nums tracking-[-0.02em] text-gold">{fmt(Number(h.current_price))}</td>
                    <td className="px-6 py-4 text-center">
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
      </SpotlightCard>

      <div className="flex justify-start">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Request Full Refund</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Full Refund</DialogTitle>
              <DialogDescription>
                Are you sure you want to request a full refund? Our team will review your request and contact you shortly.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={() => alert("Refund request submitted")}>Confirm Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
