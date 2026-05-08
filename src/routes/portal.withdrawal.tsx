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

export const Route = createFileRoute("/portal/withdrawal")({
  component: WithdrawalPage,
});

const ADMIN_FEE_RATE = 0.02;
const ADMIN_FEE_MIN = 1;
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
    if (!wName.trim()) { toast.error("Wallet name is required"); return; }
    if (!ADDR_RE.test(wAddr.trim())) { toast.error("Invalid wallet address (must start with 0x and be 42 chars)"); return; }
    setSavingWallet(true);
    const payload = { user_id: user.id, wallet_name: wName.trim(), wallet_address: wAddr.trim(), chain: "BEP20" };
    const { error } = walletDialog.editing
      ? await supabase.from("withdrawal_wallets").update(payload).eq("id", walletDialog.editing.id)
      : await supabase.from("withdrawal_wallets").insert(payload);
    setSavingWallet(false);
    if (error) { toast.error(error.message); return; }
    toast.success(walletDialog.editing ? "Wallet updated" : "Wallet added");
    setWalletDialog({ open: false, editing: null });
    loadWallets();
  };

  const deleteWallet = async (w: WalletRow) => {
    if (!confirm(`Delete wallet "${w.wallet_name}"?`)) return;
    const { error } = await supabase.from("withdrawal_wallets").delete().eq("id", w.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Wallet deleted");
    loadWallets();
  };

  const submitWithdrawal = async () => {
    if (!user) return;
    const w = wallets.find((x) => x.id === selWalletId);
    if (!w) { toast.error("Select a wallet"); return; }
    if (!amountValid) { toast.error("Invalid amount"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("withdrawals").insert({
      user_id: user.id, wallet_id: w.id, recipient_address: w.wallet_address,
      chain: "BEP20", amount, admin_fee: adminFee, receive_amount: receive, status: "pending",
    });
    setSubmitting(false);
    setConfirmOpen(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Withdrawal request submitted");
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
    if (filtered.length === 0) { toast.error("No records to export"); return; }
    const rows = filtered.map((d) => ({
      Date: new Date(d.created_at).toLocaleString("sv-SE", { hour12: false }).slice(0, 19),
      "Reference Number": d.reference_number,
      "Recipient Address": d.recipient_address,
      "USDT Chain": d.chain,
      "Withdrawal Amount": Number(d.amount),
      "Admin Fee": Number(d.admin_fee),
      "You'll Receive": Number(d.receive_amount),
      Status: d.status,
      Remark: d.remark ?? "",
      "Transaction Hash": d.transaction_hash ?? "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Withdrawals");
    XLSX.writeFile(wb, `withdrawal-history-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Excel exported");
  };

  const copyVal = async (v: string, label = "Copied") => { await navigator.clipboard.writeText(v); toast.success(label); };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      completed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
      pending: "border-amber-400/40 bg-amber-400/10 text-amber-300",
      processing: "border-sky-400/40 bg-sky-400/10 text-sky-300",
      rejected: "border-rose-400/40 bg-rose-400/10 text-rose-300",
    };
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] ${map[s] ?? "border-border/60 bg-card/40 text-muted-foreground"}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />{s}
      </span>
    );
  };

  return (
    <div>
      <PageHeader title="Withdrawal" description="Withdraw USDT to your saved BEP20 wallet addresses." />

      {/* Important reminder */}
      <div className="mb-6">
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/[0.15] via-amber-500/[0.06] to-transparent p-5 shadow-[0_8px_32px_-8px_rgba(245,158,11,0.4)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_60%)]" />
          <div className="relative flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-400/50 bg-amber-500/15 text-amber-300 shadow-[0_0_20px_-4px_rgba(245,158,11,0.6)]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber-300">Important Reminder</div>
              <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-foreground/90">
                <li className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-400" /><span>Withdrawals only support <span className="font-semibold text-gold">USDT</span> via the <span className="font-semibold text-gold">BSC (BEP20)</span> network.</span></li>
                <li className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-400" /><span>Wrong address or network will result in <span className="font-semibold text-amber-300">permanent loss</span>.</span></li>
                <li className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-400" /><span>Requests are processed after admin approval — typically within minutes.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1 — Withdrawal Wallets */}
      <SpotlightCard className="liquid-glass mb-6 overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/40 bg-gradient-to-br from-gold/15 to-gold/5 text-gold shadow-[0_4px_16px_-4px_rgba(212,175,55,0.4)]">
              <WalletIcon className="h-4 w-4" />
            </div>
            <div>
              <div className="font-serif text-base font-semibold text-gold md:text-lg">Withdrawal Wallets</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Saved BEP20 addresses</div>
            </div>
          </div>
          <Button onClick={openAddWallet} className="h-9 gap-2 bg-gradient-to-r from-gold to-amber-400 font-semibold text-black shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] hover:opacity-95">
            <Plus className="h-4 w-4" /> Add Wallet
          </Button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-max px-6 py-5 sm:px-8">
            <div className="grid grid-cols-[18ch_18ch_minmax(40ch,1fr)_10ch] gap-x-8 pb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              <div>Date</div><div>Wallet Name</div><div>Wallet Address</div><div className="text-right">Action</div>
            </div>
            <div className="h-px bg-gradient-to-r from-gold/80 via-amber-400/60 to-orange-500/40" />
            {wallets.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground"><WalletIcon className="h-6 w-6" /></div>
                <div className="text-sm font-medium text-foreground">No wallets yet</div>
                <div className="max-w-xs text-xs text-muted-foreground">Add a BEP20 wallet to start withdrawing.</div>
              </div>
            ) : (
              <div className="divide-y divide-border/20">
                {wallets.map((w, i) => (
                  <motion.div key={w.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.25 }}
                    className="grid grid-cols-[18ch_18ch_minmax(40ch,1fr)_10ch] items-center gap-x-8 py-4 transition-colors hover:bg-gold/[0.025]">
                    <div className="font-mono text-sm tabular-nums text-foreground/85">{new Date(w.created_at).toLocaleString("sv-SE", { hour12: false }).slice(0, 19)}</div>
                    <div className="text-sm text-foreground">{w.wallet_name}</div>
                    <button onClick={() => copyVal(w.wallet_address, "Address copied")} className="group inline-flex items-center gap-2 truncate text-left font-mono text-sm text-foreground/85 transition hover:text-gold" title={w.wallet_address}>
                      <span className="truncate"><span className="text-gold">{w.wallet_address.slice(0, 6)}</span>{w.wallet_address.slice(6, -6)}<span className="text-gold">{w.wallet_address.slice(-6)}</span></span>
                      <Copy className="h-3 w-3 shrink-0 opacity-0 transition group-hover:opacity-60" />
                    </button>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEditWallet(w)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition hover:border-gold/50 hover:text-gold" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => deleteWallet(w)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition hover:border-rose-400/50 hover:text-rose-300" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SpotlightCard>

      {/* SECTION 2 — New Withdrawal Request */}
      <SpotlightCard className="liquid-glass mb-6 overflow-hidden rounded-2xl">
        <div className="flex items-center gap-3 border-b border-border/40 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/40 bg-gradient-to-br from-gold/15 to-gold/5 text-gold shadow-[0_4px_16px_-4px_rgba(212,175,55,0.4)]">
            <ArrowUpFromLine className="h-4 w-4" />
          </div>
          <div>
            <div className="font-serif text-base font-semibold text-gold md:text-lg">New Withdrawal Request</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">USDT · BEP20</div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-[1fr_320px] sm:p-8">
          <div className="space-y-5">
            {/* Credit Type */}
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Credit Type *</label>
              <div className="flex h-10 items-center justify-between rounded-md border border-border/60 bg-card/40 px-3 text-sm text-foreground/90">
                <span className="font-medium">USDT (BEP20)</span>
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>

            {/* Wallet Address */}
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Withdrawal Wallet Address *</label>
              {wallets.length === 0 ? (
                <div className="rounded-md border border-dashed border-border/60 bg-card/30 px-3 py-3 text-sm text-muted-foreground">
                  No wallets saved.{" "}
                  <button onClick={openAddWallet} className="font-medium text-gold hover:underline">Add one first →</button>
                </div>
              ) : (
                <Select value={selWalletId} onValueChange={setSelWalletId}>
                  <SelectTrigger className="h-10 border-border/60 bg-card/40 text-sm focus-visible:ring-gold/40"><SelectValue placeholder="-- Select a saved wallet --" /></SelectTrigger>
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
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Amount *</label>
              <Input type="number" inputMode="decimal" min={MIN_AMOUNT} step="0.01" placeholder={`Min ${MIN_AMOUNT} USDT`}
                value={amountStr} onChange={(e) => setAmountStr(e.target.value)}
                className="h-11 border-border/60 bg-card/40 font-mono text-base focus-visible:ring-gold/40" />
              <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                <span>Available: <span className="font-mono tabular-nums text-foreground/80">${fmt(wallet.usd)}</span></span>
                {exceedsBalance && <span className="text-rose-300">Exceeds available balance</span>}
              </div>
            </div>

            <Button disabled={!selWalletId || !amountValid || submitting} onClick={() => setConfirmOpen(true)}
              className="h-11 w-full gap-2 bg-gradient-to-r from-gold to-amber-400 font-semibold text-black shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] hover:opacity-95 disabled:opacity-40">
              <ArrowUpFromLine className="h-4 w-4" /> Request Withdrawal
            </Button>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-gold/[0.04] to-transparent p-5">
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">USD Credit</div>
            <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-gold">${fmt(wallet.usd)}</div>
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Withdrawal Amount</dt><dd className="font-mono tabular-nums text-foreground/90">${fmt(amount)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Admin Fee (2%)</dt><dd className="font-mono tabular-nums text-foreground/90">${fmt(adminFee)}</dd></div>
              <div className="flex justify-between border-t border-border/50 pt-3"><dt className="font-medium text-gold">You'll Receive</dt><dd className="font-mono text-base font-semibold tabular-nums text-gold">${fmt(receive)}</dd></div>
            </dl>
          </div>
        </div>
      </SpotlightCard>

      {/* SECTION 3 — Filter */}
      <SpotlightCard className="liquid-glass mb-5 overflow-hidden rounded-2xl">
        <button type="button" onClick={() => setFilterOpen((v) => !v)} className="group flex w-full items-center justify-between px-6 py-4 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold"><FilterIcon className="h-4 w-4" /></div>
            <div className="text-sm font-semibold tracking-tight text-gold">Filter Transactions</div>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${filterOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence initial={false}>
          {filterOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="overflow-hidden">
              <div className="border-t border-border/50 bg-gradient-to-b from-gold/[0.02] to-transparent px-6 py-5">
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                  <div className="space-y-1.5"><label className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground"><CalendarIcon className="h-3 w-3" /> Date</label>
                    <Input type="date" value={fDate} onChange={(e) => setFDate(e.target.value)} className="h-10 border-border/60 bg-card/40 text-sm focus-visible:ring-gold/40" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Reference Number</label>
                    <Input placeholder="WDR…" value={fRef} onChange={(e) => setFRef(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} className="h-10 border-border/60 bg-card/40 font-mono text-sm focus-visible:ring-gold/40" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Recipient Address</label>
                    <Input placeholder="0x…" value={fAddr} onChange={(e) => setFAddr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} className="h-10 border-border/60 bg-card/40 font-mono text-sm focus-visible:ring-gold/40" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Transaction Hash</label>
                    <Input placeholder="0x…" value={fHash} onChange={(e) => setFHash(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} className="h-10 border-border/60 bg-card/40 font-mono text-sm focus-visible:ring-gold/40" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Status</label>
                    <Select value={fStatus} onValueChange={setFStatus}>
                      <SelectTrigger className="h-10 border-border/60 bg-card/40 text-sm focus-visible:ring-gold/40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem><SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem><SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-muted-foreground">Showing <span className="font-semibold text-gold">{filtered.length}</span> of {withdrawals.length} records</div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={reset} className="h-9 gap-2 border-border/60 bg-transparent text-muted-foreground hover:border-gold/40 hover:text-gold"><RotateCcw className="h-3.5 w-3.5" /> Reset</Button>
                    <Button onClick={apply} className="h-9 gap-2 bg-gradient-to-r from-gold to-amber-400 font-semibold text-black shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] hover:opacity-95"><Search className="h-3.5 w-3.5" /> Apply Filter</Button>
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
              <div className="font-serif text-base font-semibold text-gold md:text-lg">Withdrawal History</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">All requests</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-300 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Live
            </div>
            <Button variant="outline" onClick={exportExcel} className="h-9 gap-2 border-border/60 bg-transparent text-muted-foreground hover:border-gold/40 hover:text-gold">
              <Download className="h-3.5 w-3.5" /> Export Excel
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-max px-6 py-6 sm:px-8">
            <div className="grid grid-cols-[18ch_20ch_28ch_10ch_14ch_12ch_14ch_14ch_18ch_28ch] gap-x-8 pb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              <div>Date</div><div>Reference Number</div><div>Recipient Address</div><div>USDT Chain</div>
              <div className="text-right">Withdrawal Amt</div><div className="text-right">Admin Fee</div><div className="text-right">You'll Receive</div>
              <div>Status</div><div>Remark</div><div>Transaction Hash</div>
            </div>
            <div className="h-px bg-gradient-to-r from-gold/80 via-amber-400/60 to-orange-500/40" />
            {loadingHist ? (
              <div className="space-y-2 py-6">{[0, 1, 2].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-muted/20" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground"><Inbox className="h-6 w-6" /></div>
                <div className="text-sm font-medium text-foreground">No withdrawals found</div>
                <div className="max-w-xs text-xs text-muted-foreground">{withdrawals.length === 0 ? "Your requests will appear here." : "Try adjusting your filters."}</div>
              </div>
            ) : (
              <div className="divide-y divide-border/20">
                {filtered.map((d, i) => (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.25 }}
                    className="group grid grid-cols-[18ch_20ch_28ch_10ch_14ch_12ch_14ch_14ch_18ch_28ch] items-center gap-x-8 py-4 transition-colors hover:bg-gold/[0.025]">
                    <div className="font-mono text-sm tabular-nums text-foreground/85">{new Date(d.created_at).toLocaleString("sv-SE", { hour12: false }).slice(0, 19)}</div>
                    <button onClick={() => copyVal(d.reference_number, "Reference copied")} className="inline-flex items-center gap-2 truncate text-left font-mono text-sm text-foreground/85 transition hover:text-gold" title={d.reference_number}><span className="truncate">{d.reference_number}</span><Copy className="h-3 w-3 shrink-0 opacity-0 transition group-hover:opacity-60" /></button>
                    <button onClick={() => copyVal(d.recipient_address, "Address copied")} className="inline-flex items-center gap-2 truncate text-left font-mono text-sm text-foreground/85 transition hover:text-gold" title={d.recipient_address}><span className="truncate">{shortAddr(d.recipient_address)}</span></button>
                    <div className="text-sm text-foreground/85">{d.chain}</div>
                    <div className="text-right font-mono text-sm tabular-nums text-foreground/90">${fmt(Number(d.amount))}</div>
                    <div className="text-right font-mono text-sm tabular-nums text-muted-foreground">${fmt(Number(d.admin_fee))}</div>
                    <div className="text-right font-mono text-sm tabular-nums font-semibold text-gold">${fmt(Number(d.receive_amount))}</div>
                    <div>{statusBadge(d.status)}</div>
                    <div className="truncate text-sm text-muted-foreground" title={d.remark ?? ""}>{d.remark || "—"}</div>
                    {d.transaction_hash ? (
                      <button onClick={() => copyVal(d.transaction_hash!, "Hash copied")} className="inline-flex items-center gap-2 truncate text-left font-mono text-xs text-foreground/85 transition hover:text-gold" title={d.transaction_hash}><span className="truncate">{shortAddr(d.transaction_hash)}</span><Copy className="h-3 w-3 shrink-0 opacity-0 transition group-hover:opacity-60" /></button>
                    ) : <div className="text-xs text-muted-foreground">—</div>}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SpotlightCard>

      {/* Add/Edit Wallet Dialog */}
      <Dialog open={walletDialog.open} onOpenChange={(o) => setWalletDialog({ open: o, editing: o ? walletDialog.editing : null })}>
        <DialogContent className="border-gold/25 bg-background sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-gold">{walletDialog.editing ? "Edit Wallet" : "Add New Wallet"}</DialogTitle>
            <DialogDescription>USDT BEP20 withdrawal address.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Credit Type *</label>
              <div className="flex h-10 items-center justify-between rounded-md border border-border/60 bg-card/40 px-3 text-sm">
                <span className="font-medium">USDT (BEP20)</span><Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Wallet Name *</label>
              <Input value={wName} onChange={(e) => setWName(e.target.value)} maxLength={40} placeholder="e.g. Personal" className="h-10 border-border/60 bg-card/40 focus-visible:ring-gold/40" />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Wallet Address *</label>
              <Input value={wAddr} onChange={(e) => setWAddr(e.target.value)} placeholder="0x..." className="h-10 border-border/60 bg-card/40 font-mono focus-visible:ring-gold/40" />
              <p className="mt-1 text-[11px] text-muted-foreground">Must be a valid BEP20 address starting with 0x.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWalletDialog({ open: false, editing: null })} className="border-border/60">Cancel</Button>
            <Button onClick={saveWallet} disabled={savingWallet} className="bg-gradient-to-r from-gold to-amber-400 font-semibold text-black hover:opacity-95">
              {savingWallet ? "Saving…" : walletDialog.editing ? "Update" : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Withdrawal Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="border-gold/25 bg-background sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-gold">Confirm Withdrawal</DialogTitle>
            <DialogDescription>Please review the details before submitting.</DialogDescription>
          </DialogHeader>
          <dl className="space-y-2.5 py-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Wallet</dt><dd className="font-medium">{wallets.find((w) => w.id === selWalletId)?.wallet_name}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Address</dt><dd className="font-mono text-xs">{shortAddr(wallets.find((w) => w.id === selWalletId)?.wallet_address ?? "")}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Chain</dt><dd>USDT (BEP20)</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Amount</dt><dd className="font-mono tabular-nums">${fmt(amount)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Admin Fee</dt><dd className="font-mono tabular-nums">${fmt(adminFee)}</dd></div>
            <div className="flex justify-between border-t border-border/50 pt-2"><dt className="font-medium text-gold">You'll Receive</dt><dd className="font-mono font-semibold tabular-nums text-gold">${fmt(receive)}</dd></div>
          </dl>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} className="border-border/60">Cancel</Button>
            <Button onClick={submitWithdrawal} disabled={submitting} className="bg-gradient-to-r from-gold to-amber-400 font-semibold text-black hover:opacity-95">
              {submitting ? "Submitting…" : <><Check className="mr-1 h-4 w-4" /> Confirm</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
