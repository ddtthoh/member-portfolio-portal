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
  UserPlus,
  Wallet,
  Trophy,
  Crown,
  Gift,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { MetricValue } from "@/components/metric-value";
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

type RankingTier = {
  name: string;
  reward: string;
  valueUsd: number;
  icon: "bronze" | "silver" | "gold" | "platinum" | "diamond" | "partner";
};

type TcbTier = {
  minRcb: number;
  minAum: number;
  pct: number;
};

type TrackProgressData = {
  pct: number;
  topLeft: string;
  bottom: React.ReactNode;
};

type RankingPromo = {
  kind: "ranking";
  id: string;
  title: string;
  subtitle: string;
  windowLabel: string;
  intro: string;
  rcbPerReferralUsd: number;
  rcbMinStakeUsd: number;
  rcbCount: number;
  tcbTiers: TcbTier[];
  currentAum: number;
  rankingTiers: RankingTier[];
  currentRankIndex: number;
  // Backend-provided: progress towards next community rank
  nextRankProgress?: {
    current: number;
    target: number;
    unit: string;
    metricLabel: string;
  };
};

type Promo = EventPromo | GenericPromo | RankingPromo;

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
    kind: "ranking",
    id: "rcb-tcb-community-ranking",
    title: "pages.promotion.promotions.rankingIncentive.title",
    subtitle: "pages.promotion.promotions.rankingIncentive.subtitle",
    windowLabel: "1 Feb – 30 Jun 2026",
    intro:
      "Earn across three parallel tracks during the campaign window: every qualified referral pays out instantly, top performers unlock a share of AUM, and community-wide ranking unlocks signature physical rewards — paid out at the July 2026 Event.",
    rcbPerReferralUsd: 5,
    rcbMinStakeUsd: 100,
    rcbCount: 8,
    tcbTiers: [
      { minRcb: 10, minAum: 5_000, pct: 2.5 },
      { minRcb: 20, minAum: 20_000, pct: 5 },
    ],
    currentAum: 8_500,
    rankingTiers: [
      { name: "Bronze", reward: "iPhone 17", valueUsd: 1_500, icon: "bronze" },
      { name: "Silver", reward: "Marketing Support Fund", valueUsd: 3_000, icon: "silver" },
      { name: "Gold", reward: "Marketing Support Fund", valueUsd: 5_000, icon: "gold" },
      { name: "Platinum", reward: "Rolex Daytona", valueUsd: 30_000, icon: "platinum" },
      { name: "Diamond", reward: "Car Subsidy", valueUsd: 100_000, icon: "diamond" },
      { name: "Partner", reward: "Property Subsidy", valueUsd: 300_000, icon: "partner" },
    ],
    currentRankIndex: 2, // mock: currently at Gold
    nextRankProgress: {
      current: 38,
      target: 50,
      unit: "leaders",
      metricLabel: "Qualified Leaders",
    },
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

      {promo.kind === "event" ? (
        <EventPromotion promo={promo} />
      ) : promo.kind === "ranking" ? (
        <RankingPromotion promo={promo} />
      ) : (
        <GenericPromotion promo={promo} />
      )}
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
      <p className="text-sm leading-relaxed text-gold/80">{t(promo.description)}</p>
    </SpotlightCard>
  );
}

// ---- Event promotion ---------------------------------------------------------

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
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{promo.intro}</p>
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

      <p className="px-1 pt-1 text-[11px] leading-relaxed text-gold/60">
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
      <div className="mt-0.5 text-sm font-light tabular-nums tracking-tight text-gold">{value}</div>
    </div>
  );
}

