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
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/wallet-edit")({
  component: WalletEditPage,
});

function WalletEditPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [usd, setUsd] = useState("0");
  const [rewards, setRewards] = useState("0");
  const [staking, setStaking] = useState("0");
  const [saving, setSaving] = useState(false);

  const [network, setNetwork] = useState("BSC");
  const [networkLabel, setNetworkLabel] = useState("BNB Smart Chain (BEP20)");
  const [address, setAddress] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrPath, setQrPath] = useState<string | null>(null);

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
      .then(async ({ data }) => {
        if (!data) return;
        setNetwork(data.network ?? "BSC");
        setNetworkLabel(data.network_label ?? "");
        setAddress(data.wallet_address ?? "");
        const stored = data.qr_url ?? null;
        if (!stored) {
          setQrUrl(null);
          return;
        }
        // qr_url now stores the storage path (legacy rows stored a full public URL).
        const path = stored.includes("/deposit-qr/")
          ? stored.split("/deposit-qr/")[1].split("?")[0]
          : stored;
        const { data: signed } = await supabase.storage
          .from("deposit-qr")
          .createSignedUrl(path, 60 * 60);
        setQrUrl(signed?.signedUrl ?? null);
        setQrPath(path);
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
    else toast.success(t("pages.walletEdit.toast.walletUpdated"));
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
    // Bucket is private — store the path and use a signed URL for display.
    const { data: signed } = await supabase.storage.from("deposit-qr").createSignedUrl(path, 60 * 60);
    setQrUrl(signed?.signedUrl ?? null);
    setQrPath(path);
    setUploading(false);
    toast.success(t("pages.walletEdit.toast.qrUploaded"));
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
        qr_url: qrPath,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    setSavingDeposit(false);
    if (error) toast.error(error.message);
    else toast.success(t("pages.walletEdit.toast.depositSettingsSaved"));
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t("pages.walletEdit.title")} description={t("pages.walletEdit.description")} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="liquid-glass space-y-4 rounded-xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{t("pages.walletEdit.balances.title")}</h2>
          <div className="space-y-1.5">
            <Label htmlFor="usd">{t("pages.walletEdit.balances.usdWallet")}</Label>
            <Input id="usd" type="number" step="0.01" value={usd} onChange={(e) => setUsd(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rewards">{t("pages.walletEdit.balances.rewardsWallet")}</Label>
            <Input id="rewards" type="number" step="0.01" value={rewards} onChange={(e) => setRewards(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="staking">{t("pages.walletEdit.balances.stakingAmount")}</Label>
            <Input id="staking" type="number" step="0.01" value={staking} onChange={(e) => setStaking(e.target.value)} />
          </div>
          <Button onClick={save} disabled={saving || !user} className="w-full">
            {saving ? t("pages.walletEdit.actions.saving") : t("pages.walletEdit.actions.saveBalances")}
          </Button>
        </div>

        <div className="liquid-glass space-y-4 rounded-xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{t("pages.walletEdit.depositSettings.title")}</h2>

          <div className="space-y-1.5">
            <Label htmlFor="network">{t("pages.walletEdit.depositSettings.network")}</Label>
            <Input id="network" value={network} onChange={(e) => setNetwork(e.target.value)} placeholder="BSC" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="networkLabel">{t("pages.walletEdit.depositSettings.networkLabel")}</Label>
            <Input id="networkLabel" value={networkLabel} onChange={(e) => setNetworkLabel(e.target.value)} placeholder="BNB Smart Chain (BEP20)" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">{t("pages.walletEdit.depositSettings.walletAddress")}</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x..." className="font-mono" />
          </div>

          <div className="space-y-2">
            <Label>{t("pages.walletEdit.depositSettings.qrCode")}</Label>
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
                {qrUrl ? (
                  <img src={qrUrl} alt={t("pages.walletEdit.depositSettings.qrPreviewAlt")} className="h-full w-full object-contain" />
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
                  {uploading ? t("pages.walletEdit.actions.uploading") : qrUrl ? t("pages.walletEdit.actions.replaceQr") : t("pages.walletEdit.actions.uploadQr")}
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={saveDeposit} disabled={savingDeposit || !user} className="w-full">
            {savingDeposit ? t("pages.walletEdit.actions.saving") : t("pages.walletEdit.actions.saveDepositSettings")}
          </Button>
        </div>
      </div>

      <QuizUploadSection />
      <MonthlyReportUploadSection />
    </div>
  );
}

function QuizUploadSection() {
  const { t } = useTranslation();
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
      // @ts-expect-error no types for browser build
      const mammoth: any = await import("mammoth/mammoth.browser");
      const buf = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buf });
      const parsed = parseQuizText(result.value || "");
      if (parsed.length === 0) {
        toast.error(t("pages.walletEdit.toast.noQuestions"));
        return;
      }
      const rows = parsed.map((q) => ({ ...q, created_by: user.id }));
      const { error } = await supabase.from("quiz_questions").insert(rows);
      if (error) throw error;
      toast.success(t("pages.walletEdit.toast.importedQuestions", { count: parsed.length }));
      await refresh();
    } catch (err: any) {
      toast.error(err?.message ?? t("pages.walletEdit.toast.failedToImport"));
    } finally {
      setParsing(false);
      if (docxRef.current) docxRef.current.value = "";
    }
  };

  const clearCategory = async (category: "company" | "marketing") => {
    if (!user) return;
    const categoryName = category === "company" ? t("nav.qnaCompany") : t("nav.qnaMarketing");
    if (!confirm(t("pages.walletEdit.confirm.deleteCategory", { category: categoryName }))) return;
    const { error } = await supabase
      .from("quiz_questions")
      .delete()
      .eq("category", category)
      .eq("created_by", user.id);
    if (error) return toast.error(error.message);
    toast.success(t("pages.walletEdit.toast.cleared"));
    refresh();
  };

  return (
    <div className="liquid-glass space-y-4 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            {t("pages.walletEdit.quiz.title")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("pages.walletEdit.quiz.description")}
          </p>
        </div>
        <div className="flex shrink-0 gap-2 text-xs">
          <span className="rounded-md border border-border px-2 py-1">
            {t("pages.walletEdit.quiz.company")}<b className="text-gold">{counts.company}</b>
          </span>
          <span className="rounded-md border border-border px-2 py-1">
            {t("pages.walletEdit.quiz.marketing")}<b className="text-gold">{counts.marketing}</b>
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
          {parsing ? t("pages.walletEdit.actions.parsing") : t("pages.walletEdit.actions.uploadDocx")}
        </Button>
        <Button type="button" variant="outline" onClick={() => clearCategory("company")} disabled={!user}>
          <Trash2 className="mr-2 h-4 w-4" /> {t("pages.walletEdit.actions.clearCompany")}
        </Button>
        <Button type="button" variant="outline" onClick={() => clearCategory("marketing")} disabled={!user}>
          <Trash2 className="mr-2 h-4 w-4" /> {t("pages.walletEdit.actions.clearMarketing")}
        </Button>
      </div>

      <details className="rounded-md border border-border p-3 text-xs">
        <summary className="cursor-pointer font-medium text-foreground">
          <FileText className="mr-1 inline h-3.5 w-3.5" /> {t("pages.walletEdit.quiz.expectedFormat")}
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
          {t("pages.walletEdit.quiz.hint.part1")}<b>[Company]</b>{t("pages.walletEdit.quiz.hint.part2")}<b>[Marketing plan]</b>{t("pages.walletEdit.quiz.hint.part3")}<b>A)</b>{t("pages.walletEdit.quiz.hint.part4")}<b>B)</b>{t("pages.walletEdit.quiz.hint.part5")}<b>Answer: X</b>{" "}
          {t("pages.walletEdit.quiz.hint.part6")}
        </p>
      </details>
    </div>
  );
}

