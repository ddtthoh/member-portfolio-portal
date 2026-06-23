import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Wallet, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { supabase } from "@/integrations/supabase/client";

// Kept for backwards compatibility with existing imports; no longer used to drive options.
export type StakingPlanOption = {
  name: string;
  minAmount: number;
  roi: string;
  roiMin: number;
  roiMax: number;
};

type DbPlan = {
  id: string;
  tier: "standard" | "advance" | "premium";
  variant: "lite" | "plus" | "pro";
  name: string;
  stake_amount: number;
  base_daily_rate: number;
  referral_rate: number;
  team_level_cap: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans?: StakingPlanOption[]; // ignored; plans come from DB
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

const tierLabel = { standard: "Standard", advance: "Advance", premium: "Premium" } as const;
const variantLabel = { lite: "Lite", plus: "Plus", pro: "Pro" } as const;

export function StartStakingDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation();
  const { wallet } = useWallet();
  const [plans, setPlans] = useState<DbPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedId(null);
    setLoading(true);
    supabase
      .from("staking_plans")
      .select("id, tier, variant, name, stake_amount, base_daily_rate, referral_rate, team_level_cap")
      .eq("is_active", true)
      .order("stake_amount", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          toast.error("Failed to load plans", { description: error.message });
        } else {
          setPlans((data ?? []) as DbPlan[]);
        }
        setLoading(false);
      });
  }, [open]);

  const selected = plans.find((p) => p.id === selectedId) ?? null;
  const insufficient = selected ? Number(wallet.usd) < Number(selected.stake_amount) : false;

  const handleConfirm = async () => {
    if (!selected) return;
    if (insufficient) {
      toast.error("Insufficient USDT balance", {
        description: `Need $${fmt(selected.stake_amount)}, have $${fmt(wallet.usd)}`,
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.rpc("subscribe_to_plan", { _plan_id: selected.id });
    setSubmitting(false);
    if (error) {
      toast.error("Subscription failed", { description: error.message });
      return;
    }
    toast.success("Staking subscription created", {
      description: `${selected.name} • $${fmt(selected.stake_amount)}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gold/25 bg-background sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-2xl text-gold">
            <Sparkles className="h-5 w-5" />
            Start Staking
          </DialogTitle>
          <DialogDescription>
            Choose a plan. Stake amount and daily rate are fixed per plan. Funds are deducted from your USDT balance.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Wallet className="h-3 w-3" /> USDT Balance: <span className="text-gold">${fmt(wallet.usd)}</span>
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading plans...
          </div>
        ) : (
          <div className="grid max-h-[420px] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-3">
            {(["standard", "advance", "premium"] as const).map((tier) => (
              <div key={tier} className="space-y-2">
                <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold/70">
                  {tierLabel[tier]}
                </div>
                {plans
                  .filter((p) => p.tier === tier)
                  .map((p) => {
                    const isSelected = selectedId === p.id;
                    const cantAfford = Number(wallet.usd) < Number(p.stake_amount);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedId(p.id)}
                        className={`relative w-full rounded-lg border p-3 text-left transition-colors ${
                          isSelected
                            ? "border-gold bg-gold/10"
                            : "border-gold/20 bg-card/40 hover:border-gold/40"
                        } ${cantAfford && !isSelected ? "opacity-50" : ""}`}
                      >
                        {isSelected && (
                          <Check className="absolute right-2 top-2 h-4 w-4 text-gold" />
                        )}
                        <div className="font-serif text-sm text-foreground">
                          {variantLabel[p.variant]}
                        </div>
                        <div className="mt-1 font-light text-base tabular-nums tracking-tight text-gold">
                          ${fmt(Number(p.stake_amount))}
                        </div>
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                          <TrendingUp className="h-3 w-3" /> {pct(Number(p.base_daily_rate))}/day
                        </div>
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-[11px]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-serif text-gold">{selected.name}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-muted-foreground">Stake</span>
              <span className="font-light tabular-nums text-gold">${fmt(Number(selected.stake_amount))}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-muted-foreground">Base daily rate</span>
              <span className="font-light tabular-nums text-foreground/90">{pct(Number(selected.base_daily_rate))}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-muted-foreground">Referral reward</span>
              <span className="font-light tabular-nums text-foreground/90">{pct(Number(selected.referral_rate))}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-muted-foreground">Team levels</span>
              <span className="font-light tabular-nums text-foreground/90">{selected.team_level_cap}</span>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selected || submitting || insufficient}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {insufficient ? "Insufficient balance" : "Confirm Stake"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
