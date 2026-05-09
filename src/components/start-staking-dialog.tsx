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
import { useWallet } from "@/hooks/use-wallet";

export type StakingPlanOption = {
  name: string; // i18n key
  minAmount: number;
  roi: string; // display string
  roiMin: number;
  roiMax: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans: StakingPlanOption[];
};

const STEP = 100;
const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

export function StartStakingDialog({ open, onOpenChange, plans }: Props) {
  const { t } = useTranslation();
  const { wallet } = useWallet();
  const [amountStr, setAmountStr] = useState("");

  // Tiers sorted ascending by minAmount
  const sorted = useMemo(
    () => [...plans].sort((a, b) => a.minAmount - b.minAmount),
    [plans]
  );
  const minTier = sorted[0];
  const maxTier = sorted[sorted.length - 1];

  useEffect(() => {
    if (open) setAmountStr("");
  }, [open]);

  const amount = Number(amountStr.replace(/[^\d]/g, "")) || 0;
  const maxFromWallet = Math.floor(wallet.usd / STEP) * STEP;

  const matchedTier = useMemo(() => {
    let current = sorted[0];
    for (const p of sorted) {
      if (amount >= p.minAmount) current = p;
    }
    return current;
  }, [amount, sorted]);

  const error = useMemo(() => {
    if (!amountStr) return "Enter an amount";
    if (!Number.isFinite(amount) || amount <= 0) return "Enter a valid amount";
    if (amount < minTier.minAmount)
      return `Minimum staking amount is $${fmt(minTier.minAmount)}`;
    if (amount % STEP !== 0) return `Amount must be a multiple of $${STEP}`;
    if (amount > wallet.usd) return "Insufficient wallet balance";
    return null;
  }, [amount, amountStr, minTier.minAmount, wallet.usd]);

  const handleAmountChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d]/g, "").slice(0, 9);
    setAmountStr(cleaned);
  };

  const setMin = () => setAmountStr(String(minTier.minAmount));
  const setMax = () => {
    const cap = Math.min(maxFromWallet, Math.floor(maxTier.minAmount * 20 / STEP) * STEP || maxFromWallet);
    setAmountStr(String(Math.max(minTier.minAmount, maxFromWallet)));
  };

  const handleConfirm = () => {
    if (error) return;
    toast.success("Staking submitted", {
      description: `${t(matchedTier.name)} • $${fmt(amount)}`,
    });
    onOpenChange(false);
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
            Enter any amount in multiples of $100. Your tier and ROI update automatically.
          </DialogDescription>
        </DialogHeader>

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
              Multiples of $100, minimum ${fmt(minTier.minAmount)}.
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={setMin}
              className="rounded-md border border-gold/25 bg-card/40 px-2 py-1.5 text-[11px] uppercase tracking-[0.15em] text-gold/90 transition-colors hover:border-gold/60 hover:bg-gold/10"
            >
              Min
            </button>
            <button
              type="button"
              onClick={setMax}
              disabled={maxFromWallet < minTier.minAmount}
              className="rounded-md border border-gold/25 bg-card/40 px-2 py-1.5 text-[11px] uppercase tracking-[0.15em] text-gold/90 transition-colors hover:border-gold/60 hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Max
            </button>
          </div>
        </div>

        {/* Matched tier + ROI */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-gold/70">
                Your tier
              </div>
              <div className="mt-1 font-serif text-lg text-gold">
                {t(matchedTier.name)}
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] text-gold/70">
                <TrendingUp className="h-3 w-3" /> Est. monthly ROI
              </div>
              <div className="mt-1 font-light tabular-nums tracking-tight text-gold">
                <span className="text-lg">{pct(matchedTier.roiMin)}</span>
                <span className="mx-1.5 text-muted-foreground">–</span>
                <span className="text-lg">{pct(matchedTier.roiMax)}</span>
              </div>
            </div>
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
