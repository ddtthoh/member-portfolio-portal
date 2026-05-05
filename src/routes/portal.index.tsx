import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { TiltCard } from "@/components/tilt-card";

export const Route = createFileRoute("/portal/")({
  component: Overview,
});

type Profile = { full_name: string | null; account_number: string | null; member_since: string | null; advisor_name: string | null };
type Holding = { quantity: number; current_price: number };

function Overview() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, account_number, member_since, advisor_name").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data as Profile));
    supabase.from("holdings").select("quantity, current_price").eq("user_id", user.id)
      .then(({ data }) => setHoldings((data ?? []) as Holding[]));
  }, [user]);

  const firstName = (profile?.full_name ?? user?.email ?? "").split(" ")[0];

  const actionTiles = [
    { label: "Deposit", icon: <ArrowDownToLine className="h-4 w-4" />, labelOnly: true as const, to: "/portal/deposit" },
    { label: "Withdrawal", icon: <ArrowUpFromLine className="h-4 w-4" />, labelOnly: true as const, to: "/portal/withdrawal" },
    { label: "Referral", icon: <Users className="h-4 w-4" />, labelOnly: true as const, to: "/portal/referral" },
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

    </div>
  );
}

function Stat({ label, highlight, labelOnly = false }: { label: string; icon?: React.ReactNode; highlight?: boolean; labelOnly?: boolean }) {
  if (labelOnly) {
    return (
      <div className={`liquid-glass flex items-center justify-center rounded-lg p-6 ${highlight ? "shadow-[var(--shadow-elegant)]" : ""}`}>
        <span className="font-serif text-2xl tracking-wide">{label}</span>
      </div>
    );
  }
  return null;
}
