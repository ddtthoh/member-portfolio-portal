import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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

      <form onSubmit={handleSubmit} className="liquid-glass rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-2 text-gold border-b border-border/50 pb-4">
          <Send className="h-4 w-4" />
          <span className="text-[11px] uppercase tracking-[0.2em]">Transfer Details</span>
        </div>

        <Field label="USD Transfer" required>
          <div className="flex h-10 w-full items-center rounded-md border border-input bg-background/40 px-3 text-sm text-foreground">
            USD
          </div>
        </Field>

        <Field label="Transfer To Member Id" required>
          <Input
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="Enter member ID"
            required
          />
        </Field>

        <Field label="Transfer Amount" required>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </Field>

        <Field label="Remarks">
          <Textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional notes"
            rows={4}
          />
        </Field>

        <div>
          <Button
            type="submit"
            className="bg-gold text-background font-semibold uppercase tracking-wider hover:bg-gold/90"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      {children}
    </div>
  );
}
