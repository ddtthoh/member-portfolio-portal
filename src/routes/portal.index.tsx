import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, Check, ChevronDown, ChevronRight, ChevronUp, Gem, Users, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { TiltCard } from "@/components/tilt-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
    { label: "Deposit", icon: <ArrowDownToLine className="h-6 w-6" />, labelOnly: true as const, to: "/portal/deposit" },
    { label: "Withdrawal", icon: <ArrowUpFromLine className="h-6 w-6" />, labelOnly: true as const, to: "/portal/withdrawal" },
    { label: "Referral", icon: <Users className="h-6 w-6" />, labelOnly: true as const, to: "/portal/referral" },
    { label: "Participation", icon: <Users className="h-6 w-6" />, labelOnly: true as const, to: "/portal/participation" },
  ];


  return (
    <div>
      {/* Est. Total Value + Staking info */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="liquid-glass rounded-xl p-5"
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Est. Total Value (USD)</span>
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-gold sm:text-4xl">
            $50,000.00
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Today's PNL <span className="text-emerald-400">+$960.2(+1.92%)</span>
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
          className="liquid-glass flex flex-col justify-center gap-3 rounded-xl p-5"
        >
          <div>
            <div className="text-sm text-muted-foreground">Participated day : </div>
            <div className="mt-1 text-2xl font-semibold text-gold">85 days</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Staking amount :</div>
            <div className="mt-1 text-2xl font-semibold text-gold">50,000</div>
          </div>
        </motion.div>
      </div>

      {/* Tier card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mb-3"
      >
        <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-background via-background to-background p-5 sm:p-6"
          style={{
            boxShadow:
              "inset 0 0 0 1px color-mix(in oklab, var(--gold) 10%, transparent), 0 0 60px -20px color-mix(in oklab, var(--gold) 45%, transparent), 0 20px 60px -30px rgba(0,0,0,0.6)",
          }}
        >
          {/* gold glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-2xl"
            style={{
              background:
                "radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 55%), radial-gradient(120% 80% at 100% 100%, color-mix(in oklab, var(--gold) 18%, transparent), transparent 55%)",
            }}
          />
          <div className="relative flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div
                className="font-serif text-4xl font-semibold leading-none tracking-tight sm:text-5xl"
                style={{
                  background: "linear-gradient(180deg, color-mix(in oklab, var(--gold) 95%, white) 0%, var(--gold) 60%, color-mix(in oklab, var(--gold) 70%, black) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Diamond
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-foreground/80 backdrop-blur transition-colors hover:border-gold/50 hover:text-foreground"
                  >
                    Current tier progress <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="border-gold/25 bg-background sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle
                      className="font-serif text-2xl"
                      style={{
                        background: "linear-gradient(180deg, color-mix(in oklab, var(--gold) 95%, white) 0%, var(--gold) 60%, color-mix(in oklab, var(--gold) 70%, black) 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      Tier Progression
                    </DialogTitle>
                    <DialogDescription>Reach 100% to unlock the next tier.</DialogDescription>
                  </DialogHeader>

                  <div className="mt-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "75%",
                          background: "linear-gradient(90deg, color-mix(in oklab, var(--gold) 60%, black), var(--gold))",
                          boxShadow: "0 0 12px color-mix(in oklab, var(--gold) 70%, transparent)",
                        }}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm">
                    {[
                      { name: "Staking plan : Premium Pro", pct: "25%", highlight: true },
                      { name: "First platinum manager within the division", pct: "50%", highlight: true },
                      { name: "Second platinum manager within the division", pct: "75%", current: true },
                      { name: "Third platinum manager within the division", pct: "100%", locked: true },
                    ].map((t) => (
                      <li
                        key={t.name}
                        className={`flex items-center justify-between rounded-xl border px-4 py-4 text-base ${t.current ? "border-gold/50 bg-gold/5" : "border-border/60"}`}
                      >
                        <span className="flex items-center gap-2">
                          {t.locked ? (
                            <X className="h-4 w-4 text-muted-foreground" strokeWidth={3} />
                          ) : (
                            <Check className="h-4 w-4 text-gold" strokeWidth={3} />
                          )}
                          <span className={t.current || t.highlight ? "text-gold" : "text-muted-foreground"}>{t.name}</span>
                          
                        </span>
                        <span className={`text-xs ${t.current || t.highlight ? "text-gold" : "text-muted-foreground"}`}>{t.pct}</span>
                      </li>
                    ))}
                  </ul>
                </DialogContent>
              </Dialog>
            </div>
            <div className="relative shrink-0">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl border border-gold/40 sm:h-16 sm:w-16"
                style={{
                  background:
                    "linear-gradient(160deg, color-mix(in oklab, var(--gold) 30%, transparent), transparent 60%)",
                  boxShadow:
                    "0 0 30px -8px color-mix(in oklab, var(--gold) 70%, transparent), inset 0 0 20px color-mix(in oklab, var(--gold) 20%, transparent)",
                }}
              >
                <Gem className="h-7 w-7 text-gold" />
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative mt-5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
              <div
                className="relative h-full rounded-full"
                style={{
                  width: "75%",
                  background: "linear-gradient(90deg, color-mix(in oklab, var(--gold) 60%, black), var(--gold))",
                  boxShadow: "0 0 12px color-mix(in oklab, var(--gold) 70%, transparent)",
                }}
              >
                <span
                  aria-hidden
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full"
                  style={{
                    background: "radial-gradient(circle, white 0%, color-mix(in oklab, var(--gold) 90%, white) 40%, transparent 70%)",
                    boxShadow: "0 0 14px 3px color-mix(in oklab, var(--gold) 90%, white), 0 0 28px 6px color-mix(in oklab, var(--gold) 60%, transparent)",
                    animation: "pulse 1.8s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        {[
          { label: "USDT Wallet", value: "$0.00" },
          { label: "Rewards Wallet", value: "$0.00" },
        ].map((w, i) => (
          <motion.div
            key={w.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="liquid-glass rounded-xl p-5"
          >
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{w.label}</div>
            <div className="mt-2 text-3xl font-semibold text-gold">{w.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="mb-3 grid grid-cols-4 gap-3">
        {actionTiles.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
          >
            <Link to={t.to} className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-0.5">
              <TiltCard>
                <div className="liquid-glass flex h-14 w-14 items-center justify-center rounded-2xl text-gold sm:h-16 sm:w-16">
                  {t.icon}
                </div>
              </TiltCard>
              <span className="text-center text-xs font-medium tracking-wide text-foreground/90 sm:text-sm">{t.label}</span>
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
      <div className={`liquid-glass flex aspect-square items-center justify-center rounded-lg p-3 text-center ${highlight ? "shadow-[var(--shadow-elegant)]" : ""}`}>
        <span className="font-serif text-base leading-tight tracking-wide sm:text-lg md:text-xl">{label}</span>
      </div>
    );
  }
  return null;
}
