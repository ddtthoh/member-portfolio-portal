import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type Wallet = {
  usd: number;
  rewards: number;
  total: number;
};

const ZERO: Wallet = { usd: 0, rewards: 0, total: 0 };

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
        .select("usd_balance, rewards_balance")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!active) return;
      const usd = Number(data?.usd_balance ?? 0);
      const rewards = Number(data?.rewards_balance ?? 0);
      setWallet({ usd, rewards, total: usd + rewards });
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel(`wallet-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wallets",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = (payload.new ?? payload.old) as
            | { usd_balance: number | string; rewards_balance: number | string }
            | undefined;
          if (!row) return;
          const usd = Number(row.usd_balance ?? 0);
          const rewards = Number(row.rewards_balance ?? 0);
          setWallet({ usd, rewards, total: usd + rewards });
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
