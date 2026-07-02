import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Download, FileText, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import promoPdf from "@/assets/naslab-july-promotion-2026.pdf.asset.json";

export const Route = createFileRoute("/portal/promotion/july-2026-pdf")({
  head: () => ({
    meta: [
      { title: "Naslab · July 2026 Promotion Brief" },
      {
        name: "description",
        content:
          "Preview and download the Naslab July 2026 Community Promotion brief — referral, staking, Turkey event seats, and Grand Launch lucky draw.",
      },
    ],
  }),
  component: JulyPromoPdfPage,
});

function JulyPromoPdfPage() {
  const url = promoPdf.url;
  const sizeKb = Math.round(promoPdf.size / 1024);

  return (
    <div>
      <Link
        to="/portal/promotion"
        className="mb-3 inline-flex items-center gap-1 text-xs text-gold/70 hover:text-gold"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to Promotions
      </Link>

      <PageHeader
        eyebrow="July 2026 · Community Promotion"
        title="A Month in Istanbul"
      />

      <SpotlightCard className="liquid-glass mb-4 rounded-2xl p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-gold/20 bg-gold/[0.05] p-3 text-gold">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-gold/70">
                Official brief · PDF
              </div>
              <h3 className="mt-0.5 font-serif text-lg text-gold">
                Naslab_July_Promotion_2026.pdf
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                7 pages · {sizeKb.toLocaleString()} KB
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={url}
              download="Naslab_July_Promotion_2026.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold hover:text-background"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-gold/80 transition-colors hover:border-gold/40 hover:text-gold"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open in new tab
            </a>
          </div>
        </div>
      </SpotlightCard>

      <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl p-2">
        <object
          data={`${url}#view=FitH`}
          type="application/pdf"
          className="h-[80vh] w-full rounded-xl bg-black/40"
          aria-label="Naslab July 2026 Promotion PDF preview"
        >
          <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center text-sm text-muted-foreground">
            <FileText className="h-8 w-8 text-gold/60" />
            <p>
              Your browser can’t display the PDF inline. Use the download or
              open-in-new-tab buttons above.
            </p>
          </div>
        </object>
      </SpotlightCard>
    </div>
  );
}
