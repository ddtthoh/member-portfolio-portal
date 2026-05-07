import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/portal/statement/convert-credits")({
  component: ConvertCreditsPage,
});

function ConvertCreditsPage() {
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Statement"
        title="Convert Credits"
        description="Convert credits between balances."
      />
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "USD Wallet", value: "$0.00" },
          { label: "Rewards Wallet", value: "$0.00" },
        ].map((w) => (
          <div key={w.label} className="liquid-glass flex flex-col gap-2 rounded-xl p-5">
            <div className="text-xs text-muted-foreground">{w.label}</div>
            <div className="text-xl font-semibold tracking-tight text-gold sm:text-2xl">{w.value}</div>
          </div>
        ))}
      </div>

      <div className="liquid-glass rounded-xl p-5">
        <h2 className="font-serif tracking-tight text-gold text-2xl font-thin">Convert Details</h2>
        <div className="my-4 h-px w-full bg-gold/20" />

        <div className="space-y-5">
          <Field label="Source Credit" value="Rewards Credit" />
          <Field label="Destination Credit" value="USD" />

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.2em] text-gold/80">
              Source Amount <span className="text-gold">*</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-gold/30 bg-transparent px-4 py-2.5 text-sm text-gold placeholder:text-gold/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAmount("")}
              className="border-gold/30 bg-transparent text-gold hover:bg-gold/10 hover:text-gold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-gradient-to-r from-gold to-gold/70 font-semibold text-background hover:opacity-90"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
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
