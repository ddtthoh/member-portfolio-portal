import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Wallet, LineChart, ArrowLeftRight, FileText,
  BookOpen, Users, MessageCircleQuestion, LifeBuoy, LogOut, Menu, X, ArrowDownToLine, ArrowUpFromLine, Layers,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { TickerTape } from "@/components/ticker-tape";
import { ThreeBackground } from "@/components/three-background";

const nav = [
  { to: "/portal", label: "Overview", icon: LayoutDashboard },
  { to: "/portal/staking-plans", label: "Staking Plan", icon: Layers },
  { to: "/portal/holdings", label: "Portfolio", icon: Wallet },
  { to: "/portal/performance", label: "Performance", icon: LineChart },
  { to: "/portal/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/portal/documents", label: "Documents", icon: FileText },
  { to: "/portal/reports", label: "Reports", icon: BookOpen },
  { to: "/portal/network", label: "Network", icon: Users },
  { to: "/portal/qna", label: "Q&A", icon: MessageCircleQuestion },
  { to: "/portal/support", label: "Support", icon: LifeBuoy },
] as const;

export function PortalShell() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading your portal…</div>
      </div>
    );
  }

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
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/portal" }}
              activeProps={{ className: "bg-accent text-foreground border-l-2 border-gold" }}
              className="flex items-center gap-3 rounded-sm border-l-2 border-transparent px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-3">
          <button
            onClick={async () => { await signOut(); navigate({ to: "/login" }); }}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
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
            <div className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:block">
              Member Portal
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
            <ThemeToggle />
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
