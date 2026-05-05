import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownToLine, ArrowUpFromLine, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { TiltCard } from "@/components/tilt-card";
import { CountValue } from "@/components/count-value";
import { Sparkline } from "@/components/sparkline";

export const Route = createFileRoute("/portal/")({
  component: Overview,
});

type Profile = { full_name: string | null; account_number: string | null; member_since: string | null; advisor_name: string | null };
type Holding = { quantity: number; avg_cost: number; current_price: number; asset_class: string };

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

  const actionTiles = [
    { label: "Deposit", icon: <ArrowDownToLine className="h-4 w-4" />, labelOnly: true as const, to: "/portal/deposit" },
    { label: "Withdrawal", icon: <ArrowUpFromLine className="h-4 w-4" />, labelOnly: true as const, to: "/portal/withdrawal" },
    { label: "Referral", icon: <Users className="h-4 w-4" />, labelOnly: true as const, to: "/portal/referral" },
  ];

  const tiles = [
    { label: "Portfolio Value", value: totalValue, icon: <Wallet className="h-4 w-4" />, highlight: true, seed: 5, positive: true },
    {
      label: "Unrealized P/L",
      value: gain,
      sub: `${gain >= 0 ? "+" : ""}${gainPct.toFixed(2)}%`,
      icon: gain >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />,
      tone: gain >= 0 ? ("up" as const) : ("down" as const),
      seed: 7,
      positive: gain >= 0,
    },
    { label: "Positions", value: holdings.length, prefix: "", icon: <ArrowUpRight className="h-4 w-4" />, seed: 11, positive: true },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={`Account · ${profile?.account_number ?? "—"}`}
        title={`Good day, ${firstName || "Member"}`}
        description={`Member since ${profile?.member_since ?? "—"}.`}
      />

      <div className="mb-3 grid grid-cols-3 gap-3">
        {actionTiles.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
          >
            <Link to={t.to} className="block transition-transform hover:-translate-y-0.5">
              <TiltCard>
                <Stat label={t.label} icon={t.icon} labelOnly />
              </TiltCard>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
          >
            <TiltCard>
              <Stat {...t} />
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Stat({
  label, sub, icon, highlight, tone, seed = 1, positive = true, labelOnly = false,
}: {
  label: string;
  value?: number;
  sub?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  tone?: "up" | "down";
  seed?: number;
  positive?: boolean;
  prefix?: string;
  labelOnly?: boolean;
}) {
  if (labelOnly) {
    return (
      <div className={`liquid-glass flex items-center justify-center rounded-lg p-6 ${highlight ? "shadow-[var(--shadow-elegant)]" : ""}`}>
        <span className="font-serif text-2xl tracking-wide">{label}</span>
      </div>
    );
  }
  return (
    <div className={`liquid-glass rounded-lg p-3 ${highlight ? "shadow-[var(--shadow-elegant)]" : ""}`}>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>{label}</span>
        <span className="text-gold">{icon}</span>
      </div>
      {sub && (
        <div className={`mt-0.5 text-xs ${tone === "down" ? "text-destructive" : "text-success"}`}>
          {sub}
        </div>
      )}
      <div className="mt-2 -mx-1">
        <Sparkline seed={seed} positive={positive} width={140} height={24} />
      </div>
    </div>
  );
}