type Standing = {
  amount: number;
  current: Tier | null;
  next: Tier | null;
  remaining: number;
  progressInTier: number;
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
    <SpotlightCard className="liquid-glass gold-aura relative overflow-hidden rounded-2xl p-6">
      {/* Ambient gold corner glow to make user's tracking the focal point */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--gold) 14%, transparent), transparent 55%), radial-gradient(120% 80% at 100% 100%, color-mix(in oklab, var(--gold) 8%, transparent), transparent 60%)",
        }}
      />
      <div className="relative mb-3 flex items-center gap-2 text-gold">
        {icon}
        <span className="text-[11px] uppercase tracking-[0.2em]">{eyebrow}</span>
        <span className="ml-auto text-[9px] uppercase tracking-[0.22em] text-gold/60">Your Tracking</span>
      </div>

      <div className="relative flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-light tracking-tight text-gold">{title}</h3>
        <StatusChip qualified={qualified} top={topReached} />
      </div>

      <div className="relative mt-4 flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold/70">Your volume</div>
          <MetricValue value={amount} suffix=" USDT" decimals={0} size="md" className="mt-0.5" />
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold/70">Current tier</div>
          <div className="mt-0.5">
            {current ? (
              <MetricValue value={current.threshold} suffix=" USDT" decimals={0} size="sm" static />
            ) : (
              <span className="text-sm text-gold/60">—</span>
            )}
          </div>
        </div>
      </div>

      {/* Progress to next */}
      <div className="relative mt-5">
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-gold/80">
          <span>
            {next ? (
              <>
                Next tier ·{" "}
                <span className="font-light tabular-nums tracking-tight text-gold">
                  {next.threshold.toLocaleString()} USDT
                </span>
              </>
            ) : (
              <>Top tier reached</>
            )}
          </span>
          <span className="tabular-nums text-gold">{Math.round(progressInTier)}%</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-gold/10">
          <div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold/70 to-gold ${progressInTier > 0 ? "gold-glow-bar" : ""}`}
            style={{ width: `${progressInTier}%` }}
          />
          {progressInTier > 0 && progressInTier < 100 && (
            <span
              aria-hidden
              className="gold-glow-md absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-gold"
              style={{ left: `calc(${progressInTier}% - 5px)` }}
            />
          )}
        </div>
        <div className="mt-2 text-[11px] text-gold/70">
          {next ? (
            <>
              <span className="font-light tabular-nums tracking-tight text-gold">
                {remaining.toLocaleString()} USDT
              </span>{" "}
              remaining to unlock the next tier of rewards.
            </>
          ) : (
            <>You have unlocked the maximum reward bracket. Congratulations.</>
          )}
        </div>
      </div>

      {/* Currently unlocked rewards */}
      <div className="relative mt-5 grid grid-cols-3 gap-2">
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
          value={current && current.flightUsd > 0 ? `${current.flightUsd.toLocaleString()} USDT` : "—"}
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
        className={`mt-0.5 text-sm font-light tabular-nums tracking-tight ${
          dim ? "text-muted-foreground" : "text-gold"
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
          <h3 className="mt-0.5 text-base font-light tracking-tight text-muted-foreground">
            {subtitle}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold/70">Your volume</div>
          <MetricValue value={amount} suffix=" USDT" decimals={0} size="sm" className="mt-0.5" static />
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
              {tiers.map((tier) => {
                const reached = amount >= tier.threshold;
                const numCls = reached
                  ? "font-light tabular-nums tracking-tight text-gold"
                  : "font-light tabular-nums tracking-tight text-muted-foreground";
                return (
                  <tr
                    key={tier.threshold}
                    className={`border-t border-gold/10 ${reached ? "bg-gold/[0.05]" : "bg-transparent"}`}
                  >
                    <td className="px-4 py-3">
                      {reached ? (
                        <span className="inline-flex items-center gap-1.5 text-gold">
                          <span className="gold-glow-sm flex h-5 w-5 items-center justify-center rounded-full border border-gold/50 bg-gold/15">
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
                    <td className={`px-4 py-3 text-right ${numCls}`}>
                      {tier.threshold.toLocaleString()} USDT
                    </td>
                    <td className={`px-4 py-3 text-center ${numCls}`}>{tier.seats}</td>
                    <td className="px-4 py-3 text-center">
                      {tier.hotel ? (
                        <Check className={`mx-auto h-3.5 w-3.5 ${reached ? "text-gold" : "text-muted-foreground"}`} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 text-right ${numCls}`}>
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
          const numCls = reached
            ? "font-light tabular-nums tracking-tight text-gold"
            : "font-light tabular-nums tracking-tight text-muted-foreground";
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
                        ? "gold-glow-sm border-gold/50 bg-gold/15 text-gold"
                        : "border-foreground/15 bg-foreground/[0.04] text-muted-foreground"
                    }`}
                  >
                    {reached ? <Check className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  </span>
                  <span className={`text-sm ${numCls}`}>
                    {tier.threshold.toLocaleString()} USDT
                  </span>
                </div>
                <span className={`text-[10px] uppercase tracking-[0.18em] ${reached ? "text-gold" : "text-muted-foreground"}`}>
                  {reached ? "Achieved" : "Locked"}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                <div className={`flex items-center gap-1 ${reached ? "text-gold" : "text-muted-foreground"}`}>
                  <Ticket className="h-3 w-3" /> {tier.seats}
                </div>
                <div className={`flex items-center gap-1 ${reached ? "text-gold" : "text-muted-foreground"}`}>
                  <Hotel className="h-3 w-3" /> {tier.hotel ? "Yes" : "—"}
                </div>
                <div className={`flex items-center gap-1 ${reached ? "text-gold" : "text-muted-foreground"}`}>
                  <Plane className="h-3 w-3" /> {tier.flightUsd > 0 ? tier.flightUsd.toLocaleString() : "—"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SpotlightCard>
  );
}

// ---- Ranking promotion (RCB / TCB / Community Ranking) ----------------------

function RankingPromotion({ promo }: { promo: RankingPromo }) {
  const rcbEarned = promo.rcbCount * promo.rcbPerReferralUsd;

  // ---- RCB progress: linear milestones --------------------------------------
  const rcbMilestones = [1, 5, 10, 20, 50, 100];
  const rcbNext = rcbMilestones.find((m) => promo.rcbCount < m) ?? null;
  const rcbPrev = [...rcbMilestones].reverse().find((m) => promo.rcbCount >= m) ?? 0;
  const rcbPct = rcbNext
    ? Math.min(100, Math.max(0, ((promo.rcbCount - rcbPrev) / (rcbNext - rcbPrev)) * 100))
    : 100;
  const rcbProgress: TrackProgressData | null = rcbNext
    ? {
        pct: rcbPct,
        topLeft: `Next milestone · ${rcbNext} referrals`,
        bottom: (
          <>
            <span className="font-light tabular-nums tracking-tight text-gold">
              {rcbNext - promo.rcbCount}
            </span>{" "}
            more to unlock{" "}
            <span className="font-light tabular-nums tracking-tight text-gold">
              ${(rcbNext * promo.rcbPerReferralUsd).toLocaleString()}
            </span>
            .
          </>
        ),
      }
    : null;

  // ---- TCB progress: min(rcbPct, aumPct) of next tier ----------------------
  const tcbSorted = [...promo.tcbTiers].sort((a, b) => a.pct - b.pct);
  let currentTcb: TcbTier | null = null;
  for (const t of tcbSorted) {
    if (promo.rcbCount >= t.minRcb && promo.currentAum >= t.minAum) currentTcb = t;
  }
  const nextTcb =
    tcbSorted.find((t) => !(promo.rcbCount >= t.minRcb && promo.currentAum >= t.minAum)) ?? null;
  const tcbPayout = currentTcb ? (promo.currentAum * currentTcb.pct) / 100 : 0;

  let tcbProgress: TrackProgressData | null = null;
  if (nextTcb) {
    const rcbDone = Math.min(100, (promo.rcbCount / nextTcb.minRcb) * 100);
    const aumDone = Math.min(100, (promo.currentAum / nextTcb.minAum) * 100);
    const pct = Math.min(rcbDone, aumDone);
    const rcbGap = Math.max(0, nextTcb.minRcb - promo.rcbCount);
    const aumGap = Math.max(0, nextTcb.minAum - promo.currentAum);
    tcbProgress = {
      pct,
      topLeft: `Next tier · ${nextTcb.pct}% AUM`,
      bottom: (
        <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1">
            {rcbGap === 0 ? (
              <Check className="h-3 w-3 text-gold" />
            ) : (
              <span className="font-light tabular-nums tracking-tight text-gold">{rcbGap}</span>
            )}
            <span>{rcbGap === 0 ? "RCB" : "more RCB"}</span>
          </span>
          <span className="text-gold/30">·</span>
          <span className="inline-flex items-center gap-1">
            {aumGap === 0 ? (
              <Check className="h-3 w-3 text-gold" />
            ) : (
              <span className="font-light tabular-nums tracking-tight text-gold">
                {aumGap.toLocaleString()}
              </span>
            )}
            <span>{aumGap === 0 ? "AUM" : "more USDT AUM"}</span>
          </span>
        </span>
      ),
    };
  }

  // ---- Ranking progress: backend-supplied "X more" -------------------------
  const currentRank =
    promo.currentRankIndex >= 0 ? promo.rankingTiers[promo.currentRankIndex] : null;
  const nextRank =
    promo.currentRankIndex + 1 < promo.rankingTiers.length
      ? promo.rankingTiers[promo.currentRankIndex + 1]
      : null;

  let rankingProgress: TrackProgressData | null = null;
  if (nextRank && promo.nextRankProgress) {
    const { current, target, unit, metricLabel } = promo.nextRankProgress;
    const pct = Math.min(100, Math.max(0, (current / target) * 100));
    const remaining = Math.max(0, target - current);
    rankingProgress = {
      pct,
      topLeft: `Next rank · ${nextRank.name}`,
      bottom: (
        <>
          <span className="font-light tabular-nums tracking-tight text-gold">{remaining}</span>{" "}
          more {unit} to unlock{" "}
          <span className="text-gold">{nextRank.reward}</span>
          <span className="ml-1 text-gold/50">({metricLabel.toLowerCase()})</span>
        </>
      ),
    };
  }

  return (
    <div className="space-y-4">
      {/* Window meta */}
      <SpotlightCard className="liquid-glass rounded-2xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-gold">
              <Sparkles className="h-4 w-4" />
              <span className="text-[11px] uppercase tracking-[0.2em]">Three Tracks · One Window</span>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{promo.intro}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <MetaPill
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              label="Window"
              value={promo.windowLabel}
            />
            <MetaPill
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              label="Payout"
              value="July Event"
            />
          </div>
        </div>
      </SpotlightCard>

      {/* Three tracker cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RankingTrackCard
          icon={<UserPlus className="h-4 w-4" />}
          eyebrow="Track 01 · RCB"
          title="Rapid Community Builder"
          status={promo.rcbCount > 0 ? "qualified" : "pending"}
          primaryLabel="Qualified Referrals"
          primaryValue={promo.rcbCount}
          secondaryLabel="Reward earned"
          secondaryValue={rcbEarned}
          secondaryPrefix="$"
          progress={rcbProgress}
          fallbackFootnote={`USD ${promo.rcbPerReferralUsd} per referral · min stake ${promo.rcbMinStakeUsd} USDT`}
        />

        <RankingTrackCard
          icon={<Wallet className="h-4 w-4" />}
          eyebrow="Track 02 · TCB"
          title="Top Community Builder"
          status={currentTcb ? "qualified" : "pending"}
          primaryLabel="Your AUM"
          primaryValue={promo.currentAum}
          primarySuffix=" USDT"
          secondaryLabel={currentTcb ? `Reward · ${currentTcb.pct}% AUM` : "Reward"}
          secondaryValue={tcbPayout}
          secondarySuffix=" USDT"
          progress={tcbProgress}
          fallbackFootnote="Top TCB tier reached."
        />

        <RankingTrackCard
          icon={<Trophy className="h-4 w-4" />}
          eyebrow="Track 03 · Ranking"
          title="Community Ranking"
          status={currentRank ? (nextRank ? "qualified" : "apex") : "pending"}
          primaryLabel="Current rank"
          primaryText={currentRank ? currentRank.name : "—"}
          secondaryLabel={currentRank ? "Reward value" : "—"}
          secondaryValue={currentRank ? currentRank.valueUsd : 0}
          secondarySuffix=" USDT"
          progress={rankingProgress}
          fallbackFootnote={
            nextRank
              ? `Next rank: ${nextRank.name} · ${nextRank.reward}`
              : "Apex rank achieved — Partner tier."
          }
        />
      </div>

      {/* RCB ladder (linear payout examples) */}
      <SpotlightCard className="liquid-glass rounded-2xl p-6">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-gold">RCB Payout Ladder</div>
            <h3 className="mt-0.5 text-base font-light tracking-tight text-muted-foreground">
              USD {promo.rcbPerReferralUsd} for every referral with a minimum stake of {promo.rcbMinStakeUsd} USDT
            </h3>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-gold/70">You earned</div>
            <MetricValue
              value={rcbEarned}
              prefix="$"
              decimals={0}
              size="sm"
              className="mt-0.5"
              static
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {[1, 5, 10, 20, 50, 100].map((n) => {
            const reached = promo.rcbCount >= n;
            return (
              <div
                key={n}
                className={`rounded-xl border px-3 py-3 text-center ${
                  reached
                    ? "border-gold/40 bg-gold/[0.06]"
                    : "border-foreground/10 bg-foreground/[0.02]"
                }`}
              >
                <div
                  className={`text-[10px] uppercase tracking-[0.2em] ${
                    reached ? "text-gold/80" : "text-muted-foreground"
                  }`}
                >
                  {n} REFERRALS
                </div>
                <div
                  className={`mt-1 font-light tabular-nums tracking-tight ${
                    reached ? "text-gold" : "text-muted-foreground"
                  }`}
                >
                  ${(n * promo.rcbPerReferralUsd).toLocaleString()}
                </div>
                <div className="mt-1.5 flex items-center justify-center">
                  {reached ? (
                    <span className="gold-glow-sm flex h-5 w-5 items-center justify-center rounded-full border border-gold/50 bg-gold/15 text-gold">
                      <Check className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-foreground/15 bg-foreground/[0.04] text-muted-foreground">
                      <Lock className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SpotlightCard>

      {/* TCB ladder */}
      <SpotlightCard className="liquid-glass rounded-2xl p-6">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-gold">TCB Tier Structure</div>
            <h3 className="mt-0.5 text-base font-light tracking-tight text-muted-foreground">
              Earn a percentage of your Asset Under Management
            </h3>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-gold/70">Projected reward</div>
            <MetricValue
              value={tcbPayout}
              suffix=" USDT"
              decimals={0}
              size="sm"
              className="mt-0.5"
              static
            />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-xl border border-gold/15">
            <table className="w-full text-sm">
              <thead className="bg-gold/[0.04] text-[10px] uppercase tracking-[0.18em] text-gold/80">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium">Min RCB</th>
                  <th className="px-4 py-2.5 text-right font-medium">Min AUM</th>
                  <th className="px-4 py-2.5 text-right font-medium">Reward</th>
                </tr>
              </thead>
              <tbody>
                {tcbSorted.map((tier) => {
                  const reached =
                    promo.rcbCount >= tier.minRcb && promo.currentAum >= tier.minAum;
                  const numCls = reached
                    ? "font-light tabular-nums tracking-tight text-gold"
                    : "font-light tabular-nums tracking-tight text-muted-foreground";
                  return (
                    <tr
                      key={tier.pct}
                      className={`border-t border-gold/10 ${reached ? "bg-gold/[0.05]" : ""}`}
                    >
                      <td className="px-4 py-3">
                        {reached ? (
                          <span className="inline-flex items-center gap-1.5 text-gold">
                            <span className="gold-glow-sm flex h-5 w-5 items-center justify-center rounded-full border border-gold/50 bg-gold/15">
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
                      <td className={`px-4 py-3 text-right ${numCls}`}>{tier.minRcb}</td>
                      <td className={`px-4 py-3 text-right ${numCls}`}>
                        {tier.minAum.toLocaleString()} USDT
                      </td>
                      <td className={`px-4 py-3 text-right ${numCls}`}>{tier.pct}% of AUM</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile */}
        <div className="space-y-2 md:hidden">
          {tcbSorted.map((tier) => {
            const reached =
              promo.rcbCount >= tier.minRcb && promo.currentAum >= tier.minAum;
            return (
              <div
                key={tier.pct}
                className={`rounded-xl border px-3 py-3 ${
                  reached
                    ? "border-gold/40 bg-gold/[0.06]"
                    : "border-foreground/10 bg-foreground/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-light tabular-nums tracking-tight ${
                      reached ? "text-gold" : "text-muted-foreground"
                    }`}
                  >
                    {tier.pct}% of AUM
                  </span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      reached
                        ? "gold-glow-sm border-gold/50 bg-gold/15 text-gold"
                        : "border-foreground/15 bg-foreground/[0.04] text-muted-foreground"
                    }`}
                  >
                    {reached ? <Check className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  </span>
                </div>
                <div
                  className={`mt-1 text-[11px] ${
                    reached ? "text-gold/80" : "text-muted-foreground"
                  }`}
                >
                  Need {tier.minRcb} RCB · {tier.minAum.toLocaleString()} USDT AUM
                </div>
              </div>
            );
          })}
        </div>
      </SpotlightCard>

      {/* Community Ranking ladder */}
      <SpotlightCard className="liquid-glass rounded-2xl p-6">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-gold">Community Ranking</div>
            <h3 className="mt-0.5 text-base font-light tracking-tight text-muted-foreground">
              Attain the rank during 1 Feb – 30 Jun 2026 to claim its signature reward
            </h3>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-gold/70">Current rank</div>
            <div
              className={`mt-0.5 text-base font-light tracking-tight ${
                currentRank ? "text-gold" : "text-muted-foreground"
              }`}
            >
              {currentRank ? currentRank.name : "—"}
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-xl border border-gold/15">
            <table className="w-full text-sm">
              <thead className="bg-gold/[0.04] text-[10px] uppercase tracking-[0.18em] text-gold/80">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Rank</th>
                  <th className="px-4 py-2.5 text-left font-medium">Reward</th>
                  <th className="px-4 py-2.5 text-right font-medium">Approx. Value</th>
                </tr>
              </thead>
              <tbody>
                {promo.rankingTiers.map((tier, i) => {
                  const reached = i <= promo.currentRankIndex;
                  const isCurrent = i === promo.currentRankIndex;
                  const numCls = reached
                    ? "font-light tabular-nums tracking-tight text-gold"
                    : "font-light tabular-nums tracking-tight text-muted-foreground";
                  return (
                    <tr
                      key={tier.name}
                      className={`border-t border-gold/10 ${
                        isCurrent ? "bg-gold/[0.08]" : reached ? "bg-gold/[0.04]" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        {reached ? (
                          <span className="inline-flex items-center gap-1.5 text-gold">
                            <span className="gold-glow-sm flex h-5 w-5 items-center justify-center rounded-full border border-gold/50 bg-gold/15">
                              {isCurrent ? <Crown className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                            </span>
                            <span className="text-[11px] uppercase tracking-[0.18em]">
                              {isCurrent ? "Current" : "Achieved"}
                            </span>
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
                      <td
                        className={`px-4 py-3 text-sm font-light tracking-tight ${
                          reached ? "text-gold" : "text-muted-foreground"
                        }`}
                      >
                        {tier.name}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          reached ? "text-gold/90" : "text-muted-foreground"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Gift className="h-3.5 w-3.5 opacity-70" />
                          {tier.reward}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right ${numCls}`}>
                        {tier.valueUsd.toLocaleString()} USDT
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile */}
        <div className="space-y-2 md:hidden">
          {promo.rankingTiers.map((tier, i) => {
            const reached = i <= promo.currentRankIndex;
            const isCurrent = i === promo.currentRankIndex;
            return (
              <div
                key={tier.name}
                className={`rounded-xl border px-3 py-3 ${
                  isCurrent
                    ? "border-gold/50 bg-gold/[0.08]"
                    : reached
                      ? "border-gold/30 bg-gold/[0.04]"
                      : "border-foreground/10 bg-foreground/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        reached
                          ? "gold-glow-sm border-gold/50 bg-gold/15 text-gold"
                          : "border-foreground/15 bg-foreground/[0.04] text-muted-foreground"
                      }`}
                    >
                      {reached ? (
                        isCurrent ? (
                          <Crown className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                    </span>
                    <span
                      className={`text-sm font-light tracking-tight ${
                        reached ? "text-gold" : "text-muted-foreground"
                      }`}
                    >
                      {tier.name}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-light tabular-nums tracking-tight ${
                      reached ? "text-gold" : "text-muted-foreground"
                    }`}
                  >
                    {tier.valueUsd.toLocaleString()} USDT
                  </span>
                </div>
                <div
                  className={`mt-1.5 flex items-center gap-1.5 text-[11px] ${
                    reached ? "text-gold/80" : "text-muted-foreground"
                  }`}
                >
                  <Gift className="h-3 w-3 opacity-70" />
                  {tier.reward}
                </div>
              </div>
            );
          })}
        </div>
      </SpotlightCard>

      <p className="px-1 pt-1 text-[11px] leading-relaxed text-gold/60">
        All three tracks are calculated from 1 February to 30 June 2026 and paid out at the July 2026
        Event. Final rankings are verified against official system data.
      </p>
    </div>
  );
}

// ---- Ranking track card -----------------------------------------------------

function RankingTrackCard({
  icon,
  eyebrow,
  title,
  status,
  primaryLabel,
  primaryValue,
  primaryText,
  primaryPrefix = "",
  primarySuffix = "",
  secondaryLabel,
  secondaryValue,
  secondaryPrefix = "",
  secondarySuffix = "",
  progress,
  fallbackFootnote,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  status: "qualified" | "pending" | "apex";
  primaryLabel: string;
  primaryValue?: number;
  primaryText?: string;
  primaryPrefix?: string;
  primarySuffix?: string;
  secondaryLabel: string;
  secondaryValue?: number;
  secondaryPrefix?: string;
  secondarySuffix?: string;
  progress?: TrackProgressData | null;
  fallbackFootnote: React.ReactNode;
}) {
  const top = status === "apex";
  const qualified = status === "qualified" || top;

  return (
    <SpotlightCard className="liquid-glass gold-aura relative overflow-hidden rounded-2xl p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--gold) 14%, transparent), transparent 55%), radial-gradient(120% 80% at 100% 100%, color-mix(in oklab, var(--gold) 8%, transparent), transparent 60%)",
        }}
      />
      <div className="relative mb-3 flex items-center gap-2 text-gold">
        {icon}
        <span className="text-[11px] uppercase tracking-[0.2em]">{eyebrow}</span>
        <span className="ml-auto text-[9px] uppercase tracking-[0.22em] text-gold/60">
          Your Tracking
        </span>
      </div>

      <div className="relative flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-light tracking-tight text-gold">{title}</h3>
        <StatusChip qualified={qualified} top={top} />
      </div>

      <div className="relative mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold/70">{primaryLabel}</div>
          {primaryText !== undefined ? (
            <div className="mt-0.5 text-xl font-light tabular-nums tracking-[-0.04em] text-gold sm:text-2xl">
              {primaryText}
            </div>
          ) : (
            <MetricValue
              value={primaryValue ?? 0}
              prefix={primaryPrefix}
              suffix={primarySuffix}
              decimals={0}
              size="md"
              className="mt-0.5"
            />
          )}
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold/70">{secondaryLabel}</div>
          <div className="mt-0.5">
            <MetricValue
              value={secondaryValue ?? 0}
              prefix={secondaryPrefix}
              suffix={secondarySuffix}
              decimals={0}
              size="sm"
              static
            />
          </div>
        </div>
      </div>

      {progress ? (
        <div className="relative mt-5">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-gold/80">
            <span>{progress.topLeft}</span>
            <span className="tabular-nums text-gold">{Math.round(progress.pct)}%</span>
          </div>
          <div className="relative h-1.5 rounded-full bg-gold/10">
            <div
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold/70 to-gold ${progress.pct > 0 ? "gold-glow-bar" : ""}`}
              style={{ width: `${progress.pct}%` }}
            />
            {progress.pct > 0 && progress.pct < 100 && (
              <span
                aria-hidden
                className="gold-glow-md absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-gold"
                style={{ left: `calc(${progress.pct}% - 5px)` }}
              />
            )}
          </div>
          <div className="mt-2 text-[11px] text-gold/70">{progress.bottom}</div>
        </div>
      ) : (
        <div className="relative mt-4 border-t border-gold/10 pt-3 text-[11px] text-gold/70">
          {fallbackFootnote}
        </div>
      )}
    </SpotlightCard>
  );
}
