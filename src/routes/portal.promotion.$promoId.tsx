import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Gift } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

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
    title: "pages.promotion.promotions.naslabTurkey.title",
    subtitle: "pages.promotion.promotions.naslabTurkey.subtitle",
    description:
      "pages.promotionDetail.promotions.naslabTurkey.description",
    progressLabel: "pages.promotionDetail.progressLabel",
    progressValue: 0,
  },
  "rcb-tcb-community-ranking": {
    id: "rcb-tcb-community-ranking",
    title: "pages.promotion.promotions.rankingIncentive.title",
    subtitle: "pages.promotion.promotions.rankingIncentive.subtitle",
    description:
      "pages.promotionDetail.promotions.rankingIncentive.description",
    progressLabel: "pages.promotionDetail.progressLabel",
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
  notFoundComponent: () => {
    const { t } = useTranslation();
    return (
      <div className="p-6 text-sm text-muted-foreground">{t("pages.promotionDetail.notFound")}</div>
    );
  },
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-destructive">{error.message}</div>
  ),
});

function PromotionDetailPage() {
  const { t } = useTranslation();
  const { promo } = Route.useLoaderData();

  return (
    <div>
      <Link
        to="/portal/promotion"
        className="mb-3 inline-flex items-center gap-1 text-xs text-gold/70 hover:text-gold"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {t("pages.promotionDetail.backToPromotions")}
      </Link>

      <PageHeader eyebrow={t(promo.subtitle)} title={t(promo.title)} />

      <SpotlightCard className="liquid-glass rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2 text-gold">
          <Gift className="h-4 w-4" />
          <span className="text-[11px] uppercase tracking-[0.2em]">{t("pages.promotionDetail.details")}</span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/80">
          {t(promo.description)}
        </p>
      </SpotlightCard>

      <SpotlightCard className="liquid-glass mt-4 rounded-2xl p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] text-gold">
            {t(promo.progressLabel)}
          </span>
          <span className="font-sans text-sm text-gold">
            {promo.progressValue}%
          </span>
        </div>
        <Progress value={promo.progressValue} />
        <p className="mt-3 text-xs text-muted-foreground">
          {t("pages.promotionDetail.progressDescription")}
        </p>
      </SpotlightCard>
    </div>
  );
}
