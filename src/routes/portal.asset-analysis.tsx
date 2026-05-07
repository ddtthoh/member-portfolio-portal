import { createFileRoute } from "@tanstack/react-router";
import { motion, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { TrendingUp, PieChart, BarChart3, Activity } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { SpotlightCard } from "@/components/spotlight-card";
import { useWallet } from "@/hooks/use-wallet";

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

  const totalFormatted = `$${wallet.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const stats = [
    { label: t("assetAnalysis.totalAssets", "Total Assets"), value: totalFormatted, icon: <PieChart className="h-5 w-5 text-gold" /> },
    { label: t("assetAnalysis.growth", "30D Growth"), value: "+4.68%", icon: <TrendingUp className="h-5 w-5 text-emerald-400" /> },
    { label: t("assetAnalysis.volatility", "Volatility"), value: "Low", icon: <Activity className="h-5 w-5 text-gold" /> },
    { label: t("assetAnalysis.allocations", "Allocations"), value: "5", icon: <BarChart3 className="h-5 w-5 text-gold" /> },
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
      >
        <SpotlightCard className="liquid-glass rounded-xl p-5">
          <TotalAssetsGauge staking={wallet.staking} usd={wallet.usd} rewards={wallet.rewards} />
        </SpotlightCard>
      </motion.div>
    </div>
  );
}

function TotalAssetsGauge({ staking, usd, rewards }: { staking: number; usd: number; rewards: number }) {
  const total = staking + usd + rewards;
  const stakingPct = total > 0 ? (staking / total) * 100 : 0;
  const usdPct = total > 0 ? (usd / total) * 100 : 0;
  const rewardsPct = total > 0 ? (rewards / total) * 100 : 0;

  // Semi-circle geometry
  const r = 90;
  const cx = 110;
  const cy = 110;
  const circumference = Math.PI * r; // half circle
  const stakingLen = (stakingPct / 100) * circumference;
  const usdLen = (usdPct / 100) * circumference;
  const rewardsLen = (rewardsPct / 100) * circumference;

  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [stakingDraw, setStakingDraw] = useState(0);
  const [usdDraw, setUsdDraw] = useState(0);
  const [rewardsDraw, setRewardsDraw] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c0 = animate(0, stakingLen, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setStakingDraw(v),
    });
    const c1 = animate(0, usdLen, {
      duration: 1.2,
      delay: 0.25,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setUsdDraw(v),
    });
    const c2 = animate(0, rewardsLen, {
      duration: 1.2,
      delay: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setRewardsDraw(v),
    });
    return () => {
      c0.stop();
      c1.stop();
      c2.stop();
    };
  }, [inView, stakingLen, usdLen, rewardsLen]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg ref={ref} viewBox="0 0 220 130" className="h-40 w-56">
          {/* Track */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="hsl(var(--accent) / 0.4)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Staking segment (gold) */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="hsl(var(--gold))"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${stakingDraw} ${circumference}`}
          />
          {/* USD segment (mid gold) starts after staking */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="hsl(var(--gold) / 0.7)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`0 ${stakingLen} ${usdDraw} ${circumference}`}
          />
          {/* Rewards segment (lighter gold) starts after USD */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="hsl(var(--gold) / 0.4)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`0 ${stakingLen + usdLen} ${rewardsDraw} ${circumference}`}
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-1">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Total Assets · USD
          </div>
          <div className="text-2xl font-light tabular-nums tracking-[-0.04em] text-gold">
            <CountUp value={total} prefix="$" decimals={2} />
          </div>
        </div>
      </div>
      <div className="mt-4 grid w-full grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-gold" />
            Staking
          </div>
          <div className="font-light tabular-nums tracking-[-0.02em] text-gold">
            <CountUp value={stakingPct} decimals={2} suffix="%" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-gold/70" />
            USD
          </div>
          <div className="font-light tabular-nums tracking-[-0.02em] text-gold">
            <CountUp value={usdPct} decimals={2} suffix="%" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-gold/40" />
            Rewards
          </div>
          <div className="font-light tabular-nums tracking-[-0.02em] text-gold">
            <CountUp value={rewardsPct} decimals={2} suffix="%" />
          </div>
        </div>
      </div>
    </div>
  );
}
