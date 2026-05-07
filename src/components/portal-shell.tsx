import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Wallet, FileBarChart, ArrowLeftRight, FileText,
  BookOpen, Users, MessageCircleQuestion, LifeBuoy, LogOut, Menu, X, ArrowDownToLine, ArrowUpFromLine, Layers,
  ChevronDown, Repeat, DollarSign, Gift, ArrowRightLeft, Send, Languages, UserCircle2, KeyRound, ShieldCheck, QrCode,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
type NavItem =
  | { to: string; labelKey: string; icon: typeof LayoutDashboard; children?: undefined }
  | { labelKey: string; icon: typeof LayoutDashboard; basePath: string; children: NavChild[] };

const nav: NavItem[] = [
  { to: "/portal", labelKey: "nav.overview", icon: LayoutDashboard },
  { to: "/portal/staking-plans", labelKey: "nav.stakingPlan", icon: Layers },
  { to: "/portal/holdings", labelKey: "nav.portfolio", icon: Wallet },
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
  {
    labelKey: "nav.usdCreditsTransfer",
    icon: ArrowRightLeft,
    basePath: "/portal/statement/",
    children: [
      { to: "/portal/statement/convert-credits", labelKey: "nav.convertCredits", icon: ArrowRightLeft },
      { to: "/portal/statement/transfer-usd", labelKey: "nav.transferUsd", icon: Send },
    ],
  },
  { to: "/portal/transactions", labelKey: "nav.transactions", icon: ArrowLeftRight },
  { to: "/portal/documents", labelKey: "nav.documents", icon: FileText },
  { to: "/portal/reports", labelKey: "nav.reports", icon: BookOpen },
  { to: "/portal/network", labelKey: "nav.network", icon: Users },
  { to: "/portal/qna", labelKey: "nav.qna", icon: MessageCircleQuestion },
  { to: "/portal/support", labelKey: "nav.support", icon: LifeBuoy },
];

export function PortalShell() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">{t("common.loadingPortal")}</div>
      </div>
    );
  }

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative flex min-h-screen bg-transparent">
      {/* Futuristic interactive backdrop */}
      <div
        aria-hidden
        className="portal-backdrop pointer-events-none fixed inset-0 -z-20"
      />
      <ThreeBackground
        className="pointer-events-none fixed inset-0 -z-10"
        fade={false}
      />
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar/80 backdrop-blur-md transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Logo />
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((item) => {
            if (item.children) {
              return (
                <NavGroup key={item.labelKey} item={item} currentPath={location.pathname} />
              );
            }
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/portal" }}
                activeProps={{ className: "bg-accent text-foreground border-l-2 border-gold" }}
                className="flex items-center gap-3 rounded-sm border-l-2 border-transparent px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-3">
          <button
            onClick={async () => { await signOut(); navigate({ to: "/login" }); }}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> {t("nav.signOut")}
          </button>
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
            <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("language.switch")}
                  className="rounded-full border border-border/60"
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
                  className="rounded-full border border-border/60"
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
  );
}

function NavGroup({
  item,
  currentPath,
}: {
  item: { labelKey: string; icon: typeof LayoutDashboard; basePath: string; children: NavChild[] };
  currentPath: string;
}) {
  const { t } = useTranslation();
  const isActiveBranch = item.children.some((c) => currentPath === c.to || currentPath.startsWith(c.to + "/"));
  const [open, setOpen] = useState(isActiveBranch);
  useEffect(() => {
    if (isActiveBranch) setOpen(true);
  }, [isActiveBranch]);

  const Icon = item.icon;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-3 rounded-sm border-l-2 px-3 py-2.5 text-sm transition-colors hover:bg-accent hover:text-foreground ${
          isActiveBranch
            ? "border-gold bg-accent text-foreground"
            : "border-transparent text-muted-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
        <span className="flex-1 text-left">{t(item.labelKey)}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-1 space-y-1 pl-4">
          {item.children.map((child) => {
            const ChildIcon = child.icon;
            return (
              <Link
                key={child.to}
                to={child.to}
                activeProps={{ className: "bg-accent text-foreground border-l-2 border-gold" }}
                className="flex items-center gap-3 rounded-sm border-l-2 border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ChildIcon className="h-3.5 w-3.5" />
                <span>{t(child.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
