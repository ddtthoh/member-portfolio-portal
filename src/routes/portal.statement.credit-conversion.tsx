import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/statement/credit-conversion")({
  component: CreditConversionPage,
});

function CreditConversionPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Statement"
        title="Credit Conversion"
        description="Review your credit conversion history and balances."
      />
      <div className="liquid-glass rounded-xl p-6">
        <div className="text-sm text-muted-foreground">​</div>
      </div>
    </div>
  );
}
