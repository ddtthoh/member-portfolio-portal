import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Wallet, Users, FileBarChart, Menu } from "lucide-react";

type Tab = { to: string; label: string; icon: typeof LayoutDashboard; match?: (p: string) => boolean };

const TABS: Tab[] = [
  { to: "/portal", label: "Home", icon: LayoutDashboard, match: (p) => p === "/portal" },
  { to: "/portal/holdings", label: "Wallet", icon: Wallet, match: (p) => p.startsWith("/portal/holdings") || p.startsWith("/portal/staking") || p.startsWith("/portal/asset") },
  { to: "/portal/network", label: "Network", icon: Users, match: (p) => p.startsWith("/portal/network") || p.startsWith("/portal/referral") },
  { to: "/portal/reports", label: "Reports", icon: FileBarChart, match: (p) => p.startsWith("/portal/reports") || p.startsWith("/portal/statement") },
];

export function BottomTabBar({ onMore }: { onMore: () => void }) {
  const location = useLocation();
  const activeIdx = TABS.findIndex((t) => (t.match ? t.match(location.pathname) : location.pathname === t.to));

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-background/85 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="relative grid grid-cols-5 items-stretch px-1">
        {TABS.map((t, i) => {
          const Icon = t.icon;
          const active = i === activeIdx;
          return (
            <li key={t.to} className="relative">
              <Link
                to={t.to}
                className="relative flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors active:scale-[0.96]"
              >
                {active && (
                  <span className="absolute inset-x-3 top-1.5 -z-10 h-9 rounded-full bg-gradient-to-b from-gold/20 to-gold/5 ring-1 ring-gold/40" />
                )}
                <Icon className={`h-[18px] w-[18px] ${active ? "text-gold drop-shadow-[0_0_6px_color-mix(in_oklab,var(--gold)_60%,transparent)]" : ""}`} />
                <span className={active ? "text-gold" : ""}>{t.label}</span>
              </Link>
            </li>
          );
        })}
        <li className="relative">
          <button
            type="button"
            onClick={onMore}
            className="flex h-14 w-full flex-col items-center justify-center gap-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground active:scale-[0.96]"
            aria-label="More"
          >
            <Menu className="h-[18px] w-[18px]" />
            <span>More</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
