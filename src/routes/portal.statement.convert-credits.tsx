import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/statement/convert-credits")({
  component: ConvertCreditsPage,
});

function ConvertCreditsPage() {
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
    </div>
  );
}
