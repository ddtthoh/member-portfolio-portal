import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type RewardType = "staking" | "referral" | "team" | "leader" | "global" | "par_rank";

export const REWARD_TYPES: RewardType[] = [
  "staking",
  "referral",
  "team",
  "leader",
  "par_rank",
  "global",
];

// Distinct color per reward type — referenced everywhere so colors tally.
export const REWARD_COLORS: Record<RewardType, string> = {
  staking: "var(--reward-staking)",
  referral: "var(--reward-referral)",
  team: "var(--reward-team)",
  leader: "var(--reward-leader)",
  global: "var(--reward-global)",
  par_rank: "var(--reward-par_rank)",
};

// Deterministic PRNG — same seed → same numbers across asset-analysis & reports.
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
const MOCK_RNG = seeded(0xC0FFEE);
// Each reward type gets a fixed total in [1000, 8000] — generated once.
export const MOCK_REWARD_TOTALS: Record<RewardType, number> = REWARD_TYPES.reduce((acc, k) => {
  acc[k] = Math.round(1000 + MOCK_RNG() * 7000);
  return acc;
}, {} as Record<RewardType, number>);

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

// Cumulative rewards-by-type over N days.
// Each point has { date, staking, referral, team, leader, global, par_rank, total }
// where each reward field is the running total up to that date.
// Falls back to deterministic mock that sums to MOCK_REWARD_TOTALS at the end.
export function useRewardsCumulative(days: 7 | 30 | 90) {
  const { rows, loading } = useTransactions();
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = today.getTime() - (days - 1) * 24 * 3600 * 1000;

    // per-day delta per reward type
    const dayKeys: string[] = [];
    const deltas: Record<string, Record<RewardType, number>> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(start + i * 24 * 3600 * 1000);
      const k = d.toISOString().slice(0, 10);
      dayKeys.push(k);
      deltas[k] = { staking: 0, referral: 0, team: 0, leader: 0, global: 0, par_rank: 0 };
    }

    let real = false;
    rows.forEach((r) => {
      const k = classifyReward(r.type);
      if (!k) return;
      const t = new Date(r.occurred_at).getTime();
      if (t < start) return;
      const key = new Date(r.occurred_at).toISOString().slice(0, 10);
      if (deltas[key]) {
        deltas[key][k] += Number(r.amount ?? 0);
        real = true;
      }
    });

    if (!real) {
      // Deterministic distribution so each type's last cumulative == MOCK_REWARD_TOTALS[type]
      const rng = seeded(0xA11CE ^ days);
      REWARD_TYPES.forEach((type) => {
        const weights = dayKeys.map(() => (rng() < 0.3 ? 0 : 0.2 + rng()));
        const wsum = weights.reduce((a, b) => a + b, 0) || 1;
        dayKeys.forEach((k, i) => {
          deltas[k][type] = (MOCK_REWARD_TOTALS[type] * weights[i]) / wsum;
        });
      });
    }

    const cum: Record<RewardType, number> = {
      staking: 0, referral: 0, team: 0, leader: 0, global: 0, par_rank: 0,
    };
    const data = dayKeys.map((date) => {
      REWARD_TYPES.forEach((k) => { cum[k] += deltas[date][k]; });
      const total = REWARD_TYPES.reduce((s, k) => s + cum[k], 0);
      return {
        date,
        staking: Math.round(cum.staking * 100) / 100,
        referral: Math.round(cum.referral * 100) / 100,
        team: Math.round(cum.team * 100) / 100,
        leader: Math.round(cum.leader * 100) / 100,
        global: Math.round(cum.global * 100) / 100,
        par_rank: Math.round(cum.par_rank * 100) / 100,
        total: Math.round(total * 100) / 100,
      };
    });

    return { data, loading, hasData: true, isMock: !real };
  }, [rows, loading, days]);
}

// Total per reward bucket — falls back to MOCK_REWARD_TOTALS when empty.
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
    const real = REWARD_TYPES.some((k) => totals[k] > 0);
    const source = real ? totals : MOCK_REWARD_TOTALS;
    const data = REWARD_TYPES.map((key) => ({ key, value: source[key] }));
    return { data, loading, hasData: true, isMock: !real };
  }, [rows, loading]);
}

// Stacked monthly rewards for last 6 months — fallback distributes
// MOCK_REWARD_TOTALS across the 6 months so column sums per type tally exactly.
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
      const init: Record<string, number> = {};
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
    const real = rows.some((r) => classifyReward(r.type));
    if (!real) {
      // distribute each type's total across 6 months with deterministic weights
      const rng = seeded(0xBADA55);
      REWARD_TYPES.forEach((k) => {
        const weights = months.map(() => 0.4 + rng() * 0.6);
        const sum = weights.reduce((a, b) => a + b, 0);
        months.forEach((m, i) => {
          const v = (MOCK_REWARD_TOTALS[k] * weights[i]) / sum;
          map.get(m.key)![k] = Math.round(v * 100) / 100;
        });
      });
    }
    const data = months.map((m) => ({ month: m.label, ...(map.get(m.key) ?? {}) }));
    return { data, loading, hasData: true, isMock: !real };
  }, [rows, loading]);
}

// Daily rewards for last 90 days (for heatmap) — fallback synthesises
// daily totals that sum to the overall MOCK total.
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
    let real = false;
    buckets.forEach((v) => { if (v > 0) real = true; });
    if (!real) {
      const grand = REWARD_TYPES.reduce((s, k) => s + MOCK_REWARD_TOTALS[k], 0);
      const rng = seeded(0xFACADE);
      const weights: number[] = [];
      let wsum = 0;
      for (let i = 0; i < days; i++) {
        // many zero days, occasional spikes
        const w = rng() < 0.35 ? 0 : rng() * (rng() < 0.1 ? 3 : 1);
        weights.push(w); wsum += w;
      }
      const keys = Array.from(buckets.keys());
      keys.forEach((k, i) => {
        const v = wsum > 0 ? (grand * weights[i]) / wsum : 0;
        buckets.set(k, Math.round(v * 100) / 100);
      });
    }
    const data = Array.from(buckets.entries()).map(([date, value]) => ({ date, value }));
    const max = data.reduce((m, d) => Math.max(m, d.value), 0);
    return { data, max, loading, hasData: true, isMock: !real };
  }, [rows, loading]);
}

// Staking rewards earned + ROI (uses wallet.staking as base)
export function useStakingEarnings(stakingBase: number) {
  const { rows, loading } = useTransactions();
  return useMemo(() => {
    const realEarned = rows
      .filter((r) => classifyReward(r.type) === "staking")
      .reduce((s, r) => s + Number(r.amount ?? 0), 0);
    const earned = realEarned > 0 ? realEarned : MOCK_REWARD_TOTALS.staking;
    const roi = stakingBase > 0 ? (earned / stakingBase) * 100 : 0;
    return { earned, roi, loading, isMock: realEarned === 0 };
  }, [rows, loading, stakingBase]);
}
