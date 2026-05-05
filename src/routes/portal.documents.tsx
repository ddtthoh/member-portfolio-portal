import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/portal/documents")({
  component: DocumentsPage,
});

type Doc = { id: string; title: string; category: string; period: string | null; file_url: string | null; created_at: string };

function DocumentsPage() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("documents").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setDocs((data ?? []) as Doc[]));
  }, [user]);

  return (
    <div>
      <PageHeader eyebrow="Library" title="Documents & Statements"
        description="Statements, tax documents, and legal contracts on file." />
      {docs.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid gap-3">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-sm border border-border bg-card p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-gold/40 bg-gold/10 text-gold">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">{d.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {d.category}{d.period ? ` · ${d.period}` : ""} · {new Date(d.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {d.file_url && (
                <a href={d.file_url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 text-xs hover:border-gold hover:text-gold">
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-sm border border-dashed border-border bg-card p-16 text-center">
      <FileText className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">No documents available yet. Your statements will appear here as they are issued.</p>
    </div>
  );
}
