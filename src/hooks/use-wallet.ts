import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type Wallet = {
  usd: number;
  rewards: number;
  staking: number;
  total: number;
};

const ZERO: Wallet = { usd: 0, rewards: 0, staking: 0, total: 0 };

const toWallet = (row: {
  usd_balance?: number | string | null;
  rewards_balance?: number | string | null;
  staking_balance?: number | string | null;
} | null | undefined): Wallet => {
  const usd = Number(row?.usd_balance ?? 0);
  const rewards = Number(row?.rewards_balance ?? 0);
  const staking = Number(row?.staking_balance ?? 0);
  return { usd, rewards, staking, total: usd + rewards + staking };
};

export function useWallet(): { wallet: Wallet; loading: boolean } {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet>(ZERO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWallet(ZERO);
      setLoading(false);
      return;
    }

    let active = true;

    const load = async () => {
      const { data } = await supabase
        .from("wallets")
        .select("usd_balance, rewards_balance, staking_balance")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!active) return;
      setWallet(toWallet(data));
      setLoading(false);
    };

    load();

    const channelName = `wallet-${user.id}-${crypto.randomUUID()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wallets",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = (payload.new ?? payload.old) as Parameters<typeof toWallet>[0];
          if (!row) return;
          setWallet(toWallet(row));
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { wallet, loading };
}
