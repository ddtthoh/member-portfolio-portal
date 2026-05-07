import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/statement/transfer-usd")({
  component: TransferUsdPage,
});

function TransferUsdPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Statement"
        title="Transfer USD"
        description="Transfer USD between accounts."
      />
      <div className="liquid-glass rounded-xl p-px">
        <div className="px-5 py-8 text-center text-xs text-gold/60">​</div>
      </div>
    </div>
  );
}
