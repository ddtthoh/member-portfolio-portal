import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type RewardType = "staking" | "referral" | "team" | "leader" | "global" | "par_rank";

export const REWARD_TYPES: RewardType[] = [
  "staking",
  "referral",
  "team",
  "leader",
  "global",
  "par_rank",
];

// Map a transaction.type string to one of our reward buckets, or null if not a reward.
function classifyReward(type: string | null | undefined): RewardType | null {
  if (!type) return null;
  const t = type.toLowerCase();
  if (t.includes("staking")) return "staking";
  if (t.includes("referral")) return "referral";
  if (t.includes("team")) return "team";
  if (t.includes("leader")) return "leader";
  if (t.includes("global")) return "global";
  if (t.includes("par") || t.includes("rank")) return "par_rank";
  return null;
}

type Tx = {
  id: string;
  type: string | null;
  amount: number | string | null;
  occurred_at: string;
};

function useTransactions() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRows([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    supabase
      .from("transactions")
      .select("id,type,amount,occurred_at")
      .eq("user_id", user.id)
      .order("occurred_at", { ascending: true })
      .limit(1000)
      .then(({ data }) => {
        if (!active) return;
        setRows((data ?? []) as Tx[]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  return { rows, loading };
}

// Cumulative asset growth (running total of net amount) over N days
export function useAssetGrowth(days: 7 | 30 | 90) {
  const { rows, loading } = useTransactions();
  return useMemo(() => {
    const now = Date.now();
    const start = now - days * 24 * 3600 * 1000;
    const buckets = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const d = new Date(start + i * 24 * 3600 * 1000);
      buckets.set(d.toISOString().slice(0, 10), 0);
    }
    rows.forEach((r) => {
      const t = new Date(r.occurred_at).getTime();
      if (t < start) return;
      const key = new Date(r.occurred_at).toISOString().slice(0, 10);
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + Number(r.amount ?? 0));
      }
    });
    let cum = 0;
    const data = Array.from(buckets.entries()).map(([date, v]) => {
      cum += v;
      return { date, value: cum };
    });
    return { data, loading, hasData: rows.length > 0 };
  }, [rows, loading, days]);
}

// Total per reward bucket
export function useRewardsBreakdown() {
  const { rows, loading } = useTransactions();
  return useMemo(() => {
    const totals: Record<RewardType, number> = {
      staking: 0, referral: 0, team: 0, leader: 0, global: 0, par_rank: 0,
    };
    rows.forEach((r) => {
      const k = classifyReward(r.type);
      if (k) totals[k] += Number(r.amount ?? 0);
    });
    const data = REWARD_TYPES.map((key) => ({ key, value: totals[key] }));
    const hasData = data.some((d) => d.value > 0);
    return { data, loading, hasData };
  }, [rows, loading]);
}

// Stacked monthly rewards for last 6 months
export function useMonthlyRewards() {
  const { rows, loading } = useTransactions();
  return useMemo(() => {
    const months: { key: string; label: string }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleString("en", { month: "short" }),
      });
    }
    const map = new Map<string, Record<string, number>>();
    months.forEach((m) => {
      const init: Record<string, number> = { month: 0 as unknown as number };
      REWARD_TYPES.forEach((k) => (init[k] = 0));
      map.set(m.key, init);
    });
    rows.forEach((r) => {
      const k = classifyReward(r.type);
      if (!k) return;
      const d = new Date(r.occurred_at);
      const mk = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const entry = map.get(mk);
      if (entry) entry[k] += Number(r.amount ?? 0);
    });
    const data = months.map((m) => ({ month: m.label, ...(map.get(m.key) ?? {}) }));
    const hasData = rows.some((r) => classifyReward(r.type));
    return { data, loading, hasData };
  }, [rows, loading]);
}

// Daily rewards for last 90 days (for heatmap)
export function useDailyRewards() {
  const { rows, loading } = useTransactions();
  return useMemo(() => {
    const days = 90;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = today.getTime() - (days - 1) * 24 * 3600 * 1000;
    const buckets = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const d = new Date(start + i * 24 * 3600 * 1000);
      buckets.set(d.toISOString().slice(0, 10), 0);
    }
    rows.forEach((r) => {
      const k = classifyReward(r.type);
      if (!k) return;
      const t = new Date(r.occurred_at).getTime();
      if (t < start) return;
      const key = new Date(r.occurred_at).toISOString().slice(0, 10);
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + Number(r.amount ?? 0));
      }
    });
    const data = Array.from(buckets.entries()).map(([date, value]) => ({ date, value }));
    const max = data.reduce((m, d) => Math.max(m, d.value), 0);
    const hasData = max > 0;
    return { data, max, loading, hasData };
  }, [rows, loading]);
}

// Staking rewards earned + ROI (uses wallet.staking as base)
export function useStakingEarnings(stakingBase: number) {
  const { rows, loading } = useTransactions();
  return useMemo(() => {
    const earned = rows
      .filter((r) => classifyReward(r.type) === "staking")
      .reduce((s, r) => s + Number(r.amount ?? 0), 0);
    const roi = stakingBase > 0 ? (earned / stakingBase) * 100 : 0;
    return { earned, roi, loading };
  }, [rows, loading, stakingBase]);
}
