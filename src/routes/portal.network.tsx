import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone, Users, Lock, GraduationCap, ArrowRight, ShieldCheck, TrendingUp, UserPlus, RotateCcw } from "lucide-react";
import { CountUp } from "@/components/count-up";

import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { Button } from "@/components/ui/button";
import { NetworkConstellation } from "@/components/network-constellation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/portal/network")({
  component: NetworkPage,
});

type Contact = {
  id: string;
  name: string;
  role: string | null;
  firm: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// TEMP preview: force unlocked state so the post-quiz design is visible
// without an actual quiz pass. Set to false to restore real gating.
const PREVIEW_FORCE_PASSED = true;

const DEMO_CONTACTS: Contact[] = [
  { id: "d1", name: "Sophia Laurent", role: "Director", firm: "Laurent Capital", email: "sophia@laurent.co", phone: "+1 415 555 0142", created_at: new Date(new Date().setMonth(new Date().getMonth() - 0, 4)).toISOString() },
  { id: "d2", name: "Marcus Hale", role: "Senior Partner", firm: "Hale & Co", email: "marcus@haleco.io", phone: "+44 20 7946 0123", created_at: new Date(new Date().setMonth(new Date().getMonth() - 0, 12)).toISOString() },
  { id: "d3", name: "Aiko Tanaka", role: "Strategist", firm: "Tanaka Group", email: "aiko@tanaka.jp", phone: "+81 3 5555 0199", created_at: new Date(new Date().setMonth(new Date().getMonth() - 1, 8)).toISOString() },
  { id: "d4", name: "Lucas Romero", role: "Advisor", firm: "Romero Wealth", email: "lucas@romero.es", phone: "+34 91 555 0177", created_at: new Date(new Date().setMonth(new Date().getMonth() - 1, 22)).toISOString() },
  { id: "d5", name: "Priya Anand", role: "Associate", firm: "Anand Holdings", email: "priya@anand.in", phone: "+91 22 5555 0188", created_at: new Date(new Date().setMonth(new Date().getMonth() - 2, 3)).toISOString() },
  { id: "d6", name: "Henry Whitfield", role: "Partner", firm: "Whitfield Group", email: "henry@whitfield.co", phone: "+1 212 555 0166", created_at: new Date(new Date().setMonth(new Date().getMonth() - 3, 17)).toISOString() },
  { id: "d7", name: "Chloé Martin", role: "Analyst", firm: "Martin & Sons", email: "chloe@martin.fr", phone: "+33 1 5555 0144", created_at: new Date(new Date().setMonth(new Date().getMonth() - 5, 9)).toISOString() },
  { id: "d8", name: "Daniel Okafor", role: "Director", firm: "Okafor Trust", email: "daniel@okafor.ng", phone: "+234 1 555 0122", created_at: new Date(new Date().setMonth(new Date().getMonth() - 8, 27)).toISOString() },
  { id: "d9", name: "Isabella Conti", role: "Consultant", firm: "Conti Advisory", email: "isa@conti.it", phone: "+39 02 5555 0111", created_at: new Date(new Date().setFullYear(new Date().getFullYear() - 1, 10, 14)).toISOString() },
];

function NetworkPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [items, setItems] = useState<Contact[]>([]);
  const [passed, setPassed] = useState<boolean | null>(null);
  const now = new Date();
  const [fromMonth, setFromMonth] = useState<string>("all"); // "all" | "0".."11"
  const [fromYear, setFromYear] = useState<string>("all");   // "all" | year
  const [toMonth, setToMonth] = useState<string>("all");
  const [toYear, setToYear] = useState<string>("all");


  useEffect(() => {
    if (PREVIEW_FORCE_PASSED) { setPassed(true); return; }
    if (!user) return;
    supabase
      .from("quiz_passes")
      .select("id")
      .eq("user_id", user.id)
      .eq("category", "marketing")
      .maybeSingle()
      .then(({ data }) => setPassed(!!data));
  }, [user]);

  useEffect(() => {
    if (!passed) return;
    if (!user) { setItems(DEMO_CONTACTS); return; }
    supabase.from("network_contacts").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => {
        const rows = (data ?? []) as Contact[];
        setItems(rows.length > 0 ? rows : DEMO_CONTACTS);
      });
  }, [user, passed]);


  const availableYears = useMemo(() => {
    const set = new Set<number>();
    items.forEach((c) => c.created_at && set.add(new Date(c.created_at).getFullYear()));
    set.add(now.getFullYear());
    return Array.from(set).sort((a, b) => b - a);
  }, [items, now]);

  // Resolve range to concrete [startDate, endDate]. "all" means open-ended.
  const { startDate, endDate, filterActive } = useMemo(() => {
    const hasFrom = fromYear !== "all" || fromMonth !== "all";
    const hasTo = toYear !== "all" || toMonth !== "all";
    let start: Date | null = null;
    let end: Date | null = null;
    if (hasFrom) {
      const y = fromYear !== "all" ? Number(fromYear) : Math.min(...availableYears);
      const m = fromMonth !== "all" ? Number(fromMonth) : 0;
      start = new Date(y, m, 1, 0, 0, 0, 0);
    }
    if (hasTo) {
      const y = toYear !== "all" ? Number(toYear) : now.getFullYear();
      const m = toMonth !== "all" ? Number(toMonth) : 11;
      end = new Date(y, m + 1, 0, 23, 59, 59, 999); // last day of month
    }
    return { startDate: start, endDate: end, filterActive: hasFrom || hasTo };
  }, [fromMonth, fromYear, toMonth, toYear, availableYears, now]);

  const filteredItems = useMemo(() => {
    return items.filter((c) => {
      if (!c.created_at) return !filterActive;
      const d = new Date(c.created_at);
      if (startDate && d < startDate) return false;
      if (endDate && d > endDate) return false;
      return true;
    });
  }, [items, startDate, endDate, filterActive]);

  const fmt = (d: Date) => `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
  const periodLabel = !filterActive
    ? "From the beginning"
    : startDate && endDate
    ? `${fmt(startDate)} → ${fmt(endDate)}`
    : startDate
    ? `Since ${fmt(startDate)}`
    : endDate
    ? `Up to ${fmt(endDate)}`
    : "From the beginning";

  const resetFilter = () => {
    setFromMonth("all"); setFromYear("all"); setToMonth("all"); setToYear("all");
  };





  return (
    <div>
      <PageHeader
        
        title={t("pages.network.title")}
        description={t("pages.network.description")}
      />

      {passed === null ? (
        <SpotlightCard className="liquid-glass rounded-2xl p-16 text-center">
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        </SpotlightCard>
      ) : !passed ? (
        <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
          <div className="relative px-6 py-10 text-center sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_-10%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_60%)]" />
            <div className="relative mx-auto max-w-xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 shadow-[0_0_24px_-6px_color-mix(in_oklab,var(--gold)_60%,transparent)]">
                <Lock className="h-7 w-7 text-gold" />
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-gold">
                <ShieldCheck className="h-3.5 w-3.5" /> {t("pages.network.verificationRequired")}
              </div>

              <h2 className="mt-4 font-serif text-2xl font-semibold text-gold">
                {t("pages.network.unlockTitle")}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                {t("pages.network.unlockDescription")}
              </p>

              <ol className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm">
                {[
                  t("pages.network.steps.takeQuiz"),
                  t("pages.network.steps.score"),
                  t("pages.network.steps.unlock"),
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-mono text-[11px] font-semibold text-gold">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-foreground/85">{step}</span>
                  </li>
                ))}
              </ol>

              <Button
                asChild
                size="lg"
                className="mt-7 bg-gradient-to-r from-gold to-amber-400 text-background hover:opacity-90"
              >
                <Link to="/portal/qna/marketing">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  {t("pages.network.actions.takeQuiz")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </SpotlightCard>
      ) : items.length === 0 ? (
        <SpotlightCard className="liquid-glass rounded-2xl p-16 text-center">
          <Users className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("pages.network.empty.noTeam")}</p>
        </SpotlightCard>
      ) : (
        <>
          {/* Filter + stats bar */}
          <SpotlightCard className="liquid-glass mb-4 rounded-2xl p-5">
            <div className="flex flex-col gap-6">
              {/* Stats row */}
              <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-gold/80">Total Members</div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-5xl font-light tabular-nums tracking-[-0.02em] text-gold">
                      <CountUp value={filteredItems.length} decimals={0} />
                    </span>
                    {filterActive && (
                      <span className="text-xs tabular-nums text-gold/60">/ {items.length}</span>
                    )}
                  </div>
                </div>
                {filterActive && (
                  <>
                    <div className="hidden h-12 w-px bg-gold/20 sm:block" />
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-gold/80">New Joins</div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-5xl font-light tabular-nums tracking-[-0.02em] text-gold">
                          +<CountUp value={filteredItems.length} decimals={0} />
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-success">
                          <TrendingUp className="h-3 w-3" /> in period
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* From / To range */}
              <div className="flex flex-wrap items-center gap-2 border-t border-gold/15 pt-5">
                <span className="text-[10px] uppercase tracking-[0.22em] text-gold/80">From</span>
                <Select value={fromMonth} onValueChange={setFromMonth}>
                  <SelectTrigger className="w-[120px] border-gold/30 bg-background/50 text-gold">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any month</SelectItem>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={`fm-${m}`} value={String(i)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={fromYear} onValueChange={setFromYear}>
                  <SelectTrigger className="w-[110px] border-gold/30 bg-background/50 text-gold">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any year</SelectItem>
                    {availableYears.map((y) => (
                      <SelectItem key={`fy-${y}`} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="ml-2 text-[10px] uppercase tracking-[0.22em] text-gold/80">To</span>
                <Select value={toMonth} onValueChange={setToMonth}>
                  <SelectTrigger className="w-[120px] border-gold/30 bg-background/50 text-gold">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any month</SelectItem>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={`tm-${m}`} value={String(i)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={toYear} onValueChange={setToYear}>
                  <SelectTrigger className="w-[110px] border-gold/30 bg-background/50 text-gold">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any year</SelectItem>
                    {availableYears.map((y) => (
                      <SelectItem key={`ty-${y}`} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {filterActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilter}
                    className="ml-auto text-gold/70 hover:text-gold"
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    Reset
                  </Button>
                )}
              </div>
            </div>

          </SpotlightCard>

          {filteredItems.length === 0 ? (
            <SpotlightCard className="liquid-glass rounded-2xl p-16 text-center">
              <UserPlus className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No members joined in {periodLabel}.</p>
            </SpotlightCard>
          ) : (
            <>
              <SpotlightCard className="liquid-glass overflow-hidden rounded-2xl">
                <NetworkConstellation
                  nodes={filteredItems.map((c) => ({ id: c.id, label: c.name, sub: c.role ?? undefined }))}
                />
              </SpotlightCard>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((c) => (
                  <SpotlightCard key={c.id} className="liquid-glass rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-serif text-lg text-gold">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{c.name}</div>
                        {c.role && <div className="truncate text-xs text-muted-foreground">{c.role}{c.firm ? ` · ${c.firm}` : ""}</div>}
                      </div>
                    </div>
                    <div className="mt-4 space-y-1.5 text-sm">
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                          <Mail className="h-3.5 w-3.5" /> <span className="truncate">{c.email}</span>
                        </a>
                      )}
                      {c.phone && (
                        <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                          <Phone className="h-3.5 w-3.5" /> {c.phone}
                        </a>
                      )}
                    </div>
                    {c.created_at && (
                      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        <span>Joined</span>
                        <span className="text-gold/80">
                          {new Date(c.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    )}
                  </SpotlightCard>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
