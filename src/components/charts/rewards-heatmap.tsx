import { useTranslation } from "react-i18next";
import { useDailyRewards } from "@/hooks/use-rewards-data";

export function RewardsHeatmap() {
  const { t } = useTranslation();
  const { data, max, hasData } = useDailyRewards();

  // Group into weeks (columns of 7 days)
  const weeks: { date: string; value: number }[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const intensity = (v: number) => {
    if (max === 0 || v <= 0) return 0;
    return Math.min(1, v / max);
  };

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-[10px] uppercase tracking-[0.18em] text-gold/80">
          {t("charts.rewardsHeatmap.title", "每日奖励热力图 · 近90天")}
        </div>
        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground/70">
          <span>{t("charts.rewardsHeatmap.less", "少")}</span>
          {[0.15, 0.35, 0.6, 0.85].map((a) => (
            <span
              key={a}
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: `color-mix(in oklab, var(--gold) ${a * 100}%, transparent)` }}
            />
          ))}
          <span>{t("charts.rewardsHeatmap.more", "多")}</span>
        </div>
      </div>
      {hasData ? (
        <div className="flex gap-1 overflow-x-auto pb-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((d) => {
                const a = intensity(d.value);
                const bg =
                  a === 0
                    ? "hsl(var(--accent) / 0.18)"
                    : `color-mix(in oklab, var(--gold) ${(0.15 + a * 0.7) * 100}%, transparent)`;
                return (
                  <div
                    key={d.date}
                    title={`${d.date} · $${d.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                    className="h-3 w-3 rounded-sm transition-transform hover:scale-125"
                    style={{ background: bg }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
          {t("charts.empty", "暂无数据")}
        </div>
      )}
    </div>
  );
}
