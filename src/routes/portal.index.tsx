import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, ArrowUpRight, Check, ChevronRight, Eye, EyeOff, Gem, Gift, LineChart, Repeat, Send, Users, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { TiltCard } from "@/components/tilt-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { CountUp } from "@/components/count-up";
import { Sparkline } from "@/components/sparkline";
import { SpotlightCard } from "@/components/spotlight-card";
import { useWallet } from "@/hooks/use-wallet";

export const Route = createFileRoute("/portal/")({
  component: Overview,
});

type Profile = { full_name: string | null; account_number: string | null; member_since: string | null; advisor_name: string | null };
type Holding = { quantity: number; current_price: number };

function Overview() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [hideBalance, setHideBalance] = useState(false);
  const { wallet } = useWallet();

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, account_number, member_since, advisor_name").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data as Profile));
    supabase.from("holdings").select("quantity, current_price").eq("user_id", user.id)
      .then(({ data }) => setHoldings((data ?? []) as Holding[]));
  }, [user]);

  const firstName = (profile?.full_name ?? user?.email ?? "").split(" ")[0];

  const actionTiles = [
    { label: t("overview.tiles.deposit"), icon: <ArrowDownToLine className="h-6 w-6" />, labelOnly: true as const, to: "/portal/deposit" },
    { label: t("overview.tiles.withdrawal"), icon: <ArrowUpFromLine className="h-6 w-6" />, labelOnly: true as const, to: "/portal/withdrawal" },
    { label: t("overview.tiles.convertCredits"), icon: <Repeat className="h-6 w-6" />, labelOnly: true as const, to: "/portal/statement/convert-credits" },
    { label: t("overview.tiles.transferUsd"), icon: <Send className="h-6 w-6" />, labelOnly: true as const, to: "/portal/statement/transfer-usd" },
    { label: t("overview.tiles.referral"), icon: <Users className="h-6 w-6" />, labelOnly: true as const, to: "/portal/referral" },
    { label: t("overview.tiles.participation"), icon: <Users className="h-6 w-6" />, labelOnly: true as const, to: "/portal/participation" },
    { label: t("overview.tiles.promotion"), icon: <Gift className="h-6 w-6" />, labelOnly: true as const, to: "/portal/promotion" },
  ];


  return (
    <div>
      {/* Hero bento: Est. Total Value (2/3) + Staking/Asset (1/3) */}
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* HERO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="sm:col-span-2"
        >
          <SpotlightCard className="liquid-glass flex h-full flex-col rounded-2xl p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {t("overview.estTotalValue")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHideBalance((v) => !v)}
                aria-label={hideBalance ? "Show balance" : "Hide balance"}
                className="text-muted-foreground transition-colors hover:text-gold"
              >
                {hideBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="mt-3 font-light tabular-nums tracking-[-0.04em] text-gold text-4xl sm:text-6xl">
              {hideBalance ? (
                "******"
              ) : (
                <CountUp value={wallet.total} prefix="$" decimals={2} />
              )}
            </div>

            {/* Sparkline */}
            <div className="mt-4 -mx-1">
              <Sparkline
                data={[48200, 48650, 48400, 48900, 49100, 48800, 49250, 49500, 49350, 49650, 49800, 49600, 49900, 50000]}
                stroke="oklch(0.78 0.15 155)"
                height={48}
              />
            </div>

            {/* Timeframe pills */}
            <div className="mt-3 flex items-center gap-1">
              {["1D", "1W", "1M", "1Y", "ALL"].map((p, i) => (
                <button
                  key={p}
                  type="button"
                  className={`rounded-md px-2 py-1 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                    i === 0
                      ? "bg-gold/10 text-gold ring-1 ring-gold/30"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* PNL chips */}
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/40 pt-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t("overview.todaysPnl")}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-sm font-medium tabular-nums text-emerald-400 ring-1 ring-emerald-500/20">
                    <ArrowUpRight className="h-3 w-3" />
                    {hideBalance ? "******" : "$960.20"}
                  </span>
                  {!hideBalance && (
                    <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] tabular-nums text-emerald-400 ring-1 ring-emerald-500/20">
                      +1.92%
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t("overview.totalPnl", "Total PNL")}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-sm font-medium tabular-nums text-emerald-400 ring-1 ring-emerald-500/20">
                    <ArrowUpRight className="h-3 w-3" />
                    {hideBalance ? "******" : "$2,344.20"}
                  </span>
                  {!hideBalance && (
                    <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] tabular-nums text-emerald-400 ring-1 ring-emerald-500/20">
                      +2.54%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
              <span>Updated just now</span>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* RIGHT COLUMN */}
        <div className="flex h-full flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1"
          >
            <SpotlightCard className="liquid-glass h-full rounded-xl p-5">
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-1 flex-col items-center text-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {t("overview.participatedDay")}
                  </span>
                  <span className="mt-1 text-xl font-light tabular-nums tracking-tight text-gold sm:text-2xl">
                    <CountUp value={85} decimals={0} duration={1} />{" "}
                    <span className="text-xs font-normal text-muted-foreground">{t("common.days")}</span>
                  </span>
                </div>
                <div aria-hidden className="mx-3 h-12 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
                <div className="flex flex-1 flex-col items-center text-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {t("overview.stakingAmount")}
                  </span>
                  <span className="mt-1 text-xl font-light tabular-nums tracking-tight text-gold sm:text-2xl">
                    <CountUp value={50000} prefix="$" decimals={0} />
                  </span>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/portal/asset-analysis" className="block">
              <SpotlightCard className="liquid-glass relative flex items-center justify-center rounded-xl px-5 py-4 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10 ring-1 ring-gold/25">
                    <LineChart className="h-4 w-4 text-gold" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {t("overview.assetAnalysis", "Asset Analysis")}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Insights · Trends
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Tier card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mb-3"
      >
        <div className="liquid-glass relative overflow-hidden rounded-xl p-5">
          {/* gold glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-xl"
            style={{
              background:
                "radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--gold) 14%, transparent), transparent 55%), radial-gradient(120% 80% at 100% 100%, color-mix(in oklab, var(--gold) 10%, transparent), transparent 55%)",
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
                {t("overview.diamond")}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-foreground/80 backdrop-blur transition-colors hover:border-gold/50 hover:text-foreground"
                  >
                    {t("overview.currentTierProgress")} <ChevronRight className="h-3.5 w-3.5" />
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
                      {t("overview.tierProgression")}
                    </DialogTitle>
                    <DialogDescription>{t("overview.tierUnlock")}</DialogDescription>
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
                      { name: t("overview.stakingPlanPremium"), pct: "25%", highlight: true },
                      { name: t("overview.firstPlatinum"), pct: "50%", highlight: true },
                      { name: t("overview.secondPlatinum"), pct: "75%", current: true },
                      { name: t("overview.thirdPlatinum"), pct: "100%", locked: true },
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
          { label: t("overview.usdtWallet"), value: 0 },
          { label: t("overview.rewardsWallet"), value: 0 },
        ].map((w, i) => (
          <motion.div
            key={w.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <SpotlightCard className="liquid-glass flex flex-col gap-2 rounded-xl p-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{w.label}</div>
              <div className="text-xl font-light tabular-nums tracking-tight text-gold sm:text-2xl">
                <CountUp value={w.value} prefix="$" decimals={2} />
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      <div className="mb-3 grid grid-cols-4 gap-3">
        {actionTiles.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to={t.to} className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-0.5">
              <TiltCard>
                <div className="liquid-glass flex h-14 w-14 items-center justify-center rounded-2xl text-gold sm:h-16 sm:w-16">
                  {t.icon}
                </div>
              </TiltCard>
              <span className="rounded-md bg-background/55 px-2 py-0.5 text-center text-xs font-medium tracking-wide text-foreground/90 backdrop-blur-sm sm:text-sm">{t.label}</span>
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
