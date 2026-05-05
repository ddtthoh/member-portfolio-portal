import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/reports")({
  component: ReportsPage,
});

type Report = { id: string; title: string; period: string | null; summary: string | null; file_url: string | null; published_at: string };

function ReportsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Report[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("reports").select("*").eq("user_id", user.id).order("published_at", { ascending: false })
      .then(({ data }) => setItems((data ?? []) as Report[]));
  }, [user]);

  return (
    <div>
      <PageHeader eyebrow="Curated" title="Quarterly Reports"
        description="Letters and analysis prepared by your advisory team." />
      {items.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border bg-card p-16 text-center">
          <BookOpen className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Your next quarterly report will appear here when published.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((r) => (
            <article key={r.id} className="rounded-sm border border-border bg-card p-6 transition-all hover:border-gold/50">
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold">{r.period ?? "Report"}</div>
              <h3 className="mt-2 font-serif text-2xl">{r.title}</h3>
              {r.summary && <p className="mt-3 text-sm text-muted-foreground">{r.summary}</p>}
              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(r.published_at).toLocaleDateString()}</span>
                {r.file_url && (
                  <a href={r.file_url} target="_blank" rel="noreferrer" className="text-gold hover:underline">
                    Read full report →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
