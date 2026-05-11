import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/main/ncore")({
  head: () => ({
    meta: [
      { title: "Ncore — NASLAB" },
      { name: "description", content: "The Ncore product family — predictive MEV trading on DEX, intelligent cross-platform arbitrage, and the NCT token ecosystem." },
      { property: "og:title", content: "Ncore — NASLAB" },
      { property: "og:description", content: "Predictive MEV trading, cross-platform arbitrage, and the NCT token ecosystem." },
    ],
  }),
  component: NcoreLayout,
});

const SUBNAV = [
  { label: "Overview", to: "/main/ncore" as const, exact: true },
  { label: "Basic", to: "/main/ncore/basic" as const },
  { label: "Trading", to: "/main/ncore/trading" as const },
  { label: "Features", to: "/main/ncore/features" as const },
  { label: "Trends", to: "/main/ncore/trends" as const },
  { label: "Ncore X", to: "/main/ncore/x" as const },
  { label: "NCT Token", to: "/main/ncore/token" as const },
];

function NcoreLayout() {
  const loc = useLocation();
  return (
    <div>
      <div className="sticky top-16 z-30 border-y border-gold/15 bg-[color:var(--m-bg)]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <nav className="flex gap-1 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SUBNAV.map((item) => {
              const active = item.exact ? loc.pathname === item.to : loc.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all",
                    active
                      ? "bg-gold text-gold-foreground shadow-[0_0_24px_-6px_color-mix(in_oklab,var(--gold)_60%,transparent)]"
                      : "border border-gold/25 text-foreground/70 hover:border-gold/55 hover:text-gold",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
