import type { ReactNode } from "react";
import { MReveal } from "@/components/marketing/m-reveal";

export function NcoreHero({
  eyebrow,
  title,
  highlight,
  description,
  variant = "gold",
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  variant?: "gold" | "cyan";
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className={`absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-3xl ${variant === "cyan" ? "bg-cyan-500/15" : "bg-gold/15"}`} />
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-10 lg:pt-20">
        <MReveal><span className="m-eyebrow">{eyebrow}</span></MReveal>
        <MReveal delay={120}>
          <h1 className="mt-6 max-w-5xl font-serif text-4xl leading-[1.05] md:text-6xl">
            {title} {highlight && <span className={variant === "cyan" ? "m-cyan-glow" : "m-gold-text"}>{highlight}</span>}
          </h1>
        </MReveal>
        <MReveal delay={240}>
          <p className="mt-6 max-w-2xl text-lg text-foreground/75">{description}</p>
        </MReveal>
      </div>
    </section>
  );
}

export function NcoreSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-7xl px-6 py-16 lg:px-10 ${className}`}>{children}</section>;
}

export function FeatureGrid({ items }: { items: { Icon: React.ComponentType<{ className?: string }>; t: string; d: string }[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map(({ Icon, t, d }, i) => (
        <MReveal key={t} delay={i * 70}>
          <div className="m-glass m-tilt h-full p-6">
            <Icon className="h-6 w-6 text-gold" />
            <div className="mt-4 font-serif text-xl">{t}</div>
            <p className="mt-2 text-sm text-foreground/70">{d}</p>
          </div>
        </MReveal>
      ))}
    </div>
  );
}

export function StepList({ steps }: { steps: { n: string; t: string; d: string }[] }) {
  return (
    <ol className="relative space-y-6">
      <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-gold/50 via-gold/20 to-transparent" />
      {steps.map((s, i) => (
        <MReveal key={s.n} delay={i * 80}>
          <li className="relative pl-16">
            <div className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border border-gold/50 bg-[color:var(--m-bg)] font-serif text-sm font-bold text-gold">
              {s.n}
            </div>
            <div className="m-glass p-5">
              <div className="font-serif text-xl">{s.t}</div>
              <p className="mt-2 text-sm text-foreground/70">{s.d}</p>
            </div>
          </li>
        </MReveal>
      ))}
    </ol>
  );
}

export function SectionHeader({ eyebrow, title, highlight }: { eyebrow: string; title: string; highlight?: string }) {
  return (
    <MReveal>
      <div className="text-center">
        <span className="m-eyebrow">{eyebrow}</span>
        <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl md:text-5xl">
          {title} {highlight && <span className="m-gold-text">{highlight}</span>}
        </h2>
      </div>
    </MReveal>
  );
}
