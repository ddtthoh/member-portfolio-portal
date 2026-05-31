import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone, Users, Lock, GraduationCap, ArrowRight, ShieldCheck, CalendarRange, TrendingUp, UserPlus, RotateCcw } from "lucide-react";
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

function NetworkPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [items, setItems] = useState<Contact[]>([]);
  const [passed, setPassed] = useState<boolean | null>(null);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");

  useEffect(() => {
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
    if (!user || !passed) return;
    supabase.from("network_contacts").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setItems((data ?? []) as Contact[]));
  }, [user, passed]);

  const availableYears = useMemo(() => {
    const set = new Set<number>();
    items.forEach((c) => c.created_at && set.add(new Date(c.created_at).getFullYear()));
    return Array.from(set).sort((a, b) => b - a);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((c) => {
      if (!c.created_at) return yearFilter === "all" && monthFilter === "all";
      const d = new Date(c.created_at);
      if (yearFilter !== "all" && d.getFullYear() !== Number(yearFilter)) return false;
      if (monthFilter !== "all" && d.getMonth() !== Number(monthFilter)) return false;
      return true;
    });
  }, [items, yearFilter, monthFilter]);

  const filterActive = yearFilter !== "all" || monthFilter !== "all";
  const periodLabel = filterActive
    ? `${monthFilter !== "all" ? MONTHS[Number(monthFilter)] : "All months"}${yearFilter !== "all" ? ` · ${yearFilter}` : ""}`
    : "All time";


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
          <SpotlightCard className="liquid-glass mt-4 overflow-hidden rounded-2xl">
            <NetworkConstellation
              nodes={items.map((c) => ({ id: c.id, label: c.name, sub: c.role ?? undefined }))}
            />
          </SpotlightCard>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <SpotlightCard key={c.id} className="liquid-glass rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-serif text-lg text-gold">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{c.name}</div>
                  {c.role && <div className="text-xs text-muted-foreground">{c.role}{c.firm ? ` · ${c.firm}` : ""}</div>}
                </div>
              </div>
              <div className="mt-4 space-y-1.5 text-sm">
                {c.email && (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Mail className="h-3.5 w-3.5" /> {c.email}
                  </a>
                )}
                {c.phone && (
                  <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Phone className="h-3.5 w-3.5" /> {c.phone}
                  </a>
                )}
              </div>
            </SpotlightCard>
          ))}
          </div>
        </>
      )}
    </div>
  );
}
