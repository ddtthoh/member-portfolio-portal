import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, QrCode } from "lucide-react";

export const Route = createFileRoute("/portal/wallet-edit")({
  component: WalletEditPage,
});

function WalletEditPage() {
  const { user } = useAuth();
  const [usd, setUsd] = useState("0");
  const [rewards, setRewards] = useState("0");
  const [staking, setStaking] = useState("0");
  const [saving, setSaving] = useState(false);

  const [network, setNetwork] = useState("BSC");
  const [networkLabel, setNetworkLabel] = useState("BNB Smart Chain (BEP20)");
  const [address, setAddress] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [savingDeposit, setSavingDeposit] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
    supabase
      .from("deposit_settings")
      .select("network, network_label, wallet_address, qr_url")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setNetwork(data.network ?? "BSC");
        setNetworkLabel(data.network_label ?? "");
        setAddress(data.wallet_address ?? "");
        setQrUrl(data.qr_url ?? null);
      });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("wallets").upsert(
      {
        user_id: user.id,
        usd_balance: Number(usd) || 0,
        rewards_balance: Number(rewards) || 0,
        staking_balance: Number(staking) || 0,
      },
      { onConflict: "user_id" }
    );
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Wallet updated");
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${user.id}/qr-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("deposit-qr").upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      setUploading(false);
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from("deposit-qr").getPublicUrl(path);
    setQrUrl(data.publicUrl);
    setUploading(false);
    toast.success("QR uploaded");
  };

  const saveDeposit = async () => {
    if (!user) return;
    setSavingDeposit(true);
    const { error } = await supabase.from("deposit_settings").upsert(
      {
        user_id: user.id,
        network,
        network_label: networkLabel,
        wallet_address: address,
        qr_url: qrUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    setSavingDeposit(false);
    if (error) toast.error(error.message);
    else toast.success("Deposit settings saved");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Wallet" description="Update balances, deposit network, address and QR code." />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="liquid-glass space-y-4 rounded-xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Balances</h2>
          <div className="space-y-1.5">
            <Label htmlFor="usd">USD Wallet</Label>
            <Input id="usd" type="number" step="0.01" value={usd} onChange={(e) => setUsd(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rewards">Rewards Wallet</Label>
            <Input id="rewards" type="number" step="0.01" value={rewards} onChange={(e) => setRewards(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="staking">Participation Amount</Label>
            <Input id="staking" type="number" step="0.01" value={staking} onChange={(e) => setStaking(e.target.value)} />
          </div>
          <Button onClick={save} disabled={saving || !user} className="w-full">
            {saving ? "Saving…" : "Save Balances"}
          </Button>
        </div>

        <div className="liquid-glass space-y-4 rounded-xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Deposit Settings</h2>

          <div className="space-y-1.5">
            <Label htmlFor="network">Network</Label>
            <Input id="network" value={network} onChange={(e) => setNetwork(e.target.value)} placeholder="BSC" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="networkLabel">Network Label</Label>
            <Input id="networkLabel" value={networkLabel} onChange={(e) => setNetworkLabel(e.target.value)} placeholder="BNB Smart Chain (BEP20)" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Wallet Address</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x..." className="font-mono" />
          </div>

          <div className="space-y-2">
            <Label>QR Code</Label>
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
                {qrUrl ? (
                  <img src={qrUrl} alt="QR preview" className="h-full w-full object-contain" />
                ) : (
                  <QrCode className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} className="hidden" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading || !user}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading…" : qrUrl ? "Replace QR" : "Upload QR"}
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={saveDeposit} disabled={savingDeposit || !user} className="w-full">
            {savingDeposit ? "Saving…" : "Save Deposit Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
