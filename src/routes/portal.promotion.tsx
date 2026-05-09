import { createFileRoute, Link } from "@tanstack/react-router";
import { Gift, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";

export const Route = createFileRoute("/portal/promotion")({
  component: PromotionPage,
});

const promotions = [
  {
    id: "naslab-turkey",
    title: "Naslab Opening Event At Turkey",
    subtitle: "Launch Event",
  },
  {
    id: "rcb-tcb-community-ranking",
    title: "RCB, TCB, Community Ranking Incentive",
    subtitle: "Ranking Rewards",
  },
];

function PromotionPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader
        eyebrow={t("pages.promotion.eyebrow")}
        title={t("pages.promotion.title")}
        description={t("pages.promotion.description")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {promotions.map((p) => (
          <Link
            key={p.id}
            to="/portal/promotion/$promoId"
            params={{ promoId: p.id }}
            className="block"
          >
            <SpotlightCard className="liquid-glass group h-full rounded-2xl p-5 transition-transform hover:-translate-y-0.5">
              <div className="flex h-full flex-col">
                <div className="mb-3 flex items-center gap-2 text-gold">
                  <Gift className="h-4 w-4" />
                  <span className="text-[11px] uppercase tracking-[0.2em]">
                    {p.subtitle}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold leading-snug text-gold">
                  {p.title}
                </h3>
                <div className="mt-auto flex items-center justify-end pt-6 text-xs text-gold/70">
                  <span>View details</span>
                  <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </SpotlightCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
