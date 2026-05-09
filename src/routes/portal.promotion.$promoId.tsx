import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ChevronLeft,
  MapPin,
  CalendarDays,
  Plane,
  Hotel,
  Ticket,
  Check,
  Lock,
  User,
  Users,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { useTranslation } from "react-i18next";

// ---- Promotion meta ----------------------------------------------------------

type Tier = {
  threshold: number;
  seats: number;
  hotel: boolean;
  flightUsd: number;
};

type EventPromo = {
  kind: "event";
  id: string;
  title: string;
  subtitle: string;
  location: string;
  month: string;
  windowLabel: string;
  intro: string;
  personalTiers: Tier[];
  referralTiers: Tier[];
  // Mocked progress until backend wires real values:
  personalAmount: number;
  referralAmount: number;
};

type GenericPromo = {
  kind: "generic";
  id: string;
  title: string;
  subtitle: string;
  description: string;
};

type Promo = EventPromo | GenericPromo;

const PROMOTIONS: Record<string, Promo> = {
  "naslab-turkey": {
    kind: "event",
    id: "naslab-turkey",
    title: "pages.promotion.promotions.naslabTurkey.title",
    subtitle: "pages.promotion.promotions.naslabTurkey.subtitle",
    location: "Türkiye",
    month: "July 2026",
    windowLabel: "1 Feb – 30 Jun 2026",
    intro:
      "NASLAB will host its Official Opening Event in Türkiye in July 2026. Qualify within the campaign window to secure your seat, accommodation, and flight reimbursement.",
    personalTiers: [
      { threshold: 1_000, seats: 1, hotel: false, flightUsd: 0 },
      { threshold: 3_000, seats: 1, hotel: true, flightUsd: 250 },
      { threshold: 5_000, seats: 1, hotel: true, flightUsd: 350 },
      { threshold: 10_000, seats: 2, hotel: true, flightUsd: 700 },
      { threshold: 30_000, seats: 2, hotel: true, flightUsd: 1_000 },
      { threshold: 50_000, seats: 2, hotel: true, flightUsd: 1_500 },
    ],
    referralTiers: [
      { threshold: 5_000, seats: 1, hotel: true, flightUsd: 150 },
      { threshold: 10_000, seats: 1, hotel: true, flightUsd: 300 },
      { threshold: 20_000, seats: 1, hotel: true, flightUsd: 500 },
      { threshold: 30_000, seats: 1, hotel: true, flightUsd: 700 },
      { threshold: 50_000, seats: 1, hotel: true, flightUsd: 1_000 },
    ],
    personalAmount: 4_200,
    referralAmount: 12_500,
  },
  "rcb-tcb-community-ranking": {
    kind: "generic",
    id: "rcb-tcb-community-ranking",
    title: "pages.promotion.promotions.rankingIncentive.title",
    subtitle: "pages.promotion.promotions.rankingIncentive.subtitle",
    description: "pages.promotionDetail.promotions.rankingIncentive.description",
  },
};

export const Route = createFileRoute("/portal/promotion/$promoId")({
  loader: ({ params }) => {
    const promo = PROMOTIONS[params.promoId];
    if (!promo) throw notFound();
    return { promo };
  },
  component: PromotionDetailPage,
  notFoundComponent: () => {
    const { t } = useTranslation();
    return <div className="p-6 text-sm text-muted-foreground">{t("pages.promotionDetail.notFound")}</div>;
  },
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">{error.message}</div>,
});

// ---- Page --------------------------------------------------------------------

function PromotionDetailPage() {
  const { t } = useTranslation();
  const { promo } = Route.useLoaderData();

  return (
    <div>
      <Link
        to="/portal/promotion"
        className="mb-3 inline-flex items-center gap-1 text-xs text-gold/70 hover:text-gold"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {t("pages.promotionDetail.backToPromotions")}
      </Link>

      <PageHeader eyebrow={t(promo.subtitle)} title={t(promo.title)} />

      {promo.kind === "event" ? <EventPromotion promo={promo} /> : <GenericPromotion promo={promo} />}
    </div>
  );
}

// ---- Generic fallback --------------------------------------------------------

function GenericPromotion({ promo }: { promo: GenericPromo }) {
  const { t } = useTranslation();
  return (
    <SpotlightCard className="liquid-glass rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2 text-gold">
        <Sparkles className="h-4 w-4" />
        <span className="text-[11px] uppercase tracking-[0.2em]">
          {t("pages.promotionDetail.details")}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/80">{t(promo.description)}</p>
    </SpotlightCard>
  );
}

// ---- Event promotion (Naslab Turkey) -----------------------------------------

