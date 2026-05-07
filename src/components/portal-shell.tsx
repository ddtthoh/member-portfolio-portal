import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Wallet, FileBarChart, ArrowLeftRight, FileText,
  BookOpen, Users, MessageCircleQuestion, LifeBuoy, LogOut, Menu, X, ArrowDownToLine, ArrowUpFromLine, Layers,
  ChevronDown, Repeat, DollarSign, Gift, ArrowRightLeft, Send, Languages, UserCircle2, KeyRound, ShieldCheck, QrCode,
  PanelLeftClose, PanelLeft,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import participantPortalLogo from "@/assets/participant-portal-logo.png";
import { Button } from "@/components/ui/button";
import { TickerTape } from "@/components/ticker-tape";
import { ThreeBackground } from "@/components/three-background";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "@/i18n";

type NavChild = { to: string; labelKey: string; icon: typeof LayoutDashboard };
type NavLeaf = { to: string; labelKey: string; icon: typeof LayoutDashboard; children?: undefined };
type NavBranch = { labelKey: string; icon: typeof LayoutDashboard; basePath: string; children: NavChild[] };
type NavItem = NavLeaf | NavBranch;
type NavSection = { id: string; labelKey: string; items: NavItem[] };

const sections: NavSection[] = [
  {
    id: "overview",
    labelKey: "nav.sections.overview",
    items: [
      { to: "/portal", labelKey: "nav.overview", icon: LayoutDashboard },
      { to: "/portal/staking-plans", labelKey: "nav.stakingPlan", icon: Layers },
      { to: "/portal/holdings", labelKey: "nav.portfolio", icon: Wallet },
      { to: "/portal/asset-analysis", labelKey: "nav.assetAnalysis", icon: FileBarChart },
    ],
  },
  {
    id: "operations",
    labelKey: "nav.sections.operations",
    items: [
      {
        labelKey: "nav.usdCreditsTransfer",
        icon: ArrowRightLeft,
        basePath: "/portal/statement",
        children: [
          { to: "/portal/statement/convert-credits", labelKey: "nav.convertCredits", icon: ArrowRightLeft },
          { to: "/portal/statement/transfer-usd", labelKey: "nav.transferUsd", icon: Send },
        ],
      },
      {
        labelKey: "nav.statement",
        icon: FileBarChart,
        basePath: "/portal/statement",
        children: [
          { to: "/portal/statement/credit-conversion", labelKey: "nav.creditConversionStatement", icon: Repeat },
          { to: "/portal/statement/usd", labelKey: "nav.usdStatement", icon: DollarSign },
          { to: "/portal/statement/rewards", labelKey: "nav.rewardsStatement", icon: Gift },
        ],
      },
      { to: "/portal/reports", labelKey: "nav.reports", icon: BookOpen },
    ],
  },
  {
    id: "support",
    labelKey: "nav.sections.support",
    items: [
      { to: "/portal/qna", labelKey: "nav.qna", icon: MessageCircleQuestion },
      { to: "/portal/support", labelKey: "nav.support", icon: LifeBuoy },
      {
        labelKey: "account.label",
        icon: UserCircle2,
        basePath: "/portal/account",
        children: [
          { to: "/portal/network", labelKey: "nav.network", icon: Users },
        ],
      },
    ],
  },
];

const COLLAPSE_KEY = "portal:sidebar-collapsed";

