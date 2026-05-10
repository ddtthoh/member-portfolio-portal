import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { useWallet } from "@/hooks/use-wallet";
import { TotalAssetsGauge } from "@/components/total-assets-gauge";
import { SpotlightCard } from "@/components/spotlight-card";
import { PLCalendar } from "@/components/pl-calendar";
import { AssetGrowthChart } from "@/components/charts/asset-growth-chart";
import { RewardsBreakdownChart } from "@/components/charts/rewards-breakdown-chart";

export const Route = createFileRoute("/portal/asset-analysis")({
  head: () => ({
    meta: [
      { title: "Asset Analysis — Portal" },
      { name: "description", content: "Detailed analysis of your asset performance and allocation." },
    ],
  }),
  component: AssetAnalysisPage,
});

function AssetAnalysisPage() {
  const { t } = useTranslation();
  const { wallet } = useWallet();

  return (
    <div>
      <PageHeader
        title={t("nav.assetAnalysis")}
        description={t("pages.assetAnalysis.description")}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-4"
      >
        <SpotlightCard className="liquid-glass rounded-2xl p-6">
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-gold/80">
              {t("charts.totalAssets.eyebrow", "Assets")}
            </div>
            <h3 className="mt-1 font-serif text-lg font-semibold text-gold">
              {t("charts.totalAssets.title", "Total Assets")}
            </h3>
          </div>
          <TotalAssetsGauge staking={wallet.staking} usd={wallet.usd} rewards={wallet.rewards} />
        </SpotlightCard>
      </motion.div>

      <div className="mb-4">
        <RewardsBreakdownChart />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mb-4"
      >
        <SpotlightCard className="liquid-glass rounded-2xl p-6">
          <PLCalendar participation={wallet.staking} />
        </SpotlightCard>
      </motion.div>

      <AssetGrowthChart />
    </div>
  );
}