function EventPromotion({ promo }: { promo: EventPromo }) {
  const personal = computeStanding(promo.personalAmount, promo.personalTiers);
  const referral = computeStanding(promo.referralAmount, promo.referralTiers);

  return (
    <div className="space-y-4">
      {/* Event meta */}
      <SpotlightCard className="liquid-glass rounded-2xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-gold">
              <Sparkles className="h-4 w-4" />
              <span className="text-[11px] uppercase tracking-[0.2em]">Official Opening</span>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-foreground/80">{promo.intro}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <MetaPill icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={promo.location} />
            <MetaPill icon={<CalendarDays className="h-3.5 w-3.5" />} label="Event" value={promo.month} />
            <MetaPill icon={<TrendingUp className="h-3.5 w-3.5" />} label="Window" value={promo.windowLabel} />
          </div>
        </div>
      </SpotlightCard>

      {/* Two qualification tracks */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TrackCard
          icon={<User className="h-4 w-4" />}
          eyebrow="Track 01 · Participant"
          title="Personal Participation"
          standing={personal}
        />
        <TrackCard
          icon={<Users className="h-4 w-4" />}
          eyebrow="Track 02 · Referrer"
          title="Referral Participation"
          standing={referral}
        />
      </div>

      {/* Tier ladders */}
      <TierLadder
        title="Participant Incentive"
        subtitle="Direct participation between 1 Feb – 30 Jun 2026"
        tiers={promo.personalTiers}
        amount={promo.personalAmount}
      />
      <TierLadder
        title="Referral Incentive"
        subtitle="Total participation referred between 1 Feb – 30 Jun 2026"
        tiers={promo.referralTiers}
        amount={promo.referralAmount}
      />

      {/* Fine print */}
      <p className="px-1 pt-1 text-[11px] leading-relaxed text-muted-foreground">
        Rewards are issued during the Official Opening Event in July 2026. Qualification is final at the
        end of the campaign window. Flight reimbursement is paid in USDT against valid travel
        documentation.
      </p>
    </div>
  );
}

// ---- Pieces ------------------------------------------------------------------

function MetaPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gold/15 bg-gold/[0.03] px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-gold/70">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 font-serif text-sm font-semibold text-gold">{value}</div>
    </div>
  );
}

type Standing = {
  amount: number;
  current: Tier | null;
  next: Tier | null;
  remaining: number;
  progressInTier: number; // 0..100 within current segment
  topReached: boolean;
};

function computeStanding(amount: number, tiers: Tier[]): Standing {
  const sorted = [...tiers].sort((a, b) => a.threshold - b.threshold);
  let current: Tier | null = null;
  for (const t of sorted) {
    if (amount >= t.threshold) current = t;
    else break;
  }
  const next = sorted.find((t) => t.threshold > amount) ?? null;
  const remaining = next ? Math.max(0, next.threshold - amount) : 0;

  // Progress within the current segment (between current.threshold → next.threshold)
  let progressInTier = 0;
  if (next) {
    const floor = current?.threshold ?? 0;
    const span = Math.max(1, next.threshold - floor);
    progressInTier = Math.min(100, Math.max(0, ((amount - floor) / span) * 100));
  } else {
    progressInTier = 100;
  }

  return {
    amount,
    current,
    next,
    remaining,
    progressInTier,
    topReached: !next && amount >= (sorted[sorted.length - 1]?.threshold ?? 0),
  };
}

function TrackCard({
  icon,
  eyebrow,
  title,
  standing,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  standing: Standing;
}) {
  const { amount, current, next, remaining, progressInTier, topReached } = standing;
  const qualified = !!current;

  return (
    <SpotlightCard className="liquid-glass rounded-2xl p-6">
      <div className="mb-3 flex items-center gap-2 text-gold">
        {icon}
        <span className="text-[11px] uppercase tracking-[0.2em]">{eyebrow}</span>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-lg font-semibold text-gold">{title}</h3>
        <StatusChip qualified={qualified} top={topReached} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold/70">Your volume</div>
          <div className="mt-0.5 font-serif text-2xl font-semibold tabular-nums text-gold">
            {fmtUSDT(amount)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold/70">Current tier</div>
          <div className="mt-0.5 font-serif text-lg font-semibold tabular-nums text-foreground">
            {current ? fmtUSDT(current.threshold) : "—"}
          </div>
        </div>
      </div>

      {/* Progress to next */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-gold/80">
          <span>
            {next ? (
              <>
                Next tier · <span className="tabular-nums text-gold">{fmtUSDT(next.threshold)}</span>
              </>
            ) : (
              <>Top tier reached</>
            )}
          </span>
          <span className="tabular-nums">{Math.round(progressInTier)}%</span>
        </div>
        <div className="relative h-1.5 overflow-hidden rounded-full bg-gold/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold/70 to-gold"
            style={{ width: `${progressInTier}%` }}
          />
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">
          {next ? (
            <>
              <span className="tabular-nums text-gold">{fmtUSDT(remaining)}</span> remaining to unlock
              the next tier of rewards.
            </>
          ) : (
            <>You have unlocked the maximum reward bracket. Congratulations.</>
          )}
        </div>
      </div>

      {/* Currently unlocked rewards */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <RewardStat
          icon={<Ticket className="h-3.5 w-3.5" />}
          label="Seats"
          value={current ? String(current.seats) : "0"}
          dim={!current}
        />
        <RewardStat
          icon={<Hotel className="h-3.5 w-3.5" />}
          label="Hotel"
          value={current ? (current.hotel ? "Included" : "—") : "—"}
          dim={!current?.hotel}
        />
        <RewardStat
          icon={<Plane className="h-3.5 w-3.5" />}
          label="Flight"
          value={current && current.flightUsd > 0 ? `${current.flightUsd} USDT` : "—"}
          dim={!current || current.flightUsd === 0}
        />
      </div>
    </SpotlightCard>
  );
}

function StatusChip({ qualified, top }: { qualified: boolean; top: boolean }) {
  if (top) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-gold/50 bg-gold/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
        <Sparkles className="h-3 w-3" /> Apex
      </span>
    );
  }
  return qualified ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
      <Check className="h-3 w-3" /> Qualified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
      <Lock className="h-3 w-3" /> Pending
    </span>
  );
}

