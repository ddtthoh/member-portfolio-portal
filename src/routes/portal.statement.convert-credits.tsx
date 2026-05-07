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
      <div className="liquid-glass rounded-xl p-px">
        <div className="px-5 py-8 text-center text-xs text-gold/60">​</div>
      </div>
    </div>
  );
}
