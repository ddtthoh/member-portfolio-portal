import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/")({
  component: Overview,
});

type Profile = { full_name: string | null; account_number: string | null; member_since: string | null; advisor_name: string | null };
type Holding = { quantity: number; avg_cost: number; current_price: number; asset_class: string };

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function Overview() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, account_number, member_since, advisor_name").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data as Profile));
    supabase.from("holdings").select("quantity, avg_cost, current_price, asset_class").eq("user_id", user.id)
      .then(({ data }) => setHoldings((data ?? []) as Holding[]));
  }, [user]);

  const totalValue = holdings.reduce((s, h) => s + Number(h.quantity) * Number(h.current_price), 0);
  const totalCost = holdings.reduce((s, h) => s + Number(h.quantity) * Number(h.avg_cost), 0);
  const gain = totalValue - totalCost;
  const gainPct = totalCost > 0 ? (gain / totalCost) * 100 : 0;

  const firstName = (profile?.full_name ?? user?.email ?? "").split(" ")[0];

  return (
    <div>
      <PageHeader
        eyebrow={`Account · ${profile?.account_number ?? "—"}`}
        title={`Good day, ${firstName || "Member"}`}
        description={`Your dedicated advisor is ${profile?.advisor_name ?? "—"}. Member since ${profile?.member_since ?? "—"}.`}
      />

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Deposit" value={fmt(0)} icon={<ArrowDownToLine className="h-4 w-4" />} />
        <Stat label="Withdrawal" value={fmt(0)} icon={<ArrowUpFromLine className="h-4 w-4" />} />
        <Stat label="Portfolio Value" value={fmt(totalValue)} icon={<Wallet className="h-4 w-4" />} highlight />
        <Stat
          label="Unrealized P/L"
          value={fmt(gain)}
          sub={`${gain >= 0 ? "+" : ""}${gainPct.toFixed(2)}%`}
          icon={gain >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          tone={gain >= 0 ? "up" : "down"}
        />
        <Stat label="Positions" value={String(holdings.length)} icon={<ArrowUpRight className="h-4 w-4" />} />
      </div>

    </div>
  );
}

function Stat({
  label, value, sub, icon, highlight, tone,
}: { label: string; value: string; sub?: string; icon?: React.ReactNode; highlight?: boolean; tone?: "up" | "down" }) {
  return (
    <div className={`liquid-glass rounded-lg p-3 ${highlight ? "shadow-[var(--shadow-elegant)]" : ""}`}>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>{label}</span>
        <span className="text-gold">{icon}</span>
      </div>
      <div className="mt-1.5 font-serif text-lg">{value}</div>
      {sub && (
        <div className={`mt-1 text-sm ${tone === "down" ? "text-destructive" : "text-success"}`}>
          {sub}
        </div>
      )}
    </div>
  );
}

