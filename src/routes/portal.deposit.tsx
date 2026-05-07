import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, Building2, Copy, Sparkles, Gift, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/portal/deposit")({
  component: DepositPage,
});

function DepositPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(true);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div>
      {mounted && (
        <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
          <DialogContent className="z-[100] border border-gold/40 bg-background/95 backdrop-blur-xl sm:max-w-md">
            <DialogHeader className="items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-gold/10">
                <AlertTriangle className="h-6 w-6 text-gold" />
              </div>
              <DialogTitle className="text-center text-2xl font-light tracking-[-0.02em] text-gold">
                Reminder
              </DialogTitle>
              <DialogDescription className="pt-3 text-center text-sm leading-relaxed text-foreground/85">
                Please use the <span className="font-medium text-gold">BEP20</span> deposit address on this page when performing any deposit transfer. If you do not, the deposit transfer will not be valid.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button
                onClick={() => setReminderOpen(false)}
                className="min-w-[120px] bg-gradient-to-b from-gold to-gold/80 text-background hover:from-gold/90 hover:to-gold/70"
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <PageHeader eyebrow={t("pages.deposit.eyebrow")} title={t("pages.deposit.title")} description={t("pages.deposit.description")} />

      <div className="grid gap-4 md:grid-cols-2">
        <SpotlightCard className="liquid-glass rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2 text-gold">
            <Building2 className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-[0.2em]">Wire Instructions</span>
          </div>
          <dl className="space-y-3 text-sm">
            <Row label="Beneficiary" value="Ivory & Vale Private Wealth" />
            <Row label="Bank" value="State Street Bank, NY" />
            <Row label="SWIFT / BIC" value="SBOSUS33" />
            <Row label="Routing (ABA)" value="011000028" />
            <Row label="Account" value="•••• 4821" />
            <Row label="Reference" value="Your account number" />
          </dl>
        </SpotlightCard>

        <SpotlightCard className="liquid-glass rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2 text-gold">
            <ArrowDownToLine className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-[0.2em]">Notes</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Minimum deposit: $25,000 USD equivalent.</li>
            <li>• Always include your account number as the reference.</li>
            <li>• International wires may take 2–3 business days.</li>
            <li>• Contact your advisor for crypto on-ramp options.</li>
          </ul>
        </SpotlightCard>
      </div>

      <div className="mt-6">
        <SpotlightCard className="liquid-glass rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2 text-gold">
            <Gift className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-[0.2em]">Promotion</span>
          </div>
          <dl className="space-y-3 text-sm">
            <Row label="Offer" value="Founders' Bonus" />
            <Row label="Bonus" value="+2.5% on first deposit" />
            <Row label="Minimum" value="$50,000 USD" />
            <Row label="Eligibility" value="New members" />
            <Row label="Promo Code" value="IVORY2026" />
            <Row label="Valid Until" value="Jun 30, 2026" />
          </dl>
        </SpotlightCard>

        <div className="mt-3 flex items-start gap-2 px-1 text-xs text-muted-foreground">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
          <p>
            Limited-time founders' promotion: qualifying deposits receive a 2.5% bonus credited within
            5 business days of settlement. Include the promo code in your wire reference alongside
            your account number. Bonus funds are subject to a 90-day holding period and standard terms apply.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 pb-2">
      <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-2 font-sans text-sm">
        {value}
        <Copy className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-gold" />
      </dd>
    </div>
  );
}
