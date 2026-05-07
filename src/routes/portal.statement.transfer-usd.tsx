import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/spotlight-card";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/statement/transfer-usd")({
  component: TransferUsdPage,
});

function TransferUsdPage() {
  const { t } = useTranslation();
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId.trim() || !amount.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Transfer request submitted");
  };

  return (
    <div className="space-y-5">
      <PageHeader eyebrow={t("pages.transferUsd.eyebrow")} title={t("pages.transferUsd.title")} description={t("pages.transferUsd.description")} />

      <SpotlightCard className="liquid-glass rounded-xl p-5">
        <h2 className="font-serif tracking-tight text-gold text-2xl font-thin">Transfer Details</h2>
        <div className="my-4 h-px w-full bg-gold/20" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <ReadOnlyField label="USD Transfer" value="USD" />

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-gold/80">
              Transfer To Member Id <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="Enter member ID"
              required
              className="w-full rounded-lg border border-gold/30 bg-transparent px-4 py-2.5 text-sm text-gold placeholder:text-gold/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-gold/80">
              Transfer Amount <span className="text-gold">*</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full rounded-lg border border-gold/30 bg-transparent px-4 py-2.5 text-sm text-gold placeholder:text-gold/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-gold/80">
              Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional notes"
              rows={4}
              className="w-full rounded-lg border border-gold/30 bg-transparent px-4 py-2.5 text-sm text-gold placeholder:text-gold/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMemberId("");
                setAmount("");
                setRemarks("");
              }}
              className="border-gold/30 bg-transparent text-gold hover:bg-gold/10 hover:text-gold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-gold to-gold/70 font-semibold text-background hover:opacity-90"
            >
              Submit
            </Button>
          </div>
        </form>
      </SpotlightCard>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-[0.2em] text-gold/80">
        {label} <span className="text-gold">*</span>
      </label>
      <div
        aria-disabled
        className="flex w-full cursor-not-allowed items-center justify-between rounded-lg border border-gold/30 bg-gold/5 px-4 py-2.5 text-sm text-gold"
      >
        <span>{value}</span>
      </div>
    </div>
  );
}
