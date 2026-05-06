import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/statement/usd")({
  component: UsdStatementPage,
});

function UsdStatementPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Statement"
        title="USD Statement"
        description="A summary of your USD account activity."
      />
      <div className="liquid-glass rounded-xl p-6">
        <div className="text-sm text-muted-foreground">No USD statement entries yet.</div>
      </div>
    </div>
  );
}
