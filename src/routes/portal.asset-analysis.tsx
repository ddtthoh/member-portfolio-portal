import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { useWallet } from "@/hooks/use-wallet";
import { TotalAssetsGauge } from "@/components/total-assets-gauge";
import { SpotlightCard } from "@/components/spotlight-card";
import { PLCalendar } from "@/components/pl-calendar";

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
        title={t("assetAnalysis.title", "Asset Analysis")}
        description={t("assetAnalysis.subtitle", "Performance, allocation and risk insights for your portfolio.")}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-4"
      >
        <SpotlightCard className="liquid-glass rounded-xl p-6">
          <TotalAssetsGauge staking={wallet.staking} usd={wallet.usd} rewards={wallet.rewards} />
        </SpotlightCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <SpotlightCard className="liquid-glass rounded-xl p-6">
          <PLCalendar />
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
