import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Plus, Wallet as WalletIcon, Pencil, Trash2, Copy, Check,
  Filter as FilterIcon, ChevronDown, Calendar as CalendarIcon, Search, RotateCcw,
  History, Inbox, Download, ArrowUpFromLine, Lock,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useWallet } from "@/hooks/use-wallet";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/withdrawal")({
  component: WithdrawalPage,
});

const ADMIN_FEE_RATE = 0.03;
const ADMIN_FEE_MIN = 3;
const MIN_AMOUNT = 10;
const ADDR_RE = /^0x[a-fA-F0-9]{40}$/;

type WalletRow = { id: string; wallet_name: string; wallet_address: string; chain: string; created_at: string };
type WithdrawalRow = {
  id: string; created_at: string; reference_number: string; recipient_address: string;
  chain: string; amount: number; admin_fee: number; receive_amount: number;
  status: string; remark: string | null; transaction_hash: string | null;
};

function shortAddr(a: string) { return a.length > 16 ? `${a.slice(0, 8)}…${a.slice(-6)}` : a; }
function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function WithdrawalPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { wallet } = useWallet();
  const [wallets, setWallets] = useState<WalletRow[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRow[]>([]);
  const [loadingHist, setLoadingHist] = useState(true);

  // Add/Edit wallet dialog
  const [walletDialog, setWalletDialog] = useState<{ open: boolean; editing: WalletRow | null }>({ open: false, editing: null });
  const [wName, setWName] = useState("");
  const [wAddr, setWAddr] = useState("");
  const [savingWallet, setSavingWallet] = useState(false);

  // New withdrawal form
  const [selWalletId, setSelWalletId] = useState<string>("");
  const [amountStr, setAmountStr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Filter
  const [filterOpen, setFilterOpen] = useState(false);
  const [fDate, setFDate] = useState("");
  const [fRef, setFRef] = useState("");
  const [fAddr, setFAddr] = useState("");
  const [fHash, setFHash] = useState("");
  const [fStatus, setFStatus] = useState<string>("all");
  const [applied, setApplied] = useState({ date: "", ref: "", addr: "", hash: "", status: "all" });

  const loadWallets = async () => {
    if (!user) return;
    const { data } = await supabase.from("withdrawal_wallets")
      .select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setWallets((data ?? []) as WalletRow[]);
  };
  const loadWithdrawals = async () => {
    if (!user) return;
    setLoadingHist(true);
    const { data } = await supabase.from("withdrawals")
      .select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setWithdrawals((data ?? []) as WithdrawalRow[]);
    setLoadingHist(false);
  };
  useEffect(() => { loadWallets(); loadWithdrawals(); /* eslint-disable-next-line */ }, [user]);

  const amount = Number(amountStr) || 0;
  const adminFee = amount > 0 ? Math.max(ADMIN_FEE_MIN, amount * ADMIN_FEE_RATE) : 0;
  const receive = Math.max(0, amount - adminFee);
  const exceedsBalance = amount > wallet.usd;
  const amountValid = amount >= MIN_AMOUNT && !exceedsBalance;

  const openAddWallet = () => { setWName(""); setWAddr(""); setWalletDialog({ open: true, editing: null }); };
  const openEditWallet = (w: WalletRow) => { setWName(w.wallet_name); setWAddr(w.wallet_address); setWalletDialog({ open: true, editing: w }); };

  const saveWallet = async () => {
    if (!user) return;
    if (!wName.trim()) { toast.error(t("pages.withdrawal.toast.walletNameRequired")); return; }
    if (!ADDR_RE.test(wAddr.trim())) { toast.error(t("pages.withdrawal.toast.invalidAddress")); return; }
    setSavingWallet(true);
    const payload = { user_id: user.id, wallet_name: wName.trim(), wallet_address: wAddr.trim(), chain: "BEP20" };
    const { error } = walletDialog.editing
      ? await supabase.from("withdrawal_wallets").update(payload).eq("id", walletDialog.editing.id)
      : await supabase.from("withdrawal_wallets").insert(payload);
    setSavingWallet(false);
    if (error) { toast.error(error.message); return; }
    toast.success(walletDialog.editing ? t("pages.withdrawal.toast.walletUpdated") : t("pages.withdrawal.toast.walletAdded"));
    setWalletDialog({ open: false, editing: null });
    loadWallets();
  };

  const deleteWallet = async (w: WalletRow) => {
    if (!confirm(t("pages.withdrawal.confirm.deleteWallet", { name: w.wallet_name }))) return;
    const { error } = await supabase.from("withdrawal_wallets").delete().eq("id", w.id);
    if (error) { toast.error(error.message); return; }
    toast.success(t("pages.withdrawal.toast.walletDeleted"));
    loadWallets();
  };

  const submitWithdrawal = async () => {
    if (!user) return;
    const w = wallets.find((x) => x.id === selWalletId);
    if (!w) { toast.error(t("pages.withdrawal.toast.selectWallet")); return; }
    if (!amountValid) { toast.error(t("pages.withdrawal.toast.invalidAmount")); return; }
    setSubmitting(true);
    const { error } = await supabase.from("withdrawals").insert({
      user_id: user.id, wallet_id: w.id, recipient_address: w.wallet_address,
      chain: "BEP20", amount, admin_fee: adminFee, receive_amount: receive, status: "pending",
    });
    setSubmitting(false);
    setConfirmOpen(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t("pages.withdrawal.toast.requestSubmitted"));
    setAmountStr(""); setSelWalletId("");
    loadWithdrawals();
  };

  const filtered = useMemo(() => withdrawals.filter((d) => {
    if (applied.date && !d.created_at.startsWith(applied.date)) return false;
    if (applied.ref && !d.reference_number.toLowerCase().includes(applied.ref.toLowerCase())) return false;
    if (applied.addr && !d.recipient_address.toLowerCase().includes(applied.addr.toLowerCase())) return false;
    if (applied.hash && !(d.transaction_hash ?? "").toLowerCase().includes(applied.hash.toLowerCase())) return false;
    if (applied.status !== "all" && d.status !== applied.status) return false;
    return true;
  }), [withdrawals, applied]);

  const apply = () => setApplied({ date: fDate.trim(), ref: fRef.trim(), addr: fAddr.trim(), hash: fHash.trim(), status: fStatus });
  const reset = () => { setFDate(""); setFRef(""); setFAddr(""); setFHash(""); setFStatus("all"); setApplied({ date: "", ref: "", addr: "", hash: "", status: "all" }); };

  const exportExcel = () => {
    if (filtered.length === 0) { toast.error(t("pages.withdrawal.toast.noRecordsExport")); return; }
    const rows = filtered.map((d) => ({
      [t("pages.withdrawal.tableHeaders.date")]: new Date(d.created_at).toLocaleString("sv-SE", { hour12: false }).slice(0, 19),
      [t("pages.withdrawal.tableHeaders.reference")]: d.reference_number,
      [t("pages.withdrawal.tableHeaders.recipientAddress")]: d.recipient_address,
      [t("pages.withdrawal.tableHeaders.chain")]: d.chain,
      [t("pages.withdrawal.tableHeaders.withdrawalAmt")]: Number(d.amount),
      [t("pages.withdrawal.tableHeaders.adminFee")]: Number(d.admin_fee),
      [t("pages.withdrawal.tableHeaders.receiveAmount")]: Number(d.receive_amount),
      [t("pages.withdrawal.tableHeaders.status")]: d.status,
      [t("pages.withdrawal.tableHeaders.remark")]: d.remark ?? "",
      [t("pages.withdrawal.tableHeaders.hash")]: d.transaction_hash ?? "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t("pages.withdrawal.title"));
    XLSX.writeFile(wb, `withdrawal-history-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success(t("pages.withdrawal.toast.excelExported"));
  };

  const copyVal = async (v: string, label = t("pages.deposit.toast.copied")) => { await navigator.clipboard.writeText(v); toast.success(label); };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      completed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
      pending: "border-amber-400/40 bg-amber-400/10 text-amber-300",
      processing: "border-sky-400/40 bg-sky-400/10 text-sky-300",
      rejected: "border-rose-400/40 bg-rose-400/10 text-rose-300",
    };
    const statusText: Record<string, string> = {
      completed: t("pages.withdrawal.filter.statusCompleted"),
      pending: t("pages.withdrawal.filter.statusPending"),
      processing: t("pages.withdrawal.filter.statusProcessing"),
      rejected: t("pages.withdrawal.filter.statusRejected"),
    };
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] ${map[s] ?? "border-border/60 bg-card/40 text-muted-foreground"}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />{statusText[s] || s}
      </span>
    );
  };

  return (
    <div>
      <PageHeader title={t("pages.withdrawal.title")} description={t("pages.withdrawal.pageDescription")} />

      {/* Important reminder */}
      <div className="mb-6">
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/60 bg-card/95 p-5 shadow-[0_10px_40px_-12px_rgba(245,158,11,0.55)] backdrop-blur-xl supports-[backdrop-filter]:bg-card/85">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_60%)]" />
          <div className="relative flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-500/60 bg-amber-500/20 text-amber-600 shadow-[0_0_20px_-4px_rgba(245,158,11,0.6)] dark:border-amber-400/50 dark:bg-amber-500/15 dark:text-amber-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">{t("pages.withdrawal.importantReminder.title")}</div>
              <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-foreground/90">
                <li className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500 dark:bg-amber-400" /><span>{t("pages.withdrawal.importantReminder.supportOnly")}<span className="font-semibold text-amber-700 dark:text-gold">USDT</span>{t("pages.withdrawal.importantReminder.viaThe")}<span className="font-semibold text-amber-700 dark:text-gold">BSC (BEP20)</span>{t("pages.withdrawal.importantReminder.networkSuffix")}</span></li>
                <li className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500 dark:bg-amber-400" /><span>{t("pages.withdrawal.importantReminder.wrongAddress")}<span className="font-semibold text-amber-700 dark:text-amber-300">{t("pages.withdrawal.importantReminder.permanentLoss")}</span>.</span></li>
                <li className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500 dark:bg-amber-400" /><span>{t("pages.withdrawal.importantReminder.processingTime")}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1 — New Withdrawal Request */}
      <SpotlightCard className="liquid-glass mb-6 overflow-hidden rounded-2xl">
        <div className="flex items-center gap-3 border-b border-border/40 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/40 bg-gradient-to-br from-gold/15 to-gold/5 text-gold shadow-[0_4px_16px_-4px_rgba(212,175,55,0.4)]">
            <ArrowUpFromLine className="h-4 w-4" />
          </div>
          <div>
            <div className="font-serif text-base font-semibold text-gold md:text-lg">{t("pages.withdrawal.newRequest.title")}</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">USDT · BEP20</div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-[1fr_320px] sm:p-8">
          <div className="space-y-5">
            {/* Credit Type */}
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{t("pages.withdrawal.newRequest.creditType")}</label>
              <div className="flex h-10 items-center justify-between rounded-md border border-border/60 bg-card/40 px-3 text-sm text-foreground/90">
                <span className="font-medium">USDT (BEP20)</span>
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>

            {/* Wallet Address */}
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{t("pages.withdrawal.newRequest.walletAddress")}</label>
              {wallets.length === 0 ? (
                <div className="rounded-md border border-dashed border-border/60 bg-card/30 px-3 py-3 text-sm text-muted-foreground">
                  {t("pages.withdrawal.newRequest.noWallets")}
                  <button onClick={openAddWallet} className="font-medium text-gold hover:underline">{t("pages.withdrawal.newRequest.addOneFirst")}</button>
                </div>
              ) : (
                <Select value={selWalletId} onValueChange={setSelWalletId}>
                  <SelectTrigger className="h-10 border-border/60 bg-card/40 text-sm focus-visible:ring-gold/40"><SelectValue placeholder={t("pages.withdrawal.newRequest.selectWallet")} /></SelectTrigger>
                  <SelectContent>
                    {wallets.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        <span className="font-medium">{w.wallet_name}</span>
                        <span className="ml-2 font-mono text-xs text-muted-foreground">{shortAddr(w.wallet_address)}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{t("pages.withdrawal.newRequest.amount")}</label>
              <Input type="number" inputMode="decimal" min={MIN_AMOUNT} step="0.01" placeholder={t("pages.withdrawal.newRequest.minAmount", { min: MIN_AMOUNT })}
                value={amountStr} onChange={(e) => setAmountStr(e.target.value)}
                className="h-11 border-border/60 bg-card/40 text-base tabular-nums focus-visible:ring-gold/40" />
              <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                <span>{t("pages.withdrawal.newRequest.available")}<span className="font-light tabular-nums tracking-tight text-foreground/80">${fmt(wallet.usd)}</span></span>
                {exceedsBalance && <span className="text-rose-300">{t("pages.withdrawal.newRequest.exceedsBalance")}</span>}
              </div>
            </div>

            <Button disabled={!selWalletId || !amountValid || submitting} onClick={() => setConfirmOpen(true)}
              className="h-11 w-full gap-2 bg-gradient-to-r from-gold to-amber-400 font-semibold text-black shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] hover:opacity-95 disabled:opacity-40">
              <ArrowUpFromLine className="h-4 w-4" /> {t("pages.withdrawal.newRequest.submit")}
            </Button>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-gold/[0.04] to-transparent p-5">
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{t("pages.withdrawal.summary.usdCredit")}</div>
            <div className="mt-1 text-2xl font-light tabular-nums tracking-tight text-gold sm:text-3xl">${fmt(wallet.usd)}</div>
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">{t("pages.withdrawal.summary.withdrawalAmount")}</dt><dd className="font-light tabular-nums tracking-tight text-foreground/90">${fmt(amount)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">{t("pages.withdrawal.summary.adminFee")}</dt><dd className="font-light tabular-nums tracking-tight text-foreground/90">${fmt(adminFee)}</dd></div>
              <div className="flex justify-between border-t border-border/50 pt-3"><dt className="font-medium text-gold">{t("pages.withdrawal.summary.receiveAmount")}</dt><dd className="text-base font-light tabular-nums tracking-tight text-gold">${fmt(receive)}</dd></div>
            </dl>
          </div>
        </div>
      </SpotlightCard>

      {/* SECTION 2 — Withdrawal Wallets */}
      <SpotlightCard className="liquid-glass mb-6 overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/40 bg-gradient-to-br from-gold/15 to-gold/5 text-gold shadow-[0_4px_16px_-4px_rgba(212,175,55,0.4)]">
              <WalletIcon className="h-4 w-4" />
            </div>
            <div>
              <div className="font-serif text-base font-semibold text-gold md:text-lg">{t("pages.withdrawal.wallets.title")}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t("pages.withdrawal.wallets.subtitle")}</div>
            </div>
          </div>
          <Button onClick={openAddWallet} className="h-9 gap-2 bg-gradient-to-r from-gold to-amber-400 font-semibold text-black shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] hover:opacity-95">
            <Plus className="h-4 w-4" /> {t("pages.withdrawal.wallets.addWallet")}
          </Button>
        </div>

        {wallets.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground"><WalletIcon className="h-6 w-6" /></div>
            <div className="text-sm font-medium text-foreground">{t("pages.withdrawal.wallets.noWalletsTitle")}</div>
            <div className="max-w-xs text-xs text-muted-foreground">{t("pages.withdrawal.wallets.noWalletsDesc")}</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-max px-6 py-5 sm:px-8">
              <div className="grid grid-cols-[18ch_18ch_minmax(40ch,1fr)_10ch] gap-x-8 pb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                <div>{t("pages.withdrawal.tableHeaders.date")}</div><div>{t("pages.withdrawal.tableHeaders.walletName")}</div><div>{t("pages.withdrawal.tableHeaders.walletAddress")}</div><div className="text-right">{t("pages.withdrawal.tableHeaders.action")}</div>
              </div>
              <div className="h-px bg-gradient-to-r from-gold/80 via-amber-400/60 to-orange-500/40" />
              <div className="divide-y divide-border/20">
                {wallets.map((w, i) => (
                  <motion.div key={w.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.25 }}
                    className="grid grid-cols-[18ch_18ch_minmax(40ch,1fr)_10ch] items-center gap-x-8 py-4 transition-colors hover:bg-gold/[0.025]">
                    <div className="font-mono text-sm tabular-nums text-foreground/85">{new Date(w.created_at).toLocaleString("sv-SE", { hour12: false }).slice(0, 19)}</div>
                    <div className="text-sm text-foreground">{w.wallet_name}</div>
                    <button onClick={() => copyVal(w.wallet_address, t("pages.deposit.toast.addressCopied"))} className="group inline-flex items-center gap-2 truncate text-left font-mono text-sm text-foreground/85 transition hover:text-gold" title={w.wallet_address}>
                      <span className="truncate"><span className="text-gold">{w.wallet_address.slice(0, 6)}</span>{w.wallet_address.slice(6, -6)}<span className="text-gold">{w.wallet_address.slice(-6)}</span></span>
                      <Copy className="h-3 w-3 shrink-0 opacity-0 transition group-hover:opacity-60" />
                    </button>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEditWallet(w)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition hover:border-gold/50 hover:text-gold" aria-label={t("pages.withdrawal.actions.edit")}><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => deleteWallet(w)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition hover:border-rose-400/50 hover:text-rose-300" aria-label={t("pages.withdrawal.actions.delete")}><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SpotlightCard>

      {/* SECTION 3 — Filter */}
      <SpotlightCard className="liquid-glass mb-5 overflow-hidden rounded-2xl">
        <button type="button" onClick={() => setFilterOpen((v) => !v)} className="group flex w-full items-center justify-between px-6 py-4 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold"><FilterIcon className="h-4 w-4" /></div>
            <div className="text-sm font-semibold tracking-tight text-gold">{t("pages.deposit.filter.title")}</div>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${filterOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence initial={false}>
          {filterOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="overflow-hidden">
              <div className="border-t border-border/50 bg-gradient-to-b from-gold/[0.02] to-transparent px-6 py-5">
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                  <div className="space-y-1.5"><label className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground"><CalendarIcon className="h-3 w-3" /> {t("pages.deposit.filter.date")}</label>
                    <Input type="date" value={fDate} onChange={(e) => setFDate(e.target.value)} className="h-10 border-border/60 bg-card/40 text-sm focus-visible:ring-gold/40" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{t("pages.deposit.filter.reference")}</label>
                    <Input placeholder="WDR…" value={fRef} onChange={(e) => setFRef(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} className="h-10 border-border/60 bg-card/40 font-mono text-sm focus-visible:ring-gold/40" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{t("pages.withdrawal.filter.recipientAddress")}</label>
                    <Input placeholder="0x…" value={fAddr} onChange={(e) => setFAddr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} className="h-10 border-border/60 bg-card/40 font-mono text-sm focus-visible:ring-gold/40" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{t("pages.deposit.filter.hash")}</label>
                    <Input placeholder="0x…" value={fHash} onChange={(e) => setFHash(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} className="h-10 border-border/60 bg-card/40 font-mono text-sm focus-visible:ring-gold/40" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{t("pages.withdrawal.filter.status")}</label>
                    <Select value={fStatus} onValueChange={setFStatus}>
                      <SelectTrigger className="h-10 border-border/60 bg-card/40 text-sm focus-visible:ring-gold/40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("pages.withdrawal.filter.statusAll")}</SelectItem><SelectItem value="pending">{t("pages.withdrawal.filter.statusPending")}</SelectItem>
                        <SelectItem value="processing">{t("pages.withdrawal.filter.statusProcessing")}</SelectItem><SelectItem value="completed">{t("pages.withdrawal.filter.statusCompleted")}</SelectItem>
                        <SelectItem value="rejected">{t("pages.withdrawal.filter.statusRejected")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-muted-foreground">{t("pages.deposit.filter.showing")}<span className="font-semibold text-gold">{filtered.length}</span>{t("pages.deposit.filter.of")}{withdrawals.length}{t("pages.deposit.filter.records")}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={reset} className="h-9 gap-2 border-border/60 bg-transparent text-muted-foreground hover:border-gold/40 hover:text-gold"><RotateCcw className="h-3.5 w-3.5" /> {t("pages.deposit.filter.reset")}</Button>
                    <Button onClick={apply} className="h-9 gap-2 bg-gradient-to-r from-gold to-amber-400 font-semibold text-black shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] hover:opacity-95"><Search className="h-3.5 w-3.5" /> {t("pages.deposit.filter.apply")}</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SpotlightCard>

      {/* SECTION 4 — History */}
      <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/40 bg-gradient-to-br from-gold/15 to-gold/5 text-gold shadow-[0_4px_16px_-4px_rgba(212,175,55,0.4)]"><History className="h-4 w-4" /></div>
            <div>
              <div className="font-serif text-base font-semibold text-gold md:text-lg">{t("pages.withdrawal.history.title")}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t("pages.withdrawal.history.subtitle")}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportExcel} className="h-9 gap-2 border-border/60 bg-transparent text-muted-foreground hover:border-gold/40 hover:text-gold">
              <Download className="h-3.5 w-3.5" /> {t("pages.withdrawal.history.exportExcel")}
            </Button>
          </div>
        </div>

        {loadingHist ? (
          <div className="space-y-2 px-6 py-6 sm:px-8">{[0, 1, 2].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-muted/20" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground"><Inbox className="h-6 w-6" /></div>
            <div className="text-sm font-medium text-foreground">{t("pages.withdrawal.empty.title")}</div>
            <div className="max-w-xs text-xs text-muted-foreground">{withdrawals.length === 0 ? t("pages.withdrawal.empty.noRequests") : t("pages.withdrawal.empty.filtered")}</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-max px-6 py-6 sm:px-8">
              <div className="grid grid-cols-[18ch_20ch_28ch_10ch_14ch_12ch_14ch_14ch_18ch_28ch] gap-x-8 pb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                <div>{t("pages.withdrawal.tableHeaders.date")}</div><div>{t("pages.withdrawal.tableHeaders.reference")}</div><div>{t("pages.withdrawal.tableHeaders.recipientAddress")}</div><div>{t("pages.withdrawal.tableHeaders.chain")}</div>
                <div className="text-right">{t("pages.withdrawal.tableHeaders.withdrawalAmt")}</div><div className="text-right">{t("pages.withdrawal.tableHeaders.adminFee")}</div><div className="text-right">{t("pages.withdrawal.tableHeaders.receiveAmount")}</div>
                <div>{t("pages.withdrawal.tableHeaders.status")}</div><div>{t("pages.withdrawal.tableHeaders.remark")}</div><div>{t("pages.withdrawal.tableHeaders.hash")}</div>
              </div>
              <div className="h-px bg-gradient-to-r from-gold/80 via-amber-400/60 to-orange-500/40" />
              <div className="divide-y divide-border/20">
                {filtered.map((d, i) => (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.25 }}
                    className="group grid grid-cols-[18ch_20ch_28ch_10ch_14ch_12ch_14ch_14ch_18ch_28ch] items-center gap-x-8 py-4 transition-colors hover:bg-gold/[0.025]">
                    <div className="font-mono text-sm tabular-nums text-foreground/85">{new Date(d.created_at).toLocaleString("sv-SE", { hour12: false }).slice(0, 19)}</div>
                    <button onClick={() => copyVal(d.reference_number, t("pages.deposit.toast.referenceCopied"))} className="inline-flex items-center gap-2 truncate text-left font-mono text-sm text-foreground/85 transition hover:text-gold" title={d.reference_number}><span className="truncate">{d.reference_number}</span><Copy className="h-3 w-3 shrink-0 opacity-0 transition group-hover:opacity-60" /></button>
                    <button onClick={() => copyVal(d.recipient_address, t("pages.deposit.toast.addressCopied"))} className="inline-flex items-center gap-2 truncate text-left font-mono text-sm text-foreground/85 transition hover:text-gold" title={d.recipient_address}><span className="truncate">{shortAddr(d.recipient_address)}</span></button>
                    <div className="text-sm text-foreground/85">{d.chain}</div>
                    <div className="text-right text-sm font-light tabular-nums tracking-tight text-foreground/90">${fmt(Number(d.amount))}</div>
                    <div className="text-right text-sm font-light tabular-nums tracking-tight text-muted-foreground">${fmt(Number(d.admin_fee))}</div>
                    <div className="text-right text-sm font-light tabular-nums tracking-tight text-gold">${fmt(Number(d.receive_amount))}</div>
                    <div>{statusBadge(d.status)}</div>
                    <div className="truncate text-sm text-muted-foreground" title={d.remark ?? ""}>{d.remark || "—"}</div>
                    {d.transaction_hash ? (
                      <button onClick={() => copyVal(d.transaction_hash!, t("pages.deposit.toast.hashCopied"))} className="inline-flex items-center gap-2 truncate text-left font-mono text-xs text-foreground/85 transition hover:text-gold" title={d.transaction_hash}><span className="truncate">{shortAddr(d.transaction_hash)}</span><Copy className="h-3 w-3 shrink-0 opacity-0 transition group-hover:opacity-60" /></button>
                    ) : <div className="text-xs text-muted-foreground">—</div>}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SpotlightCard>

      {/* Add/Edit Wallet Dialog */}
      <Dialog open={walletDialog.open} onOpenChange={(o) => setWalletDialog({ open: o, editing: o ? walletDialog.editing : null })}>
        <DialogContent className="border-gold/25 bg-background sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-gold">{walletDialog.editing ? t("pages.withdrawal.dialog.editWallet") : t("pages.withdrawal.dialog.addWallet")}</DialogTitle>
            <DialogDescription>{t("pages.withdrawal.dialog.walletDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{t("pages.withdrawal.newRequest.creditType")}</label>
              <div className="flex h-10 items-center justify-between rounded-md border border-border/60 bg-card/40 px-3 text-sm">
                <span className="font-medium">USDT (BEP20)</span><Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{t("pages.withdrawal.dialog.walletName")}</label>
              <Input value={wName} onChange={(e) => setWName(e.target.value)} maxLength={40} placeholder={t("pages.withdrawal.dialog.walletNamePlaceholder")} className="h-10 border-border/60 bg-card/40 focus-visible:ring-gold/40" />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{t("pages.withdrawal.dialog.walletAddress")}</label>
              <Input value={wAddr} onChange={(e) => setWAddr(e.target.value)} placeholder="0x..." className="h-10 border-border/60 bg-card/40 font-mono focus-visible:ring-gold/40" />
              <p className="mt-1 text-[11px] text-muted-foreground">{t("pages.withdrawal.dialog.walletAddressHint")}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWalletDialog({ open: false, editing: null })} className="border-border/60">{t("common.cancel")}</Button>
            <Button onClick={saveWallet} disabled={savingWallet} className="bg-gradient-to-r from-gold to-amber-400 font-semibold text-black hover:opacity-95">
              {savingWallet ? t("pages.withdrawal.dialog.saving") : walletDialog.editing ? t("pages.withdrawal.dialog.update") : t("common.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Withdrawal Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="border-gold/25 bg-background sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-gold">{t("pages.withdrawal.confirm.title")}</DialogTitle>
            <DialogDescription>{t("pages.withdrawal.confirm.desc")}</DialogDescription>
          </DialogHeader>
          <dl className="space-y-2.5 py-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">{t("pages.withdrawal.confirm.wallet")}</dt><dd className="font-medium">{wallets.find((w) => w.id === selWalletId)?.wallet_name}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t("pages.withdrawal.confirm.address")}</dt><dd className="font-mono text-xs">{shortAddr(wallets.find((w) => w.id === selWalletId)?.wallet_address ?? "")}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t("pages.withdrawal.confirm.chain")}</dt><dd>USDT (BEP20)</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t("pages.withdrawal.confirm.amount")}</dt><dd className="font-light tabular-nums tracking-tight">${fmt(amount)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{t("pages.withdrawal.confirm.adminFee")}</dt><dd className="font-light tabular-nums tracking-tight">${fmt(adminFee)}</dd></div>
            <div className="flex justify-between border-t border-border/50 pt-2"><dt className="font-medium text-gold">{t("pages.withdrawal.confirm.receiveAmount")}</dt><dd className="font-light tabular-nums tracking-tight text-gold">${fmt(receive)}</dd></div>
          </dl>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} className="border-border/60">{t("common.cancel")}</Button>
            <Button onClick={submitWithdrawal} disabled={submitting} className="bg-gradient-to-r from-gold to-amber-400 font-semibold text-black hover:opacity-95">
              {submitting ? t("pages.withdrawal.confirm.submitting") : <><Check className="mr-1 h-4 w-4" /> {t("pages.withdrawal.confirm.confirmBtn")}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
