import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { SocialLinks } from "@/components/social-links";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Decorative gradient */}
      <div aria-hidden className="landing-aura pointer-events-none absolute inset-0 opacity-60" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-sm border border-gold/60 bg-transparent px-5 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-gold-foreground"
          >
            Member Login <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-10 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Established Trust · Modern Capital
          </div>
          <h1 className="font-serif text-5xl leading-[1.05] md:text-7xl">
            A private portal for the <span className="italic text-gold">discerning few</span>.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            Ivory &amp; Vale members access portfolios, performance, statements, and advisor
            conversations through a single, quietly powerful interface.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-sm bg-gold px-7 py-3.5 text-sm font-medium text-gold-foreground shadow-[var(--shadow-elegant)] transition-all hover:translate-y-[-1px]"
            >
              Enter the Portal
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#capabilities" className="text-sm text-muted-foreground hover:text-foreground">
              Discover capabilities →
            </a>
          </div>
        </motion.div>

        <section id="capabilities" className="mt-32 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Bank-grade Security", body: "Encrypted access, audit trails, and member-only data isolation." },
            { icon: Sparkles, title: "Curated Reporting", body: "Quarterly letters, performance analytics, and tax statements at a glance." },
            { icon: Building2, title: "Direct Advisory", body: "Speak with your dedicated advisor and request bespoke research." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-card p-8">
              <Icon className="mb-5 h-6 w-6 text-gold" />
              <h3 className="font-serif text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="relative z-10 border-t border-border py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left lg:px-10">
          <span>© {new Date().getFullYear()} Ivory &amp; Vale Private Wealth · By invitation only</span>
          <SocialLinks variant="row" size={18} showEyebrow={false} />
        </div>
      </footer>
    </div>
  );
}