export function PortalShell() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(COLLAPSE_KEY) === "1";
  });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    }
  }, [collapsed]);

  // Cmd/Ctrl+B toggles collapse on desktop
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">{t("common.loadingPortal")}</div>
      </div>
    );
  }

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0];
  const sidebarWidth = collapsed ? "w-[68px]" : "w-64";
  const userName = user.email?.split("@")[0] ?? "Member";

  return (
    <TooltipProvider delayDuration={120}>
      <div className="relative flex min-h-screen overflow-x-hidden bg-transparent">
        {/* Backdrop layers */}
        <div
          aria-hidden
          className="portal-backdrop pointer-events-none absolute inset-x-0 top-0 -z-20 h-full opacity-60 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.65)_40%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.3)_88%,rgba(0,0,0,0.15)_100%)]"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 block h-full opacity-70 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.6)_40%,rgba(0,0,0,0.45)_70%,rgba(0,0,0,0.22)_85%,rgba(0,0,0,0.1)_100%)]">
          <ThreeBackground className="absolute inset-0" fade={false} />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-[5] opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
          }}
        />

        {/* Mobile backdrop */}
        {open && (
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-md transition-all duration-300 ease-out lg:static lg:translate-x-0 ${sidebarWidth} ${
            open ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 relative`}
        >
          {/* Floating collapse rail handle (tablet/desktop) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setCollapsed((v) => !v)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="absolute -right-3 top-20 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-gold/60 bg-sidebar text-gold/90 shadow-[0_0_0_1px_color-mix(in_oklab,var(--gold)_30%,transparent),0_0_12px_-2px_color-mix(in_oklab,var(--gold)_45%,transparent)] transition-all hover:border-gold hover:text-gold hover:shadow-[0_0_0_1px_var(--gold),0_0_16px_-2px_color-mix(in_oklab,var(--gold)_70%,transparent)] md:flex"
              >
                {collapsed ? <PanelLeft className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
              <span className="ml-1.5 rounded border border-border/60 bg-muted/40 px-1 py-0.5 text-[9px] opacity-80">⌘B</span>
            </TooltipContent>
          </Tooltip>
          {/* Brand header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-3">
            <div className={`flex min-w-0 items-center gap-2.5 ${collapsed ? "justify-center w-full" : ""}`}>
              <div className="relative shrink-0">
                <img src={participantPortalLogo} alt={t("brand.portal")} className="h-9 w-9 rounded-full object-contain ring-1 ring-gold/40" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-sidebar shadow-[0_0_6px_color-mix(in_oklab,var(--gold)_70%,transparent)]" />
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold leading-tight text-foreground">{userName}</div>
                  <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-gold/90">
                    <ShieldCheck className="h-2.5 w-2.5" /> Verified
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-4 [scrollbar-width:thin]">
            {sections.map((section) => (
              <div key={section.id}>
                {!collapsed && (
                  <div className="mb-1.5 flex items-center gap-2 px-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
                      {t(section.labelKey, section.id.toUpperCase())}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-border/60 to-transparent" />
                  </div>
                )}
                {collapsed && <div className="mx-3 mb-2 h-px bg-border/40" />}
                <div className="space-y-0.5">
                  {section.items.map((item) =>
                    item.children ? (
                      <NavGroup
                        key={item.labelKey}
                        item={item}
                        currentPath={location.pathname}
                        collapsed={collapsed}
                      />
                    ) : (
                      <NavLink key={item.to} item={item} collapsed={collapsed} />
                    )
                  )}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer: collapse toggle + sign out */}
          <div className="shrink-0 border-t border-sidebar-border p-2">
            <div className={`flex items-center ${collapsed ? "flex-col gap-1" : "gap-1"}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={async () => { await signOut(); navigate({ to: "/login" }); }}
                    className={`group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive ${
                      collapsed ? "w-full justify-center" : "flex-1"
                    }`}
                    aria-label={t("nav.signOut")}
                  >
                    <LogOut className="h-4 w-4" />
                    {!collapsed && <span>{t("nav.signOut")}</span>}
                  </button>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">{t("nav.signOut")}</TooltipContent>}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setCollapsed((v) => !v)}
                    className="hidden lg:inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {collapsed ? "Expand" : "Collapse"} <span className="ml-1 text-[10px] opacity-60">⌘B</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col opacity-95">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/60 px-4 backdrop-blur lg:px-8">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <Link to="/portal" className="flex items-center gap-2">
                <img src={participantPortalLogo} alt={t("brand.portal")} className="h-12 w-12 object-contain" />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/portal/promotion"
                aria-label={t("nav.promotion", "Promotion")}
                className="group relative inline-flex h-9 items-center gap-1.5 rounded-full border border-gold/60 bg-background/40 px-3 text-xs font-medium tracking-wide text-foreground/85 backdrop-blur-sm shadow-[0_0_0_1px_color-mix(in_oklab,var(--gold)_30%,transparent),0_0_12px_-2px_color-mix(in_oklab,var(--gold)_45%,transparent)] transition-all hover:border-gold hover:text-gold hover:shadow-[0_0_0_1px_var(--gold),0_0_16px_-2px_color-mix(in_oklab,var(--gold)_70%,transparent)]"
              >
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <Gift
                    className="h-4 w-4 text-gold/90 transition-transform duration-500 ease-out group-hover:rotate-[-10deg]"
                    style={{ animation: "promo-tilt 3.2s ease-in-out infinite", transformOrigin: "50% 60%" }}
                  />
                  <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                  </span>
                </span>
                <span className="hidden sm:inline">{t("nav.promotion", "Promo")}</span>
              </Link>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("language.switch")}
                    className="rounded-full border border-gold/60 shadow-[0_0_0_1px_color-mix(in_oklab,var(--gold)_30%,transparent),0_0_12px_-2px_color-mix(in_oklab,var(--gold)_45%,transparent)] hover:border-gold hover:shadow-[0_0_0_1px_var(--gold),0_0_16px_-2px_color-mix(in_oklab,var(--gold)_70%,transparent)] transition-all"
                  >
                    <span className="text-base leading-none">{currentLang.flag}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <DropdownMenuItem key={l.code} onSelect={() => i18n.changeLanguage(l.code)}>
                      <span className="mr-2">{l.flag}</span>{l.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("account.label")}
                    className="rounded-full border border-gold/60 shadow-[0_0_0_1px_color-mix(in_oklab,var(--gold)_30%,transparent),0_0_12px_-2px_color-mix(in_oklab,var(--gold)_45%,transparent)] hover:border-gold hover:shadow-[0_0_0_1px_var(--gold),0_0_16px_-2px_color-mix(in_oklab,var(--gold)_70%,transparent)] transition-all"
                  >
                    <UserCircle2 className="h-5 w-5 text-gold" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onSelect={() => navigate({ to: "/portal/profile" as any })}>
                    <UserCircle2 className="h-4 w-4" /> {t("account.profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate({ to: "/portal/change-password" as any })}>
                    <KeyRound className="h-4 w-4" /> {t("account.changePassword")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate({ to: "/portal/kyc" as any })}>
                    <ShieldCheck className="h-4 w-4" /> {t("account.myKyc")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate({ to: "/portal/qr-code" as any })}>
                    <QrCode className="h-4 w-4" /> {t("account.myQrCode")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate({ to: "/portal/network" })}>
                    <Users className="h-4 w-4" /> {t("account.network")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={async () => { await signOut(); navigate({ to: "/login" }); }}>
                    <LogOut className="h-4 w-4" /> {t("account.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <TickerTape />
          <main className="min-w-0 flex-1 px-4 pb-8 pt-3 lg:px-10 opacity-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

function NavLink({ item, collapsed }: { item: NavLeaf; collapsed: boolean }) {
  const { t } = useTranslation();
  const Icon = item.icon;
  const link = (
    <Link
      to={item.to}
      activeOptions={{ exact: item.to === "/portal" }}
      activeProps={{
        className:
          "bg-gradient-to-r from-gold/12 via-gold/5 to-transparent text-foreground before:opacity-100 [&_svg]:text-gold [&_svg]:drop-shadow-[0_0_6px_color-mix(in_oklab,var(--gold)_55%,transparent)]",
      }}
      className={`group relative flex items-center rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent/60 hover:text-foreground before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-gold before:opacity-0 before:shadow-[0_0_8px_color-mix(in_oklab,var(--gold)_70%,transparent)] before:transition-opacity ${
        collapsed ? "justify-center" : "gap-3"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      {!collapsed && <span className="truncate">{t(item.labelKey)}</span>}
    </Link>
  );
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{t(item.labelKey)}</TooltipContent>
      </Tooltip>
    );
  }
  return link;
}

function NavGroup({
  item,
  currentPath,
  collapsed,
}: {
  item: NavBranch;
  currentPath: string;
  collapsed: boolean;
}) {
  const { t } = useTranslation();
  const isActiveBranch = item.children.some((c) => currentPath === c.to || currentPath.startsWith(c.to + "/"));
  const [open, setOpen] = useState(isActiveBranch);
  useEffect(() => {
    if (isActiveBranch) setOpen(true);
  }, [isActiveBranch]);

  const Icon = item.icon;

  // Collapsed state: render as single icon button, on hover show tooltip with first child label
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={item.children[0].to}
            className={`group relative flex items-center justify-center rounded-md px-3 py-2.5 transition-all duration-200 hover:bg-accent/60 hover:text-foreground before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-gold before:transition-opacity before:shadow-[0_0_8px_color-mix(in_oklab,var(--gold)_70%,transparent)] ${
              isActiveBranch
                ? "bg-gradient-to-r from-gold/12 via-gold/5 to-transparent text-foreground before:opacity-100"
                : "text-muted-foreground before:opacity-0"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActiveBranch ? "text-gold drop-shadow-[0_0_6px_color-mix(in_oklab,var(--gold)_55%,transparent)]" : ""}`} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{t(item.labelKey)}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`group relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200 hover:bg-accent/60 hover:text-foreground before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-gold before:transition-opacity before:shadow-[0_0_8px_color-mix(in_oklab,var(--gold)_70%,transparent)] ${
          isActiveBranch
            ? "bg-gradient-to-r from-gold/12 via-gold/5 to-transparent text-foreground before:opacity-100"
            : "text-muted-foreground before:opacity-0"
        }`}
      >
        <Icon className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${isActiveBranch ? "text-gold drop-shadow-[0_0_6px_color-mix(in_oklab,var(--gold)_55%,transparent)]" : ""}`} />
        <span className="flex-1 text-left truncate">{t(item.labelKey)}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            role="group"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-1 space-y-0.5 border-l border-border/40 pl-2">
              {item.children.map((child) => {
                const ChildIcon = child.icon;
                return (
                  <Link
                    key={child.to}
                    to={child.to}
                    activeProps={{
                      className: "text-foreground bg-accent/40 [&_svg]:text-gold",
                    }}
                    className="group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                  >
                    <ChildIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    <span className="truncate">{t(child.labelKey)}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
