import { useEffect, useMemo, useState } from "react";
import { Sparkles, TrendingUp, Wallet } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWallet } from "@/hooks/use-wallet";

export type StakingPlanOption = {
  name: string; // i18n key
  minAmount: number;
  roi: string; // display string
  roiMin: number; // e.g. 0.0015
  roiMax: number; // e.g. 0.0025
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans: StakingPlanOption[];
  defaultPlanIndex?: number;
};

const STEP = 100;
const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function StartStakingDialog({ open, onOpenChange, plans, defaultPlanIndex = 0 }: Props) {
  const { t } = useTranslation();
  const { wallet } = useWallet();
  const [planIndex, setPlanIndex] = useState(defaultPlanIndex);
  const [amountStr, setAmountStr] = useState("");

  const plan = plans[planIndex] ?? plans[0];

  // Reset selected plan when caller changes default (e.g. user clicked a card)
  useEffect(() => {
    if (open) {
      setPlanIndex(defaultPlanIndex);
      setAmountStr(String(plans[defaultPlanIndex]?.minAmount ?? plans[0].minAmount));
    }
  }, [open, defaultPlanIndex, plans]);

  const amount = Number(amountStr.replace(/[^\\d.]/g, "")) || 0;
  const maxFromWallet = Math.floor(wallet.usd / STEP) * STEP;

  const error = useMemo(() => {
    if (!amountStr) return "Enter an amount";
    if (!Number.isFinite(amount) || amount <= 0) return "Enter a valid amount";
    if (amount < plan.minAmount)
      return `Minimum for this plan is $${fmt(plan.minAmount)}`;
    if (amount % STEP !== 0) return `Amount must be a multiple of $${STEP}`;
    if (amount > wallet.usd) return "Insufficient wallet balance";
    return null;
  }, [amount, amountStr, plan.minAmount, wallet.usd]);

  const estLow = amount * plan.roiMin;
  const estHigh = amount * plan.roiMax;

  const setQuick = (delta: number | "min" | "max") => {
    if (delta === "min") return setAmountStr(String(plan.minAmount));
    if (delta === "max") return setAmountStr(String(Math.max(plan.minAmount, maxFromWallet)));
    const next = Math.max(plan.minAmount, (amount || 0) + delta);
    setAmountStr(String(Math.floor(next / STEP) * STEP));
  };

  const handleConfirm = () => {
    if (error) return;
    toast.success("Staking submitted", {
      description: `${t(plan.name)} • $${fmt(amount)}`,
    });
    onOpenChange(false);
  };

  const handleAmountChange = (raw: string) => {
    // Keep digits only — staking is in whole-dollar 100-multiples
    const cleaned = raw.replace(/[^\\d]/g, "").slice(0, 9);
    setAmountStr(cleaned);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gold/25 bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-2xl text-gold">
            <Sparkles className="h-5 w-5" />
            Start Staking
          </DialogTitle>
          <DialogDescription>
            Choose your plan and enter the amount you want to stake.
          </DialogDescription>
        </DialogHeader>

        {/* Plan selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold/70">
            Plan
          </label>
          <Select
            value={String(planIndex)}
            onValueChange={(v) => setPlanIndex(Number(v))}
          >
            <SelectTrigger className="border-gold/30 bg-card/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {plans.map((p, i) => (
                <SelectItem key={p.name} value={String(i)}>
                  {t(p.name)} — min ${fmt(p.minAmount)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Min ${fmt(plan.minAmount)}</span>
            <span className="inline-flex items-center gap-1 text-gold/80">
              <TrendingUp className="h-3 w-3" /> {plan.roi} / month
            </span>
          </div>
        </div>

        {/* Amount input */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <label className="text-[10px] font-medium uppercase tracking-[0.22em] text-gold/70">
              Amount (USD)
            </label>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Wallet className="h-3 w-3" /> Wallet: ${fmt(wallet.usd)}
            </span>
          </div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gold/70">
              $
            </span>
            <Input
              inputMode="numeric"
              value={amountStr ? Number(amountStr).toLocaleString("en-US") : ""}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              className="border-gold/30 bg-card/50 pl-7 text-right font-light tabular-nums tracking-tight text-lg text-gold"
            />
          </div>
          {error ? (
            <p className="text-[11px] text-destructive">{error}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Must be a multiple of $100, minimum ${fmt(plan.minAmount)}.
            </p>
          )}

          {/* Quick amount buttons */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[
              { label: "Min", action: () => setQuick("min") },
              { label: "+$500", action: () => setQuick(500) },
              { label: "+$1,000", action: () => setQuick(1000) },
              { label: "Max", action: () => setQuick("max"), disabled: maxFromWallet < plan.minAmount },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={b.action}
                disabled={b.disabled}
                className="rounded-md border border-gold/25 bg-card/40 px-2 py-1.5 text-[11px] uppercase tracking-[0.15em] text-gold/90 transition-colors hover:border-gold/60 hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Estimated rewards */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-3">
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold/70">
            Est. monthly reward
          </div>
          <div className="mt-1 font-light tabular-nums tracking-tight text-gold">
            <span className="text-xl">${fmt(estLow)}</span>
            <span className="mx-2 text-muted-foreground">–</span>
            <span className="text-xl">${fmt(estHigh)}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!!error}>
            Confirm Stake
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
