import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMonthlyRewards, REWARD_TYPES, REWARD_COLORS } from "@/hooks/use-rewards-data";
import { useInViewOnce } from "@/hooks/use-in-view-once";

export function MonthlyRewardsChart() {
  const { t } = useTranslation();
  const { data } = useMonthlyRewards();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ amount: 0.25 });

  return (
    <div ref={ref}>
      <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-gold/80">
        {t("charts.monthlyRewards.title", "月度奖励 · 近6个月")}
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              {REWARD_TYPES.map((k) => (
                <filter key={k} id={`mglow-${k}`} x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--accent) / 0.1)" }}
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number, name: string) => [`$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })}`, t(`charts.rewardTypes.${name}`, name)]}
            />
            <Legend
              wrapperStyle={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em" }}
              formatter={(value) => String(t(`charts.rewardTypes.${value}`, String(value)))}
            />
            {REWARD_TYPES.map((k) => (
              <Bar
                key={`${k}-${inView ? "in" : "out"}`}
                dataKey={k}
                stackId="r"
                fill={REWARD_COLORS[k]}
                radius={[4, 4, 0, 0]}
                style={{ filter: `url(#mglow-${k}) drop-shadow(0 0 6px ${REWARD_COLORS[k]})` }}
                isAnimationActive={inView}
                animationDuration={1500}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
