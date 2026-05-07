import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { TrendingUp, PieChart, BarChart3, Activity } from "lucide-react";

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

  const stats = [
    { label: t("assetAnalysis.totalAssets", "Total Assets"), value: "$50,000.00", icon: <PieChart className="h-5 w-5 text-gold" /> },
    { label: t("assetAnalysis.growth", "30D Growth"), value: "+4.68%", icon: <TrendingUp className="h-5 w-5 text-emerald-400" /> },
    { label: t("assetAnalysis.volatility", "Volatility"), value: "Low", icon: <Activity className="h-5 w-5 text-gold" /> },
    { label: t("assetAnalysis.allocations", "Allocations"), value: "5", icon: <BarChart3 className="h-5 w-5 text-gold" /> },
  ];

  const allocations = [
    { name: "USD Stable Pool", pct: 42 },
    { name: "Premium Staking", pct: 28 },
    { name: "Equity Basket", pct: 18 },
    { name: "Yield Reserve", pct: 8 },
    { name: "Cash", pct: 4 },
  ];

  return (
    <div>
      <PageHeader
        title={t("assetAnalysis.title", "Asset Analysis")}
        description={t("assetAnalysis.subtitle", "Performance, allocation and risk insights for your portfolio.")}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="liquid-glass rounded-xl p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              {s.icon}
            </div>
            <div className="text-lg font-semibold text-gold sm:text-xl">{s.value}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="liquid-glass rounded-xl p-5"
      >
        <h3 className="mb-4 text-base font-semibold text-foreground">
          {t("assetAnalysis.allocationBreakdown", "Allocation Breakdown")}
        </h3>
        <div className="space-y-3">
          {allocations.map((a) => (
            <div key={a.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{a.name}</span>
                <span className="font-medium text-gold">{a.pct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-accent/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold"
                  style={{ width: `${a.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
