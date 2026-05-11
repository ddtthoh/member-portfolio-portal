import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MagneticButton } from "@/components/magnetic-button";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", to: "/main" as const },
  { label: "About", to: "/main/about" as const },
  { label: "Strategy", to: "/main/strategy" as const },
  { label: "Roadmap", to: "/main/roadmap" as const },
];

const PRODUCTS = [
  { label: "Ncore 2.0 — Basic", to: "/main/ncore/basic" as const },
  { label: "Ncore 2.0 — Trading Logic", to: "/main/ncore/trading" as const },
  { label: "Ncore 2.0 — Features", to: "/main/ncore/features" as const },
  { label: "Ncore 2.0 — Market Trends", to: "/main/ncore/trends" as const },
  { label: "Ncore X", to: "/main/ncore/x" as const },
  { label: "NCT Token", to: "/main/ncore/token" as const },
];

const SECONDARY = [
  { label: "Careers", to: "/main/careers" as const },
  { label: "Collaboration", to: "/main/collaboration" as const },
  { label: "Contact", to: "/main/contact" as const },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 m-nav transition-all",
        scrolled ? "py-2.5" : "py-4",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link to="/main" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-gold/40 bg-gradient-to-br from-gold/30 to-transparent">
            <span className="font-serif text-lg font-bold text-gold">N</span>
            <span className="absolute inset-0 rounded-lg shadow-[inset_0_0_12px_color-mix(in_oklab,var(--gold)_30%,transparent)]" />
          </span>
          <span className="font-serif text-lg font-semibold tracking-wide">
            NAS<span className="text-gold">LAB</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:text-gold"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: true }}
            >
              {item.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:text-gold"
            >
              Products <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {productsOpen && (
              <div className="absolute left-0 top-full pt-2">
                <div className="m-glass w-64 rounded-xl p-2">
                  {PRODUCTS.map((p) => (
                    <Link
                      key={p.to}
                      to={p.to}
                      className="block rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-gold/10 hover:text-gold"
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {SECONDARY.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:text-gold"
              activeProps={{ className: "text-gold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login" className="hidden sm:block">
            <MagneticButton className="rounded-full border border-gold/60 bg-gradient-to-r from-gold/90 to-gold px-5 py-2 text-sm font-semibold text-gold-foreground shadow-[0_8px_30px_-10px_color-mix(in_oklab,var(--gold)_70%,transparent)] hover:from-gold hover:to-gold/90">
              Member Login
            </MagneticButton>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-md border border-gold/40 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden">
          <div className="mx-4 mt-3 m-glass rounded-2xl p-3">
            {[...NAV, ...PRODUCTS, ...SECONDARY].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm text-foreground/85 hover:bg-gold/10 hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-md bg-gold px-3 py-2.5 text-center text-sm font-semibold text-gold-foreground"
            >
              Member Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
