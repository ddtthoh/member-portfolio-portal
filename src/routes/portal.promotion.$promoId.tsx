import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Gift } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Progress } from "@/components/ui/progress";

type Promo = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  progressLabel: string;
  progressValue: number;
};

const PROMOTIONS: Record<string, Promo> = {
  "naslab-turkey": {
    id: "naslab-turkey",
    title: "Naslab Opening Event At Turkey",
    subtitle: "Launch Event",
    description:
      "Promotion details coming soon. Update this section with the full event description, qualifying criteria, rewards and timeline.",
    progressLabel: "Your progress",
    progressValue: 0,
  },
  "rcb-tcb-community-ranking": {
    id: "rcb-tcb-community-ranking",
    title: "RCB, TCB, Community Ranking Incentive",
    subtitle: "Ranking Rewards",
    description:
      "Promotion details coming soon. Update this section with the ranking tiers, payout structure and how community contributions are measured.",
    progressLabel: "Your progress",
    progressValue: 0,
  },
};

export const Route = createFileRoute("/portal/promotion/$promoId")({
  loader: ({ params }) => {
    const promo = PROMOTIONS[params.promoId];
    if (!promo) throw notFound();
    return { promo };
  },
  component: PromotionDetailPage,
  notFoundComponent: () => (
    <div className="p-6 text-sm text-muted-foreground">Promotion not found.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">{error.message}</div>
  ),
});

function PromotionDetailPage() {
  const { promo } = Route.useLoaderData();

  return (
    <div>
      <Link
        to="/portal/promotion"
        className="mb-3 inline-flex items-center gap-1 text-xs text-gold/70 hover:text-gold"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to promotions
      </Link>

      <PageHeader eyebrow={promo.subtitle} title={promo.title} />

      <SpotlightCard className="liquid-glass rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2 text-gold">
          <Gift className="h-4 w-4" />
          <span className="text-[11px] uppercase tracking-[0.2em]">Details</span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/80">
          {promo.description}
        </p>
      </SpotlightCard>

      <SpotlightCard className="liquid-glass mt-4 rounded-2xl p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] text-gold">
            {promo.progressLabel}
          </span>
          <span className="font-sans text-sm text-gold">
            {promo.progressValue}%
          </span>
        </div>
        <Progress value={promo.progressValue} />
        <p className="mt-3 text-xs text-muted-foreground">
          Your progress for this promotion will appear here.
        </p>
      </SpotlightCard>
    </div>
  );
}