type MonthlyReport = {
  id: string;
  title: string;
  period: string | null;
  file_url: string;
  file_size: number | null;
  created_at: string;
};

function MonthlyReportUploadSection() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");
  const [uploading, setUploading] = useState(false);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const pdfRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    const { data } = await supabase
      .from("monthly_reports")
      .select("id, title, period, file_url, file_size, created_at")
      .order("created_at", { ascending: false });
    setReports((data ?? []) as MonthlyReport[]);
  };

  useEffect(() => {
    refresh();
  }, []);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("[monthly-report] picked", file?.name, file?.size, file?.type, "user?", !!user);
    if (!file || !user) {
      if (!user) toast.error("You must be signed in to upload");
      return;
    }
    const effectiveTitle = title.trim() || file.name.replace(/\.[^.]+$/, "");
    setUploading(true);
    try {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from("monthly-reports")
        .upload(path, file, { contentType: file.type || "application/pdf", upsert: false });
      console.log("[monthly-report] storage upload result", upErr);
      if (upErr) throw upErr;
      // Bucket is private — store the storage path; readers create signed URLs
      const { error } = await supabase.from("monthly_reports").insert({
        title: effectiveTitle,
        period: period.trim() || null,
        file_url: path,
        file_size: file.size,
        uploaded_by: user.id,
      });
      console.log("[monthly-report] insert result", error);
      if (error) throw error;
      toast.success(t("pages.walletEdit.monthlyReport.uploaded", "Monthly report uploaded"));
      setTitle("");
      setPeriod("");
      await refresh();
    } catch (err: any) {
      console.error("[monthly-report] upload failed", err);
      toast.error(err?.message ?? "Upload failed");
    } finally {
      if (pdfRef.current) pdfRef.current.value = "";
      setUploading(false);
    }
  };

  const remove = async (r: MonthlyReport) => {
    if (!confirm(t("pages.walletEdit.monthlyReport.confirmDelete", "Delete this report?"))) return;
    const { error } = await supabase.from("monthly_reports").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success(t("pages.walletEdit.monthlyReport.deleted", "Deleted"));
    refresh();
  };

  return (
    <div className="liquid-glass space-y-4 rounded-xl p-5">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          {t("pages.walletEdit.monthlyReport.title", "Monthly Report")}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("pages.walletEdit.monthlyReport.description", "Upload monthly overview PDFs visible to all members.")}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="mr-title">{t("pages.walletEdit.monthlyReport.titleLabel", "Report title")}</Label>
          <Input
            id="mr-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="October 2025 Overview"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mr-period">{t("pages.walletEdit.monthlyReport.periodLabel", "Period (optional)")}</Label>
          <Input id="mr-period" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="Oct 2025" />
        </div>
      </div>

      <input ref={pdfRef} type="file" accept="application/pdf" onChange={onPick} className="hidden" />
      <Button
        type="button"
        onClick={() => pdfRef.current?.click()}
        disabled={uploading || !user}
        className="bg-gradient-to-r from-gold to-amber-400 text-background hover:opacity-90"
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading
          ? t("pages.walletEdit.actions.uploading")
          : t("pages.walletEdit.monthlyReport.uploadPdf", "Upload PDF")}
      </Button>

      {reports.length > 0 && (
        <div className="space-y-2 pt-2">
          {reports.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <div className="truncate font-medium text-foreground">{r.title}</div>
                <div className="text-xs text-muted-foreground">
                  {r.period ? `${r.period} · ` : ""}
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={r.file_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4" />
                  </a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => remove(r)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
