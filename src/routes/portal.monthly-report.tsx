import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Eye, Calendar, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
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

const MONTHS: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

/** Returns dd/mm/yyyy of the last day of the period's month. */
function lastDayOfPeriod(period: string | null, fallback: string, title: string): string {
  let year: number | null = null;
  let month: number | null = null;

  // Try to find month/year in title if period is null
  const source = period || title;

  if (source) {
    // Look for month names and 4-digit years
    const words = source.toLowerCase().split(/\s+/);
    let foundMonth: number | null = null;
    let foundYear: number | null = null;

    for (const word of words) {
      const cleanWord = word.replace(/[^a-z]/g, "");
      if (MONTHS[cleanWord] !== undefined) {
        foundMonth = MONTHS[cleanWord];
      }
      const yearMatch = word.match(/\d{4}/);
      if (yearMatch) {
        foundYear = Number(yearMatch[0]);
      }
    }

    if (foundMonth !== null && foundYear !== null) {
      month = foundMonth;
      year = foundYear;
    } else {
      // Try "2026-04" format
      const numMatch = source.match(/(\d{4})[-/](\d{1,2})/);
      if (numMatch) {
        year = Number(numMatch[1]);
        month = Number(numMatch[2]) - 1;
      }
    }
  }

  if (year === null || month === null) {
    const d = new Date(fallback);
    year = d.getFullYear();
    month = d.getMonth();
  }

  const last = new Date(year, month + 1, 0);
  const dd = String(last.getDate()).padStart(2, "0");
  const mm = String(last.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${last.getFullYear()}`;
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
        <div className="grid gap-5 sm:grid-cols-2">
          {reports.map((r) => {
            const dateStr = lastDayOfPeriod(r.period, r.created_at, r.title);
            const shareText = `${r.title} ${r.file_url}`;
            return (
              <div key={r.id} className="relative">
                {/* Conic-gradient halo */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-90 blur-[2px]"
                  style={{
                    background:
                      "conic-gradient(from 140deg at 50% 50%, color-mix(in oklab, var(--gold) 55%, transparent), transparent 30%, color-mix(in oklab, var(--gold) 35%, transparent) 55%, transparent 80%, color-mix(in oklab, var(--gold) 55%, transparent))",
                  }}
                />
                <article
                  className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-card/95 via-card/80 to-background/95 px-5 py-5 sm:px-6 sm:py-6"
                  style={{
                    boxShadow:
                      "0 10px 40px -12px color-mix(in oklab, var(--gold) 35%, transparent)",
                    isolation: "isolate",
                    contain: "paint",
                  }}
                >
                  {/* corner glows */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/20 blur-3xl"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -left-20 -bottom-20 h-44 w-44 rounded-full bg-gold/10 blur-3xl"
                  />

                  {/* Centered title + date */}
                  <div className="relative flex flex-col items-center text-center">
                    {/* Diamond ornament */}
                    <div className="flex items-center gap-2 text-gold/60">
                      <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/50" />
                      <span className="rotate-45 text-[10px]">◆</span>
                      <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/50" />
                    </div>

                    <h3
                      className="mt-3 font-serif text-2xl font-semibold leading-tight sm:text-3xl"
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

                    {/* Thin gold rule with center dot */}
                    <div className="mt-3 flex w-full items-center justify-center gap-2">
                      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
                      <span className="h-1 w-1 rounded-full bg-gold/70" />
                      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      {r.period && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gold/70" />
                          {r.period}
                        </span>
                      )}
                      <span className="tabular-nums text-gold/70">{dateStr}</span>
                    </div>

                    {/* Segmented pill — View | Download | Share */}
                    <div className="mt-6 flex w-full items-stretch overflow-hidden rounded-full border border-gold/50 divide-x divide-gold/30 bg-background/30">
                      <a
                        href={r.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-1 items-center justify-center gap-2 px-3 py-3 text-xs font-medium text-gold transition-colors hover:bg-gold/10 sm:text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        <span>{t("pages.monthlyReport.view", "View")}</span>
                      </a>
                      <a
                        href={r.file_url}
                        download
                        className="group flex flex-1 items-center justify-center gap-2 px-3 py-3 text-xs font-medium text-gold transition-colors hover:bg-gold/10 sm:text-sm"
                      >
                        <Download className="h-4 w-4" />
                        <span>{t("pages.monthlyReport.download", "Download")}</span>
                      </a>
                      <button
                        type="button"
                        onClick={async () => {
                          const shareData = { title: r.title, text: r.title, url: r.file_url };
                          if (navigator.share) {
                            try {
                              await navigator.share(shareData);
                              return;
                            } catch {
                              return;
                            }
                          }
                          try {
                            await navigator.clipboard.writeText(r.file_url);
                            alert(
                              t("pages.monthlyReport.linkCopied", "Link copied to clipboard.")
                            );
                          } catch {
                            window.prompt(
                              t("pages.monthlyReport.copyLink", "Copy this link to share:"),
                              r.file_url
                            );
                          }
                        }}
                        className="group flex flex-1 items-center justify-center gap-2 px-3 py-3 text-xs font-medium text-gold transition-colors hover:bg-gold/10 sm:text-sm"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>{t("pages.monthlyReport.share", "Share")}</span>
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RuleEyebrow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
      <span className="inline-flex items-center gap-1 text-[8px] font-medium uppercase tracking-[0.32em] text-gold/75">
        <span className="text-gold/70">{icon}</span>
        {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
    </div>
  );
}
