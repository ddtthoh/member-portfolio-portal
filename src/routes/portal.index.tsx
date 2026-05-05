import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wallet, TrendingUp, TrendingDown, ArrowUpRight, FileText, MessageCircleQuestion,
} from "lucide-react";
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

      <div className="grid gap-6 md:grid-cols-3">
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

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <QuickLink to="/portal/holdings" title="Holdings & Allocation" body="Review every position and asset-class exposure." />
        <QuickLink to="/portal/performance" title="Performance & Returns" body="Track value, ROI, and historical performance." icon={<TrendingUp className="h-4 w-4" />} />
        <QuickLink to="/portal/transactions" title="Transactions" body="Full ledger of deposits, trades and withdrawals." />
        <QuickLink to="/portal/documents" title="Documents & Statements" body="Statements, tax documents, and contracts." icon={<FileText className="h-4 w-4" />} />
        <QuickLink to="/portal/reports" title="Quarterly Reports" body="Curated commentary from your advisor." />
        <QuickLink to="/portal/qna" title="Ask Your Advisor" body="Submit questions and review answered insights." icon={<MessageCircleQuestion className="h-4 w-4" />} />
      </div>
    </div>
  );
}

function Stat({
  label, value, sub, icon, highlight, tone,
}: { label: string; value: string; sub?: string; icon?: React.ReactNode; highlight?: boolean; tone?: "up" | "down" }) {
  return (
    <div className={`liquid-glass rounded-xl p-6 ${highlight ? "shadow-[var(--shadow-elegant)]" : ""}`}>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <span>{label}</span>
        <span className="text-gold">{icon}</span>
      </div>
      <div className="mt-3 font-serif text-3xl">{value}</div>
      {sub && (
        <div className={`mt-1 text-sm ${tone === "down" ? "text-destructive" : "text-success"}`}>
          {sub}
        </div>
      )}
    </div>
  );
}

function QuickLink({ to, title, body, icon }: { to: string; title: string; body: string; icon?: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="liquid-glass group block rounded-xl p-6 transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[var(--shadow-elegant)]"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-gold">{icon}</span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
      </div>
      <h3 className="font-serif text-lg">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </Link>
  );
}
