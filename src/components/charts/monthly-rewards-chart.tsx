import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMonthlyRewards, REWARD_TYPES, type RewardType } from "@/hooks/use-rewards-data";

const COLORS: Record<RewardType, string> = {
  staking: "var(--asset-participation)",
  referral: "var(--asset-cash)",
  team: "var(--asset-earnings)",
  leader: "var(--gold)",
  global: "var(--asset-cash)",
  par_rank: "var(--asset-earnings)",
};

export function MonthlyRewardsChart() {
  const { t } = useTranslation();
  const { data, hasData } = useMonthlyRewards();

  return (
    <div>
      <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-gold/80">
        {t("charts.monthlyRewards.title", "月度奖励 · 近6个月")}
      </div>
      <div className="h-56 w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                width={44}
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
                <Bar key={k} dataKey={k} stackId="r" fill={COLORS[k]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
            {t("charts.empty", "暂无数据")}
          </div>
        )}
      </div>
    </div>
  );
}
