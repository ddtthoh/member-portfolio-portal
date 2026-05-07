import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/wallet-edit")({
  component: WalletEditPage,
});

function WalletEditPage() {
  const { user } = useAuth();
  const [usd, setUsd] = useState("0");
  const [rewards, setRewards] = useState("0");
  const [staking, setStaking] = useState("0");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("wallets")
      .select("usd_balance, rewards_balance, staking_balance")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setUsd(String(data.usd_balance ?? 0));
        setRewards(String(data.rewards_balance ?? 0));
        setStaking(String(data.staking_balance ?? 0));
      });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("wallets")
      .upsert(
        {
          user_id: user.id,
          usd_balance: Number(usd) || 0,
          rewards_balance: Number(rewards) || 0,
          staking_balance: Number(staking) || 0,
        },
        { onConflict: "user_id" }
      );
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Wallet updated");
    }
  };

  return (
    <div>
      <PageHeader
        title="Edit Wallet"
        description="Temporary tool — update your USD, Rewards and Staking balances. The portal will sync instantly."
      />

      <div className="liquid-glass max-w-md space-y-4 rounded-xl p-5">
        <div className="space-y-1.5">
          <Label htmlFor="usd">USD Wallet</Label>
          <Input id="usd" type="number" step="0.01" value={usd} onChange={(e) => setUsd(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rewards">Rewards Wallet</Label>
          <Input id="rewards" type="number" step="0.01" value={rewards} onChange={(e) => setRewards(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="staking">Staking Amount</Label>
          <Input id="staking" type="number" step="0.01" value={staking} onChange={(e) => setStaking(e.target.value)} />
        </div>
        <Button onClick={save} disabled={saving || !user} className="w-full">
          {saving ? "Saving…" : "Save"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Total = USD + Rewards + Staking. Tell me when you're done and I'll delete this page.
        </p>
      </div>
    </div>
  );
}
