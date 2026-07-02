import { useEffect, useState } from "react";
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
  Gem,
  Star,
  Ticket,
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

const GOLD_TEXT: React.CSSProperties = {
  background:
    "linear-gradient(180deg, color-mix(in oklab, var(--gold) 95%, white) 0%, var(--gold) 60%, color-mix(in oklab, var(--gold) 70%, black) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const highlights = [
  { icon: CalendarDays, label: "Promotion Window", value: "1 – 31 July", sub: "2026" },
  { icon: MapPin, label: "Grand Launch", value: "Hilton Istanbul", sub: "31 July · Türkiye" },
  { icon: Users, label: "Referral Reward", value: "2+ Joiners", sub: "Tiered bonuses" },
  { icon: Trophy, label: "Top Draw Prize", value: "30K · 365d", sub: "Staking plan" },
];

const pillars = [
  {
    icon: Gift,
    title: "Referral Reward",
    body: "Introduce two or more new participants and unlock tiered community rewards through the month.",
    accent: "2+",
  },
  {
    icon: Sparkles,
    title: "Staking Boost",
    body: "Additional daily ROI codes and multipliers layered onto every active staking plan.",
    accent: "×",
  },
  {
    icon: Plane,
    title: "Turkey Event Seats",
    body: "Earn qualifying seats to the Grand Launch weekend in Istanbul, 31 July 2026.",
    accent: "IST",
  },
  {
    icon: Trophy,
    title: "Grand Launch Draw",
    body: "Chances scale with your plan tier — first prize is a 30K, 365-day staking plan.",
    accent: "1st",
  },
];

const prizeTiers = [
  { rank: "1st", prize: "30,000 USD", detail: "365-day staking plan", icon: Trophy },
  { rank: "2nd", prize: "10,000 USD", detail: "180-day staking plan", icon: Star },
  { rank: "3rd", prize: "5,000 USD", detail: "90-day staking plan", icon: Gem },
  { rank: "4–10", prize: "1,000 USD", detail: "Bonus rewards ×7", icon: Ticket },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

function JulyPromoPdfPage() {
  const url = promoPdf.url;
  const sizeKb = Math.round(promoPdf.size / 1024);
  const { days, hours, minutes, seconds } = useCountdown(new Date("2026-07-31T18:00:00+03:00"));

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
        description="Four coordinated rewards leading to the Naslab Grand Launch at Hilton Istanbul on 31 July 2026."
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

      {/* HERO — Grand Launch showcase */}
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <div className="liquid-glass relative overflow-hidden rounded-2xl p-6 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-2xl"
              style={{
                background:
                  "radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--gold) 16%, transparent), transparent 55%), radial-gradient(120% 80% at 100% 100%, color-mix(in oklab, var(--gold) 12%, transparent), transparent 55%)",
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-gold/70">
                  Grand Launch · Hilton Istanbul
                </span>
              </div>

              <h2
                className="mt-3 font-serif text-4xl font-semibold leading-[0.95] tracking-tight sm:text-6xl"
                style={GOLD_TEXT}
              >
                31 July 2026
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-gold/70">
                One month. Four rewards. A single weekend where the Naslab community
                converges on the Bosphorus for the official Grand Launch.
              </p>

              {/* Countdown */}
              <div className="mt-6 grid grid-cols-4 gap-2 sm:max-w-md">
                {[
                  { label: "Days", value: days },
                  { label: "Hours", value: hours },
                  { label: "Mins", value: minutes },
                  { label: "Secs", value: seconds },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="rounded-xl border border-gold/20 bg-gold/[0.05] px-2 py-3 text-center"
                  >
                    <div
                      className="font-serif text-2xl font-light tabular-nums leading-none sm:text-3xl"
                      style={GOLD_TEXT}
                    >
                      {String(c.value).padStart(2, "0")}
                    </div>
                    <div className="mt-1.5 text-[9px] uppercase tracking-[0.24em] text-gold/60">
                      {c.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative gem */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 hidden h-40 w-40 items-center justify-center rounded-full border border-gold/20 sm:flex"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--gold) 25%, transparent), transparent 60%)",
                boxShadow:
                  "inset 0 0 40px color-mix(in oklab, var(--gold) 15%, transparent)",
              }}
            >
              <Gem className="h-14 w-14 text-gold/40" />
            </div>
          </div>
        </div>

        {/* Prize showcase */}
        <SpotlightCard className="liquid-glass flex h-full flex-col rounded-2xl p-5">
          <div className="text-[10px] uppercase tracking-[0.24em] text-gold/60">
            Lucky Draw · Top Prize
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="font-serif text-4xl font-light tabular-nums" style={GOLD_TEXT}>
              30K
            </div>
            <div className="text-sm text-gold/70">USD</div>
          </div>
          <div className="text-xs text-gold/60">365-day staking plan</div>

          <div className="my-4 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          <div className="flex flex-1 flex-col gap-2">
            {prizeTiers.map((p) => (
              <div
                key={p.rank}
                className="flex items-center justify-between rounded-lg border border-gold/15 bg-gold/[0.03] px-3 py-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md border border-gold/20 bg-gold/[0.06] text-gold">
                    <p.icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-gold/60">
                      {p.rank}
                    </div>
                    <div className="font-serif text-sm text-gold">{p.prize}</div>
                  </div>
                </div>
                <div className="text-right text-[10px] uppercase tracking-[0.16em] text-gold/50">
                  {p.detail}
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>

      {/* At-a-glance highlights */}
      <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                <div className="mt-1 font-serif text-[15px] leading-tight text-gold">
                  {h.value}
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-gold/50">
                  {h.sub}
                </div>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* PDF + Pillars */}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
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
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-gold/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-gold/70 transition-colors hover:border-gold/40 hover:text-gold sm:inline-flex"
            >
              <ExternalLink className="h-3 w-3" />
              Full screen
            </a>
          </div>
          <object
            data={`${url}#view=FitH`}
            type="application/pdf"
            className="h-[80vh] w-full bg-black/40"
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

        {/* Side rail */}
        <div className="flex flex-col gap-3">
          <div className="px-1 text-[10px] uppercase tracking-[0.28em] text-gold/60">
            Inside the brief
          </div>
          {pillars.map((p, i) => (
            <SpotlightCard key={p.title} className="liquid-glass rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="relative mt-0.5">
                  <div className="rounded-xl border border-gold/20 bg-gold/[0.06] p-2 text-gold">
                    <p.icon className="h-4 w-4" />
                  </div>
                  <div className="absolute -right-1 -top-1 rounded-full border border-gold/30 bg-background px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-[0.14em] text-gold/80">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-serif text-[15px] leading-snug text-gold">
                      {p.title}
                    </div>
                    <div className="font-serif text-xs text-gold/50">{p.accent}</div>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gold/70">{p.body}</p>
                </div>
              </div>
            </SpotlightCard>
          ))}

          <div className="liquid-glass relative overflow-hidden rounded-2xl p-5">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-2xl"
              style={{
                background:
                  "radial-gradient(120% 80% at 100% 0%, color-mix(in oklab, var(--gold) 14%, transparent), transparent 60%)",
              }}
            />
            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.24em] text-gold/60">
                Save the date
              </div>
              <div className="mt-1 font-serif text-2xl leading-none" style={GOLD_TEXT}>
                31 · 07 · 26
              </div>
              <div className="mt-1 text-xs text-gold/70">
                Hilton Hotel · Istanbul, Türkiye
              </div>
              <div className="my-3 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              <p className="text-[11px] leading-relaxed text-gold/60">
                One member may claim one lucky-draw prize. Full terms are inside the brief.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
