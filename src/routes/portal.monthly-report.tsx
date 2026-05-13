import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Eye, Calendar, Share2, Send, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/portal/monthly-report")({
  component: MonthlyReportPage,
});

type Report = {
  id: string;
  title: string;
  period: string | null;
  file_url: string;
  file_size: number | null;
  created_at: string;
};

function formatBytes(b: number | null) {
  if (!b) return "—";
  const mb = b / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(b / 1024).toFixed(0)} KB`;
}

function MonthlyReportPage() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("monthly_reports")
      .select("id, title, period, file_url, file_size, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setReports((data ?? []) as Report[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pages.monthlyReport.title", "Monthly Report")}
        description={t("pages.monthlyReport.description", "Official monthly overview reports curated by our team.")}
      />

      {/* Hero card — landing-page style gold gradient */}
      <div className="liquid-glass relative overflow-hidden rounded-2xl border border-gold/25 p-8 sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 50% -10%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 65%), radial-gradient(60% 50% at 90% 90%, color-mix(in oklab, var(--gold) 14%, transparent), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in oklab, var(--gold) 60%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--gold) 60%, transparent) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 0%, black 30%, transparent 80%)",
          }}
        />
        <div className="relative flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-[0.32em] text-gold/80">
            {t("pages.monthlyReport.eyebrow", "Insights · Monthly")}
          </span>
          <h2
            className="font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--gold) 95%, white) 0%, var(--gold) 55%, color-mix(in oklab, var(--gold) 65%, black) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {t("pages.monthlyReport.heroTitle", "Monthly Overview Report")}
          </h2>
          <p className="max-w-xl text-sm text-gold/75 sm:text-base">
            {t(
              "pages.monthlyReport.heroSubtitle",
              "A curated, editorial-grade snapshot of performance, allocation and forward outlook — published monthly."
            )}
          </p>
        </div>
      </div>

      {/* Reports list */}
      {loading ? (
        <div className="liquid-glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
          {t("common.loading", "Loading…")}
        </div>
      ) : reports.length === 0 ? (
        <div className="liquid-glass rounded-2xl p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-gold/60" />
          <p className="mt-3 text-sm text-muted-foreground">
            {t("pages.monthlyReport.empty", "No monthly reports have been published yet.")}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((r) => (
            <article
              key={r.id}
              className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-background/40 p-5 backdrop-blur transition-all hover:border-gold/40 hover:shadow-[0_20px_60px_-30px_color-mix(in_oklab,var(--gold)_60%,transparent)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(80% 60% at 0% 0%, color-mix(in oklab, var(--gold) 14%, transparent), transparent 60%)",
                }}
              />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
                  <FileText className="h-5 w-5 text-gold" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className="truncate font-serif text-lg font-semibold"
                    style={{
                      background:
                        "linear-gradient(180deg, color-mix(in oklab, var(--gold) 95%, white) 0%, var(--gold) 60%, color-mix(in oklab, var(--gold) 70%, black) 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {r.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {r.period && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gold/70" />
                        {r.period}
                      </span>
                    )}
                    <span>{formatBytes(r.file_size)}</span>
                    <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="relative mt-5 flex flex-wrap gap-2">
                <Button
                  asChild
                  className="bg-gradient-to-r from-gold to-amber-400 text-background hover:opacity-90"
                >
                  <a href={r.file_url} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    {t("pages.monthlyReport.view", "View")}
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <a href={r.file_url} download>
                    <Download className="mr-2 h-4 w-4" />
                    {t("pages.monthlyReport.download", "Download")}
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
