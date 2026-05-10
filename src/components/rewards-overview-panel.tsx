import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SpotlightCard } from "@/components/spotlight-card";
import { MonthlyRewardsChart } from "@/components/charts/monthly-rewards-chart";
import { RewardsHeatmap } from "@/components/charts/rewards-heatmap";

export function RewardsOverviewPanel() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-5"
    >
      <SpotlightCard className="liquid-glass rounded-2xl p-5 sm:p-6">
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold/80">
            {t("charts.overview.eyebrow", "Overview")}
          </div>
          <h2 className="mt-1 font-serif text-lg font-semibold text-gold">
            {t("charts.overview.title", "奖励总览")}
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <MonthlyRewardsChart />
          <RewardsHeatmap />
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
