import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/portal/qna")({
  component: QnAPage,
});

type Qna = { id: string; question: string; answer: string | null; status: string; asked_at: string; answered_at: string | null };

const schema = z.object({ question: z.string().trim().min(5, "Please write at least 5 characters").max(1000) });

function QnAPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Qna[]>([]);
  const [q, setQ] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!user) return;
    supabase.from("qna").select("*").eq("user_id", user.id).order("asked_at", { ascending: false })
      .then(({ data }) => setItems((data ?? []) as Qna[]));
  };
  useEffect(load, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ question: q });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("qna").insert({ user_id: user.id, question: parsed.data.question });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    setQ("");
    toast.success("Question sent to your advisor");
    load();
  };

  return (
    <div>
      <PageHeader eyebrow="Conversation" title="Q&A"
        description="Submit a question — your advisor responds within one business day." />

      <form onSubmit={submit} className="liquid-glass rounded-xl p-6">
        <Textarea value={q} onChange={(e) => setQ(e.target.value)} maxLength={1000} rows={4}
          placeholder="What would you like to ask your advisor?" />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{q.length}/1000</span>
          <Button type="submit" disabled={submitting} className="rounded-sm bg-gold text-gold-foreground hover:bg-gold/90">
            {submitting ? "Sending…" : "Submit Question"}
          </Button>
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {items.map((i) => (
          <div key={i.id} className="liquid-glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold">{i.status}</span>
              <span className="text-xs text-muted-foreground">{new Date(i.asked_at).toLocaleDateString()}</span>
            </div>
            <p className="mt-3 font-serif text-lg">{i.question}</p>
            {i.answer && (
              <div className="mt-4 border-l-2 border-gold/60 pl-4">
                <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Advisor</div>
                <p className="text-sm">{i.answer}</p>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">No questions yet.</p>
        )}
      </div>
    </div>
  );
}
