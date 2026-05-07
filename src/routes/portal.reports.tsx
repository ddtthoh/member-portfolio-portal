import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Users, Gift, UsersRound, Crown, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/page-header";
import { SpotlightCard } from "@/components/spotlight-card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/reports")({
  component: ReportsPage,
});

const TABS = [
  { id: "participation", label: "Participation", icon: Users },
  { id: "referral", label: "Referral Rewards", icon: Gift },
  { id: "team", label: "Team Rewards", icon: UsersRound },
  { id: "leader", label: "Leader Rewards", icon: Crown },
  { id: "par-rank", label: "Par Rank Rewards", icon: Trophy },
] as const;

type TabId = (typeof TABS)[number]["id"];

function ReportsPage() {
  const { t } = useTranslation();
  const [active, setActive] = useState<TabId>("participation");
  const current = TABS.find((tab) => tab.id === active)!;

  return (
    <div>
      <PageHeader title={t("pages.reports.title")} description={t("pages.reports.description")} />

      {/* Subtabs */}
      <div className="mt-6 overflow-x-auto">
        <div className="inline-flex min-w-full gap-1 rounded-xl border border-border/50 bg-card/40 p-1.5 sm:min-w-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "group relative inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] transition-all",
                  isActive
                    ? "bg-gradient-to-r from-gold/20 to-amber-400/10 text-gold shadow-[0_4px_16px_-4px_rgba(212,175,55,0.4)] ring-1 ring-gold/40"
                    : "text-muted-foreground hover:text-gold"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <SpotlightCard className="liquid-glass mt-6 rounded-2xl p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-serif text-2xl text-foreground">{current.label}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your {current.label.toLowerCase()} report will appear here once available.
        </p>
      </SpotlightCard>
    </div>
  );
}
