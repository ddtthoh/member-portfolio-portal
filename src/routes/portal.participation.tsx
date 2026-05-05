import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/participation")({
  head: () => ({
    meta: [
      { title: "Participation — Portal" },
      { name: "description", content: "Your participation in firm programs and initiatives." },
    ],
  }),
  component: ParticipationPage,
});

function ParticipationPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Programs · Engagement"
        title="Participation"
        description="Track your active participation across firm programs, initiatives, and allocations."
      />

      <div className="liquid-glass rounded-xl p-6">
        <div className="mb-4 flex items-center gap-2 text-gold">
          <Users className="h-4 w-4" />
          <span className="text-[11px] uppercase tracking-[0.2em]">Active Programs</span>
        </div>
        <p className="text-sm text-muted-foreground">
          You currently have no active participations. New opportunities will appear here when available.
        </p>
      </div>
    </div>
  );
}
