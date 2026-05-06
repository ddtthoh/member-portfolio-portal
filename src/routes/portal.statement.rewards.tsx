import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/statement/rewards")({
  component: RewardsStatementPage,
});

function RewardsStatementPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Statement"
        title="Rewards Statement"
        description="Track rewards earned and redeemed across your account."
      />
      <div className="liquid-glass rounded-xl p-6">
        <div className="text-sm text-muted-foreground">No rewards activity yet.</div>
      </div>
    </div>
  );
}
