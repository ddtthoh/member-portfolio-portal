import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { SpotlightCard } from "@/components/spotlight-card";
import { CountUp } from "@/components/count-up";
import { useWallet } from "@/hooks/use-wallet";
import { TotalAssetsGauge } from "@/components/total-assets-gauge";
import { RewardsBreakdownChart } from "@/components/charts/rewards-breakdown-chart";
import { AssetGrowthChart } from "@/components/charts/asset-growth-chart";
import { motion } from "framer-motion";
import { TrendingUp, Eye, EyeOff } from "lucide-react";

const PARTICIPANTS = 1284;
const PARTICIPATED_USD = 4820500;

function ParticipationStats() {
  const [masked, setMasked] = useState(false);
  return (
    <SpotlightCard className="liquid-glass relative rounded-2xl p-6">
      <button
        type="button"
        onClick={() => setMasked((m) => !m)}
        aria-label={masked ? "Show values" : "Hide values"}
        className="absolute right-4 top-4 z-10 text-muted-foreground transition-colors hover:text-gold"
      >
        {masked ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <div className="grid grid-cols-1 divide-y divide-border/60 md:grid-cols-2 md:divide-x md:divide-y-0">
        <div className="pb-6 md:pb-0 md:pr-8">
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold/80">Total Participants Joined</div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-5xl font-light tabular-nums tracking-[-0.02em] text-gold">
              {masked ? "******" : <CountUp value={PARTICIPANTS} decimals={0} />}
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-gold/50">members</span>
          </div>
          <div className="mt-3 h-px w-12 bg-gold/40" />
          <div className="mt-3 flex items-center gap-1 text-[11px] text-success">
            <TrendingUp className="h-3 w-3" />
            <span className="tabular-nums">{masked ? "******" : "+12.4%"}</span>
            <span className="text-gold/50">this month</span>
          </div>
        </div>

        <div className="pt-6 md:pl-8 md:pt-0">
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold/80">Total Participated Amounts</div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-5xl font-light tabular-nums tracking-[-0.02em] text-gold">
              {masked ? "******" : <CountUp value={PARTICIPATED_USD} prefix="$" decimals={0} />}
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-gold/50">USD</span>
          </div>
          <div className="mt-3 h-px w-12 bg-gold/40" />
          <div className="mt-3 flex items-center gap-1 text-[11px] text-success">
            <TrendingUp className="h-3 w-3" />
            <span className="tabular-nums">{masked ? "******" : "+8.7%"}</span>
            <span className="text-gold/50">this month</span>
          </div>
        </div>
      </div>

    </SpotlightCard>
  );
}


export const Route = createFileRoute("/portal/holdings")({
  component: HoldingsPage,
});

type Holding = {
  id: string; asset_name: string; ticker: string | null; asset_class: string;
  quantity: number; avg_cost: number; current_price: number; currency: string;
};

function HoldingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rows, setRows] = useState<Holding[]>([]);
  const { wallet } = useWallet();
  
  useEffect(() => {
    if (!user) return;
    supabase.from("holdings").select("*").eq("user_id", user.id).order("asset_name")
      .then(({ data }) => setRows((data ?? []) as Holding[]));
  }, [user]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <SpotlightCard className="liquid-glass rounded-2xl p-6">
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-gold/80">
              {t("charts.totalAssets.eyebrow", "Assets")}
            </div>
            <h3 className="mt-1 font-serif text-lg font-semibold text-gold">
              {t("charts.totalAssets.title", "Total Assets")}
            </h3>
          </div>
          <TotalAssetsGauge staking={wallet.staking} usd={wallet.usd} rewards={wallet.rewards} />
        </SpotlightCard>
      </motion.div>

      <RewardsBreakdownChart />

      <AssetGrowthChart />

      <ParticipationStats />

      <SpotlightCard className="liquid-glass overflow-hidden rounded-xl">
        <div className="border-b border-border/60 px-6 py-4">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-gold">
            {t("palette.items.stakingPlans")}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-[10px] uppercase tracking-[0.18em] text-gold">
                <th className="px-6 py-3 text-left font-medium">{t("pages.holdings.tableHeaders.date")}</th>
                <th className="px-6 py-3 text-left font-medium">{t("pages.holdings.tableHeaders.stakingPlan")}</th>
                <th className="px-6 py-3 text-left font-medium">{t("pages.holdings.tableHeaders.stakingDate")}</th>
                <th className="px-6 py-3 text-right font-medium">{t("pages.holdings.tableHeaders.stakingAmount")}</th>
                <th className="px-6 py-3 text-right font-medium">{t("pages.holdings.tableHeaders.minMonthlyRate")}</th>
                <th className="px-6 py-3 text-right font-medium">{t("pages.holdings.tableHeaders.maxMonthlyRate")}</th>
                <th className="px-6 py-3 text-center font-medium">{t("pages.holdings.tableHeaders.status")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-gold">
                    {t("pages.holdings.empty.noStakingPlan")}
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
                    <td className="px-6 py-4 text-right font-light text-sm tabular-nums tracking-[-0.02em] text-gold"><CountUp value={value} prefix="$" decimals={2} /></td>
                    <td className="px-6 py-4 text-right font-light text-sm tabular-nums tracking-[-0.02em] text-gold"><CountUp value={Number(h.avg_cost)} prefix="$" decimals={2} /></td>
                    <td className="px-6 py-4 text-right font-light text-sm tabular-nums tracking-[-0.02em] text-gold"><CountUp value={Number(h.current_price)} prefix="$" decimals={2} /></td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-success">
                        {t("pages.staking.status.active")}
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
            <Button size="sm">{t("pages.holdings.refund.button")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("pages.holdings.refund.title")}</DialogTitle>
              <DialogDescription>
                {t("pages.holdings.refund.description")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t("common.cancel")}</Button>
              </DialogClose>
              <Button onClick={() => alert(t("pages.holdings.refund.submitted"))}>{t("pages.holdings.refund.confirm")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
