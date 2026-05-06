import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/portal/support")({
  component: SupportPage,
});

type Ticket = { id: string; subject: string; message: string; status: string; created_at: string };

const schema = z.object({
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(2000),
});

function SupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!user) return;
    supabase.from("support_tickets").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setTickets((data ?? []) as Ticket[]));
  };
  useEffect(load, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ subject, message });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("support_tickets").insert({ user_id: user.id, ...parsed.data });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    setSubject(""); setMessage("");
    toast.success("Support ticket created");
    load();
  };

  return (
    <div>
      <PageHeader eyebrow="Concierge" title="Support"
        description="Open a private ticket — our concierge team responds promptly." />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <form onSubmit={submit} className="space-y-4 liquid-glass rounded-xl p-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} required />
          </div>
          <Button type="submit" disabled={submitting} className="rounded-sm bg-gold text-gold-foreground hover:bg-gold/90">
            {submitting ? "Submitting…" : "Open Ticket"}
          </Button>
        </form>

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your Tickets</div>
          {tickets.length === 0 && (
            <p className="liquid-glass rounded-xl p-6 text-center text-sm text-muted-foreground">
              No tickets yet.
            </p>
          )}
          {tickets.map((t) => (
            <div key={t.id} className="liquid-glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{t.subject}</div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold">{t.status}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.message}</p>
              <div className="mt-2 text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
