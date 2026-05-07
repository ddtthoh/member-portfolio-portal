import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { ChevronUp, ChevronDown, Plus, Eye, Calendar as CalendarIcon, Paperclip, X as XIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/portal/support")({
  component: SupportPage,
});

type Ticket = { id: string; subject: string; message: string; status: string; created_at: string };

const schema = z.object({
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(2000),
  category: z.string().trim().min(1).max(60),
});

const CATEGORIES = ["General", "Account", "Deposit", "Withdrawal", "Technical", "Other"];
const STATUSES = ["open", "pending", "resolved", "closed"];

function SupportPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // form
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [viewing, setViewing] = useState<Ticket | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  // filters
  const [filterOpen, setFilterOpen] = useState(false);
  const [fDate, setFDate] = useState("");
  const [fNumber, setFNumber] = useState("");
  const [fCategory, setFCategory] = useState<string>("all");
  const [fStatus, setFStatus] = useState<string>("all");
  const [applied, setApplied] = useState({ date: "", number: "", category: "all", status: "all" });

  const load = () => {
    if (!user) return;
    supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setTickets((data ?? []) as Ticket[]));
  };
  useEffect(load, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ subject, message, category });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("support_tickets")
      .insert({ user_id: user.id, subject: parsed.data.subject, message: `[${parsed.data.category}] ${parsed.data.message}` });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    setSubject(""); setMessage(""); setCategory(""); setFiles([]);
    setOpenNew(false);
    toast.success("Support ticket created");
    load();
  };

  const filtered = useMemo(() => {
    return tickets.filter((tk) => {
      if (applied.date && !tk.created_at.startsWith(applied.date)) return false;
      if (applied.number && !tk.id.toLowerCase().includes(applied.number.toLowerCase())) return false;
      if (applied.status !== "all" && tk.status !== applied.status) return false;
      if (applied.category !== "all" && !tk.message.toLowerCase().includes(`[${applied.category.toLowerCase()}]`)) return false;
      return true;
    });
  }, [tickets, applied]);

  const ticketNumber = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;
  const extractCategory = (msg: string) => {
    const m = msg.match(/^\[([^\]]+)\]/);
    return m ? m[1] : "General";
  };
  const cleanMessage = (msg: string) => msg.replace(/^\[[^\]]+\]\s*/, "");

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      open: "bg-gold/15 text-gold ring-1 ring-gold/30",
      pending: "bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/30",
      resolved: "bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/30",
      closed: "bg-muted text-muted-foreground ring-1 ring-border",
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map[status] ?? map.closed}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        
        title={t("pages.support.title")}
        description={t("pages.support.description")}
      />

      {/* Filter card */}
      <section className="liquid-glass rounded-xl border border-border/60 overflow-hidden">
        <button
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <span className="text-base font-semibold tracking-tight text-gold">Filter</span>
          {filterOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        {filterOpen && (
          <div className="border-t border-border/60 px-6 py-6">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="f-date" className="text-sm font-medium">Date</Label>
                <div className="relative">
                  <Input
                    id="f-date"
                    type="date"
                    value={fDate}
                    onChange={(e) => setFDate(e.target.value)}
                    className="h-11"
                  />
                  <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="f-num" className="text-sm font-medium">Ticket Number</Label>
                <Input
                  id="f-num"
                  value={fNumber}
                  onChange={(e) => setFNumber(e.target.value)}
                  placeholder=""
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <Select value={fCategory} onValueChange={setFCategory}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="--" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">--</SelectItem>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Select value={fStatus} onValueChange={setFStatus}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="--" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">--</SelectItem>
                    {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                onClick={() => setApplied({ date: fDate, number: fNumber, category: fCategory, status: fStatus })}
                className="h-10 rounded-md bg-gradient-to-b from-gold to-gold/80 px-6 font-semibold uppercase tracking-wider text-gold-foreground shadow-sm hover:from-gold hover:to-gold"
              >
                Filter
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFDate(""); setFNumber(""); setFCategory("all"); setFStatus("all");
                  setApplied({ date: "", number: "", category: "all", status: "all" });
                }}
                className="h-10 rounded-md bg-foreground px-6 font-semibold uppercase tracking-wider text-background hover:bg-foreground/90"
              >
                Reset
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Tickets list */}
      <section className="liquid-glass rounded-xl border border-border/60 overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <h2 className="text-base font-semibold tracking-tight text-gold">Support Tickets List</h2>

          <Dialog open={openNew} onOpenChange={(o) => { setOpenNew(o); if (!o) setFiles([]); }}>
            <DialogTrigger asChild>
              <Button className="h-10 rounded-md bg-gradient-to-b from-gold to-gold/80 px-4 font-semibold uppercase tracking-wider text-gold-foreground shadow-sm hover:from-gold hover:to-gold">
                <Plus className="mr-1 h-4 w-4" /> New Support Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
              <DialogHeader className="px-8 pt-7 pb-5 border-b border-border/60">
                <DialogTitle className="text-xl font-semibold tracking-tight">New Support Ticket</DialogTitle>
              </DialogHeader>

              <form onSubmit={submit} className="px-8 py-7">
                <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="--" /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="subject" className="text-sm font-semibold">
                      Subject <span className="text-destructive">*</span>
                    </Label>
                    <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} required className="h-11" />
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="message" className="text-sm font-semibold">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea id="message" rows={7} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} required className="resize-y" />
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold">Attachments</Label>
                    <div className="flex items-stretch overflow-hidden rounded-md border border-input">
                      <label
                        htmlFor="attach-input"
                        className="flex cursor-pointer items-center gap-2 border-r border-input bg-muted/40 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/70"
                      >
                        <Paperclip className="h-4 w-4" />
                        Choose File
                      </label>
                      <input
                        id="attach-input"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const list = Array.from(e.target.files ?? []).filter((f) => f.size <= 2 * 1024 * 1024);
                          if (list.length !== (e.target.files?.length ?? 0)) toast.error("Some files exceeded 2MB and were skipped.");
                          setFiles((prev) => [...prev, ...list]);
                          e.target.value = "";
                        }}
                      />
                      <div className="flex-1 truncate px-4 py-2.5 text-sm text-muted-foreground">
                        {files.length === 0 ? "No File Chosen" : `${files.length} file${files.length > 1 ? "s" : ""} selected`}
                      </div>
                    </div>
                    {files.length > 0 && (
                      <ul className="space-y-1.5 pt-1">
                        {files.map((f, i) => (
                          <li key={i} className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-1.5 text-xs">
                            <span className="truncate">{f.name}</span>
                            <button
                              type="button"
                              onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                              className="ml-2 text-muted-foreground hover:text-destructive"
                              aria-label="Remove file"
                            >
                              <XIcon className="h-3.5 w-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      2mb File Limit, Jpg/png/gif Types, More Than 1 File Can Be Uploaded
                    </p>
                  </div>
                </div>

                <DialogFooter className="mt-8 gap-3 sm:gap-3">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-10 rounded-md bg-gradient-to-b from-gold to-gold/80 px-7 font-semibold uppercase tracking-wider text-gold-foreground shadow-sm hover:from-gold hover:to-gold"
                  >
                    {submitting ? "Submitting…" : "Proceed"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setOpenNew(false); setFiles([]); }}
                    className="h-10 rounded-md bg-foreground px-7 font-semibold uppercase tracking-wider text-background hover:bg-foreground/90"
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border-t border-border/60 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-muted/30 text-[11px] uppercase tracking-[0.18em] text-gold">
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Ticket Number</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">Subject</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-muted-foreground">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                filtered.map((tk) => (
                  <tr key={tk.id} className="border-t border-border/40 transition-colors hover:bg-muted/20">
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(tk.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" })}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-foreground/90">{ticketNumber(tk.id)}</td>
                    <td className="px-6 py-4">{extractCategory(tk.message)}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{tk.subject}</td>
                    <td className="px-6 py-4">{statusBadge(tk.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewing(tk)}
                        className="h-8 gap-1 text-gold hover:bg-gold/10 hover:text-gold"
                      >
                        <Eye className="h-4 w-4" /> View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewing?.subject}</DialogTitle>
            <DialogDescription>
              {viewing && `${ticketNumber(viewing.id)} · ${new Date(viewing.created_at).toLocaleString()}`}
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{extractCategory(viewing.message)}</span>
                <span className="ml-auto">{statusBadge(viewing.status)}</span>
              </div>
              <p className="whitespace-pre-wrap rounded-md border border-border/60 bg-muted/20 p-4 text-sm">
                {cleanMessage(viewing.message)}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
