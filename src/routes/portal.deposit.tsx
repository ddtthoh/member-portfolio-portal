import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Check, ArrowLeftRight, ChevronRight, QrCode, Pencil, Search, RotateCcw, Calendar as CalendarIcon, History, Inbox, ExternalLink, Filter as FilterIcon, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/deposit")({
  component: DepositPage,
});

type Settings = {
  network: string;
  network_label: string;
  wallet_address: string;
  qr_url: string | null;
};

type DepositRow = {
  id: string;
  received_at: string;
  reference_number: string;
  transaction_hash: string;
  amount: number | null;
  asset: string | null;
  network: string | null;
  status: string;
};

function DepositPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [copied, setCopied] = useState(false);

  // History + filters
  const [deposits, setDeposits] = useState<DepositRow[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [filterOpen, setFilterOpen] = useState(true);
  const [fDate, setFDate] = useState("");
  const [fRef, setFRef] = useState("");
  const [fHash, setFHash] = useState("");
  const [applied, setApplied] = useState({ date: "", ref: "", hash: "" });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("deposit_settings")
      .select("network, network_label, wallet_address, qr_url")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setSettings(data ?? { network: "BSC", network_label: "BNB Smart Chain (BEP20)", wallet_address: "", qr_url: null }));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoadingHistory(true);
    supabase
      .from("deposits")
      .select("id, received_at, reference_number, transaction_hash, amount, asset, network, status")
      .eq("user_id", user.id)
      .order("received_at", { ascending: false })
      .then(({ data }) => {
        setDeposits((data ?? []) as DepositRow[]);
        setLoadingHistory(false);
      });
  }, [user]);

  const filtered = useMemo(() => {
    return deposits.filter((d) => {
      if (applied.date && !d.received_at.startsWith(applied.date)) return false;
      if (applied.ref && !d.reference_number.toLowerCase().includes(applied.ref.toLowerCase())) return false;
      if (applied.hash && !d.transaction_hash.toLowerCase().includes(applied.hash.toLowerCase())) return false;
      return true;
    });
  }, [deposits, applied]);

  const apply = () => setApplied({ date: fDate.trim(), ref: fRef.trim(), hash: fHash.trim() });
  const reset = () => { setFDate(""); setFRef(""); setFHash(""); setApplied({ date: "", ref: "", hash: "" }); };

  const fmtAmount = (n: number | null) =>
    n == null ? "—" : new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(Number(n));

  const shortHash = (h: string) => (h.length > 22 ? `${h.slice(0, 12)}…${h.slice(-8)}` : h);

  const addr = settings?.wallet_address ?? "";
  const head = addr.slice(0, 6);
  const tail = addr.slice(-6);
  const middle = addr.length > 12 ? addr.slice(6, -6) : "";

  const copy = async () => {
    if (!addr) return;
    await navigator.clipboard.writeText(addr);
    setCopied(true);
    toast.success("Address copied");
    setTimeout(() => setCopied(false), 1600);
  };

  const copyValue = async (val: string, label = "Copied") => {
    await navigator.clipboard.writeText(val);
    toast.success(label);
  };

  return (
    <div>
      <PageHeader
        eyebrow={t("pages.deposit.eyebrow")}
        title={t("pages.deposit.title")}
      />

      <SpotlightCard className="liquid-glass mx-auto max-w-md rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center">
          <div className="rounded-2xl bg-white p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] ring-1 ring-gold/30">
            {settings?.qr_url ? (
              <img src={settings.qr_url} alt="Deposit QR code" className="h-56 w-56 rounded-lg object-contain" />
            ) : (
              <div className="flex h-56 w-56 flex-col items-center justify-center gap-2 rounded-lg bg-muted/40 text-muted-foreground">
                <QrCode className="h-10 w-10" />
                <span className="text-[11px] uppercase tracking-[0.2em]">No QR uploaded</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Network</div>
            <div className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">{settings?.network ?? "—"}</div>
            <div className="text-xs text-muted-foreground">{settings?.network_label ?? ""}</div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div>
            <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Deposit Address <ChevronRight className="h-3 w-3" />
            </div>
            <div className="mt-2 flex items-start gap-3">
              <div className="min-w-0 flex-1 break-all font-mono text-[15px] leading-relaxed text-foreground/80">
                {addr ? (
                  <>
                    <span className="font-semibold text-gold">{head}</span>
                    <span>{middle}</span>
                    <span className="font-semibold text-gold">{tail}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">No address set. Use Edit to configure.</span>
                )}
              </div>
              <button
                type="button"
                onClick={copy}
                disabled={!addr}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-muted-foreground transition hover:border-gold/50 hover:text-gold disabled:opacity-40"
                aria-label="Copy address"
              >
                {copied ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Deposit History — premium filter + ledger */}
      <div className="mx-auto mt-10 max-w-5xl space-y-5">
        {/* Filter card */}
        <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className="group flex w-full items-center justify-between px-6 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
                <FilterIcon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-tight text-foreground">Filter Transactions</div>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${filterOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence initial={false}>
            {filterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="border-t border-border/50 bg-gradient-to-b from-gold/[0.02] to-transparent px-6 py-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" /> Date
                      </label>
                      <Input
                        type="date"
                        value={fDate}
                        onChange={(e) => setFDate(e.target.value)}
                        className="h-10 border-border/60 bg-card/40 text-sm focus-visible:ring-gold/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                        Reference Number
                      </label>
                      <Input
                        placeholder="TXN…"
                        value={fRef}
                        onChange={(e) => setFRef(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && apply()}
                        className="h-10 border-border/60 bg-card/40 font-mono text-sm focus-visible:ring-gold/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                        Transaction Hash
                      </label>
                      <Input
                        placeholder="0x…"
                        value={fHash}
                        onChange={(e) => setFHash(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && apply()}
                        className="h-10 border-border/60 bg-card/40 font-mono text-sm focus-visible:ring-gold/40"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-muted-foreground">
                      Showing <span className="font-semibold text-gold">{filtered.length}</span> of {deposits.length} records
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={reset}
                        className="h-9 gap-2 border-border/60 bg-transparent text-muted-foreground hover:border-gold/40 hover:text-gold"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Reset
                      </Button>
                      <Button
                        onClick={apply}
                        className="h-9 gap-2 bg-gradient-to-r from-gold to-amber-400 font-semibold text-black shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] hover:opacity-95"
                      >
                        <Search className="h-3.5 w-3.5" /> Apply Filter
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SpotlightCard>

        {/* History card */}
        <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
                <History className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-gold/70">Ledger</div>
                <div className="text-sm font-semibold tracking-tight text-foreground">Deposit History</div>
              </div>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full border border-border/50 bg-card/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Live
            </div>
          </div>

          {loadingHistory ? (
            <div className="space-y-2 px-6 py-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-muted/20" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground">
                <Inbox className="h-6 w-6" />
              </div>
              <div className="text-sm font-medium text-foreground">No deposits found</div>
              <div className="max-w-xs text-xs text-muted-foreground">
                {deposits.length === 0
                  ? "Your confirmed deposits will appear here once received."
                  : "Try adjusting your filters or reset to see all records."}
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40 text-[10px] font-medium uppercase tracking-[0.22em] text-gold/70">
                      <th className="px-6 py-3 text-left">Received At</th>
                      <th className="px-6 py-3 text-left">Reference</th>
                      <th className="px-6 py-3 text-left">Tx Hash</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                      <th className="px-6 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d, i) => (
                      <motion.tr
                        key={d.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.25 }}
                        className="group border-b border-border/30 last:border-0 transition-colors hover:bg-gold/[0.03]"
                      >
                        <td className="px-6 py-4 text-sm tabular-nums text-foreground/80">
                          {new Date(d.received_at).toLocaleString(undefined, {
                            year: "numeric", month: "2-digit", day: "2-digit",
                            hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => copyValue(d.reference_number, "Reference copied")}
                            className="font-mono text-sm text-foreground/80 transition hover:text-gold"
                          >
                            {d.reference_number}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => copyValue(d.transaction_hash, "Hash copied")}
                            className="inline-flex items-center gap-1.5 font-mono text-sm text-foreground/70 transition hover:text-gold"
                            title={d.transaction_hash}
                          >
                            {shortHash(d.transaction_hash)}
                            <Copy className="h-3 w-3 opacity-0 transition group-hover:opacity-60" />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-sm font-semibold tabular-nums text-gold">
                          {fmtAmount(d.amount)} <span className="text-[10px] font-normal text-muted-foreground">{d.asset ?? "USDT"}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {d.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-2 px-4 py-4 md:hidden">
                {filtered.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-xl border border-border/50 bg-card/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {new Date(d.received_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[9px] uppercase text-emerald-300">
                        <span className="h-1 w-1 rounded-full bg-emerald-400" /> {d.status}
                      </span>
                    </div>
                    <div className="mt-2 font-mono text-base font-semibold text-gold">
                      {fmtAmount(d.amount)} <span className="text-[10px] text-muted-foreground">{d.asset ?? "USDT"}</span>
                    </div>
                    <div className="mt-3 space-y-1.5 border-t border-border/30 pt-3 text-xs">
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">Ref</span>
                        <span className="truncate font-mono text-foreground/80">{d.reference_number}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">Hash</span>
                        <button onClick={() => copyValue(d.transaction_hash, "Hash copied")} className="truncate font-mono text-foreground/70">
                          {shortHash(d.transaction_hash)}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </SpotlightCard>
      </div>
    </div>
  );
}