function RewardStat({
  icon,
  label,
  value,
  dim,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  dim?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 ${
        dim
          ? "border-foreground/10 bg-foreground/[0.02] text-muted-foreground"
          : "border-gold/25 bg-gold/[0.06] text-gold"
      }`}
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] opacity-80">
        {icon}
        {label}
      </div>
      <div
        className={`mt-0.5 font-serif text-sm font-semibold tabular-nums ${
          dim ? "text-foreground/60" : "text-gold"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function TierLadder({
  title,
  subtitle,
  tiers,
  amount,
}: {
  title: string;
  subtitle: string;
  tiers: Tier[];
  amount: number;
}) {
  return (
    <SpotlightCard className="liquid-glass rounded-2xl p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-gold">{title}</div>
          <h3 className="mt-0.5 font-serif text-base font-semibold text-foreground">{subtitle}</h3>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold/70">Your volume</div>
          <div className="font-serif text-base font-semibold tabular-nums text-gold">
            {fmtUSDT(amount)}
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-xl border border-gold/15">
          <table className="w-full text-sm">
            <thead className="bg-gold/[0.04] text-[10px] uppercase tracking-[0.18em] text-gold/80">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium">Threshold</th>
                <th className="px-4 py-2.5 text-center font-medium">Seats</th>
                <th className="px-4 py-2.5 text-center font-medium">Hotel</th>
                <th className="px-4 py-2.5 text-right font-medium">Flight (USDT)</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier, i) => {
                const reached = amount >= tier.threshold;
                return (
                  <tr
                    key={tier.threshold}
                    className={`border-t border-gold/10 ${
                      reached ? "bg-gold/[0.05]" : "bg-transparent"
                    } ${i === tiers.length - 1 ? "" : ""}`}
                  >
                    <td className="px-4 py-3">
                      {reached ? (
                        <span className="inline-flex items-center gap-1.5 text-gold">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gold/50 bg-gold/15">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.18em]">Achieved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-foreground/15 bg-foreground/[0.04]">
                            <Lock className="h-3 w-3" />
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.18em]">Locked</span>
                        </span>
                      )}
                    </td>
                    <td className={`px-4 py-3 text-right font-serif tabular-nums ${reached ? "text-gold" : "text-foreground/70"}`}>
                      {fmtUSDT(tier.threshold)}
                    </td>
                    <td className={`px-4 py-3 text-center tabular-nums ${reached ? "text-gold" : "text-foreground/70"}`}>
                      {tier.seats}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {tier.hotel ? (
                        <Check className={`mx-auto h-3.5 w-3.5 ${reached ? "text-gold" : "text-foreground/40"}`} />
                      ) : (
                        <span className="text-foreground/40">—</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 text-right font-serif tabular-nums ${reached ? "text-gold" : "text-foreground/70"}`}>
                      {tier.flightUsd > 0 ? tier.flightUsd.toLocaleString() : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile stacked */}
      <div className="space-y-2 md:hidden">
        {tiers.map((tier) => {
          const reached = amount >= tier.threshold;
          return (
            <div
              key={tier.threshold}
              className={`rounded-xl border px-3 py-3 ${
                reached
                  ? "border-gold/40 bg-gold/[0.06]"
                  : "border-foreground/10 bg-foreground/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      reached
                        ? "border-gold/50 bg-gold/15 text-gold"
                        : "border-foreground/15 bg-foreground/[0.04] text-muted-foreground"
                    }`}
                  >
                    {reached ? <Check className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  </span>
                  <span
                    className={`font-serif text-sm font-semibold tabular-nums ${
                      reached ? "text-gold" : "text-foreground/70"
                    }`}
                  >
                    {fmtUSDT(tier.threshold)}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {reached ? "Achieved" : "Locked"}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                <div className="flex items-center gap-1 text-foreground/70">
                  <Ticket className="h-3 w-3" /> {tier.seats}
                </div>
                <div className="flex items-center gap-1 text-foreground/70">
                  <Hotel className="h-3 w-3" /> {tier.hotel ? "Yes" : "—"}
                </div>
                <div className="flex items-center gap-1 text-foreground/70">
                  <Plane className="h-3 w-3" /> {tier.flightUsd > 0 ? `${tier.flightUsd}` : "—"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SpotlightCard>
  );
}

// ---- Utils -------------------------------------------------------------------

function fmtUSDT(n: number) {
  return `${n.toLocaleString()} USDT`;
}
