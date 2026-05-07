import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, QrCode, FileText, Trash2 } from "lucide-react";
import { parseQuizText } from "@/lib/quiz-parser";

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
            <Label htmlFor="staking">Staking Amount</Label>
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

      <QuizUploadSection />
    </div>
  );
}

function QuizUploadSection() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<{ company: number; marketing: number }>({ company: 0, marketing: 0 });
  const [parsing, setParsing] = useState(false);
  const docxRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    const [{ count: c1 }, { count: c2 }] = await Promise.all([
      supabase.from("quiz_questions").select("*", { count: "exact", head: true }).eq("category", "company"),
      supabase.from("quiz_questions").select("*", { count: "exact", head: true }).eq("category", "marketing"),
    ]);
    setCounts({ company: c1 ?? 0, marketing: c2 ?? 0 });
  };

  useEffect(() => {
    refresh();
  }, []);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setParsing(true);
    try {
      const mammoth: any = await import("mammoth/mammoth.browser");
      const buf = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buf });
      const parsed = parseQuizText(result.value || "");
      if (parsed.length === 0) {
        toast.error("No questions detected. Check formatting (see hint below).");
        return;
      }
      const rows = parsed.map((q) => ({ ...q, created_by: user.id }));
      const { error } = await supabase.from("quiz_questions").insert(rows);
      if (error) throw error;
      toast.success(`Imported ${parsed.length} questions`);
      await refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to import");
    } finally {
      setParsing(false);
      if (docxRef.current) docxRef.current.value = "";
    }
  };

  const clearCategory = async (category: "company" | "marketing") => {
    if (!user) return;
    if (!confirm(`Delete all your uploaded ${category} questions?`)) return;
    const { error } = await supabase
      .from("quiz_questions")
      .delete()
      .eq("category", category)
      .eq("created_by", user.id);
    if (error) return toast.error(error.message);
    toast.success("Cleared");
    refresh();
  };

  return (
    <div className="liquid-glass space-y-4 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            Q&amp;A Question Bank
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload a .docx file containing multiple-choice questions. The system will randomly
            pick 10 each time the client takes the test.
          </p>
        </div>
        <div className="flex shrink-0 gap-2 text-xs">
          <span className="rounded-md border border-border px-2 py-1">
            Company: <b className="text-gold">{counts.company}</b>
          </span>
          <span className="rounded-md border border-border px-2 py-1">
            Marketing: <b className="text-gold">{counts.marketing}</b>
          </span>
        </div>
      </div>

      <input ref={docxRef} type="file" accept=".docx" onChange={onPick} className="hidden" />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => docxRef.current?.click()}
          disabled={parsing || !user}
          className="bg-gold text-gold-foreground hover:bg-gold/90"
        >
          <Upload className="mr-2 h-4 w-4" />
          {parsing ? "Parsing…" : "Upload .docx"}
        </Button>
        <Button type="button" variant="outline" onClick={() => clearCategory("company")} disabled={!user}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear Company
        </Button>
        <Button type="button" variant="outline" onClick={() => clearCategory("marketing")} disabled={!user}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear Marketing
        </Button>
      </div>

      <details className="rounded-md border border-border p-3 text-xs">
        <summary className="cursor-pointer font-medium text-foreground">
          <FileText className="mr-1 inline h-3.5 w-3.5" /> Expected .docx format
        </summary>
        <pre className="mt-2 whitespace-pre-wrap text-muted-foreground">
{`[Company]
1. What year was the company founded?
A) 2010
B) 2015
C) 2018
D) 2020
Answer: B

2. Who is the CEO?
A) Alice
B) Bob
C) Carol
D) Dan
Answer: C

[Marketing plan]
1. What is the main referral bonus tier?
A) 5%
B) 10%
C) 15%
D) 20%
Answer: B`}
        </pre>
        <p className="mt-2 text-muted-foreground">
          Use <b>[Company]</b> or <b>[Marketing plan]</b> headers to switch category. Questions
          start with a number, options use <b>A)</b> / <b>B)</b> etc., and <b>Answer: X</b>{" "}
          marks the correct letter.
        </p>
      </details>
    </div>
  );
}
