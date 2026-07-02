import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  Download,
  FileText,
  ExternalLink,
  CalendarDays,
  MapPin,
  Users,
  Sparkles,
  Trophy,
  Plane,
  Gift,
} from "lucide-react";
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

const highlights = [
  { icon: CalendarDays, label: "Promotion Period", value: "1 – 31 July 2026" },
  { icon: MapPin, label: "Grand Launch", value: "Hilton Istanbul · 31 Jul" },
  { icon: Users, label: "Referral Reward", value: "Min. 2 new joiners" },
  { icon: Trophy, label: "Top Lucky Draw", value: "30K Staking · 365d" },
];

const pillars = [
  {
    icon: Gift,
    title: "Referral Reward",
    body: "Introduce two or more new participants and unlock tiered community rewards through July.",
  },
  {
    icon: Sparkles,
    title: "Staking Boost",
    body: "Extra daily ROI codes and multipliers layered onto every active staking plan.",
  },
  {
    icon: Plane,
    title: "Turkey Event Seats",
    body: "Earn qualifying seats to the Grand Launch weekend in Istanbul, 31 July 2026.",
  },
  {
    icon: Trophy,
    title: "Grand Launch Draw",
    body: "Chances scale with your plan tier — first prize is a 30K, 365-day staking plan.",
  },
];

function JulyPromoPdfPage() {
  const url = promoPdf.url;
  const sizeKb = Math.round(promoPdf.size / 1024);

  return (
    <div>
      <Link
        to="/portal/promotion"
        className="mb-3 inline-flex items-center gap-1 text-xs text-gold/70 transition-colors hover:text-gold"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to Promotions
      </Link>

      <PageHeader
        eyebrow="July 2026 · Community Promotion"
        title="A Month in Istanbul"
        description="Four coordinated rewards leading up to the Naslab Grand Launch at Hilton Istanbul on 31 July 2026. Preview the full brief below or download for offline reference."
        actions={
          <div className="flex flex-wrap gap-2">
            <a
              href={url}
              download="Naslab_July_Promotion_2026.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-background"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold/20 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-gold/80 transition-all hover:border-gold/40 hover:text-gold"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open
            </a>
          </div>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((h) => (
          <SpotlightCard key={h.label} className="liquid-glass rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-gold/20 bg-gold/[0.06] p-2.5 text-gold">
                <h.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.24em] text-gold/60">
                  {h.label}
                </div>
                <div className="mt-1 font-serif text-[15px] leading-snug text-gold">
                  {h.value}
                </div>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-gold/15 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg border border-gold/20 bg-gold/[0.06] p-1.5 text-gold">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <div className="truncate font-serif text-sm text-gold">
                  Naslab_July_Promotion_2026.pdf
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gold/50">
                  7 pages · {sizeKb.toLocaleString()} KB
                </div>
              </div>
            </div>
          </div>
          <object
            data={`${url}#view=FitH`}
            type="application/pdf"
            className="h-[78vh] w-full bg-black/40"
            aria-label="Naslab July 2026 Promotion PDF preview"
          >
            <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center text-sm text-muted-foreground">
              <FileText className="h-8 w-8 text-gold/60" />
              <p>
                Your browser can't display the PDF inline. Use the download or
                open-in-new-tab buttons above.
              </p>
            </div>
          </object>
        </SpotlightCard>

        <div className="flex flex-col gap-3">
          <div className="text-[10px] uppercase tracking-[0.28em] text-gold/60">
            Inside the brief
          </div>
          {pillars.map((p) => (
            <SpotlightCard key={p.title} className="liquid-glass rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl border border-gold/20 bg-gold/[0.06] p-2 text-gold">
                  <p.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-serif text-[15px] leading-snug text-gold">
                    {p.title}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gold/70">{p.body}</p>
                </div>
              </div>
            </SpotlightCard>
          ))}

          <SpotlightCard className="liquid-glass rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-[0.24em] text-gold/60">
              Save the date
            </div>
            <div className="mt-1 font-serif text-lg text-gold">31 July 2026</div>
            <div className="text-xs text-gold/70">Hilton Hotel · Istanbul, Türkiye</div>
            <div className="mt-3 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <p className="mt-3 text-[11px] leading-relaxed text-gold/60">
              One member may claim one lucky-draw prize. Full terms are inside the brief.
            </p>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}
