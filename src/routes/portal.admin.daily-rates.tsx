import { useEffect, useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Shield, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/portal/admin/daily-rates")({
  component: AdminDailyRatesPage,
});

type Plan = {
  id: string;
  tier: "standard" | "advance" | "premium";
  variant: "lite" | "plus" | "pro";
  name: string;
  base_daily_rate: number;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

function AdminDailyRatesPage() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [rateDate, setRateDate] = useState<string>(todayISO());
  const [values, setValues] = useState<Record<string, string>>({});
  const [existing, setExisting] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin role
  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(Boolean(data)));
  }, [user]);

  // Load plans
  useEffect(() => {
    setLoading(true);
    supabase
      .from("staking_plans")
      .select("id, tier, variant, name, base_daily_rate")
      .eq("is_active", true)
      .order("stake_amount", { ascending: true })
      .then(({ data }) => {
        const list = (data ?? []) as Plan[];
        setPlans(list);
        // pre-fill with base rate
        const initial: Record<string, string> = {};
        for (const p of list) initial[p.id] = (Number(p.base_daily_rate) * 100).toFixed(4);
        setValues(initial);
        setLoading(false);
      });
  }, []);

  // Load existing rates for the date
  useEffect(() => {
    if (plans.length === 0) return;
    supabase
      .from("daily_rates")
      .select("plan_id, rate")
      .eq("rate_date", rateDate)
      .then(({ data }) => {
        const map: Record<string, number> = {};
        const next: Record<string, string> = {};
        for (const row of (data ?? []) as { plan_id: string; rate: number }[]) {
          map[row.plan_id] = Number(row.rate);
          next[row.plan_id] = (Number(row.rate) * 100).toFixed(4);
        }
        setExisting(map);
        setValues((v) => ({ ...v, ...next }));
      });
  }, [rateDate, plans]);

  if (authLoading || isAdmin === null) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <Shield className="mx-auto mb-3 h-8 w-8 text-destructive" />
        <p>Admin access required.</p>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    const rows = plans
      .map((p) => ({
        plan_id: p.id,
        rate_date: rateDate,
        rate: Number(values[p.id] ?? "") / 100,
        created_by: user.id,
      }))
      .filter((r) => Number.isFinite(r.rate) && r.rate >= 0);

    if (rows.length === 0) {
      toast.error("No valid rates");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("daily_rates")
      .upsert(rows, { onConflict: "plan_id,rate_date" });

    setSaving(false);
    if (error) {
      toast.error("Save failed", { description: error.message });
      return;
    }
    toast.success(`Saved ${rows.length} rates for ${rateDate}`);
    setExisting(Object.fromEntries(rows.map((r) => [r.plan_id, r.rate])));
  };

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Daily Trading Profit Rates"
        description="Set the daily rate for each staking plan. Cron applies these rates to all active subscriptions at 00:05 UTC."
      />

      <SpotlightCard className="liquid-glass rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-[0.22em] text-gold/70">
              Rate Date
            </label>
            <Input
              type="date"
              value={rateDate}
              onChange={(e) => setRateDate(e.target.value)}
              className="mt-1 w-44 border-gold/30 bg-card/50 text-foreground"
            />
          </div>
          <Button onClick={handleSave} disabled={saving} className="ml-auto">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Rates
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading plans...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.18em] text-gold">
                  <th className="px-4 py-3 text-left font-medium">Plan</th>
                  <th className="px-4 py-3 text-right font-medium">Base Rate</th>
                  <th className="px-4 py-3 text-right font-medium">Rate for {rateDate} (%)</th>
                  <th className="px-4 py-3 text-right font-medium">Existing</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.id} className="border-t border-border/40">
                    <td className="px-4 py-3.5 font-medium">{p.name}</td>
                    <td className="px-4 py-3.5 text-right text-muted-foreground tabular-nums">
                      {(Number(p.base_daily_rate) * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Input
                        type="number"
                        step="0.001"
                        min="0"
                        value={values[p.id] ?? ""}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [p.id]: e.target.value }))
                        }
                        className="ml-auto w-28 border-gold/30 bg-card/50 text-right tabular-nums text-gold"
                      />
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs text-muted-foreground tabular-nums">
                      {existing[p.id] != null ? `${(existing[p.id] * 100).toFixed(4)}%` : "—"}
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
