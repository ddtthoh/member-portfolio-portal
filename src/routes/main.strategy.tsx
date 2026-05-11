import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Target, Layers, Globe2, Cpu, ShieldCheck, Rocket, LineChart, Network } from "lucide-react";
import { MReveal } from "@/components/marketing/m-reveal";
import { MagneticButton } from "@/components/magnetic-button";

export const Route = createFileRoute("/main/strategy")({
  head: () => ({
    meta: [
      { title: "Strategy — NASLAB" },
      { name: "description", content: "Naslab's long-term strategy: from automated trading systems to a scalable, global digital finance infrastructure built on predictive execution and tokenized incentives." },
      { property: "og:title", content: "Strategy — NASLAB" },
      { property: "og:description", content: "From automated trading systems to a scalable, global digital finance infrastructure." },
    ],
  }),
  component: StrategyPage,
});

const PILLARS = [
  { Icon: Cpu, t: "Predictive Infrastructure", d: "Mempool intelligence, deterministic ordering and ultra-low-latency execution as a defensible technical edge." },
  { Icon: Network, t: "Cross-Market Liquidity", d: "Unified DEX↔DEX, CEX↔CEX, and DEX↔CEX execution paths that translate fragmented liquidity into systematic returns." },
  { Icon: ShieldCheck, t: "Institutional-Grade Security", d: "Hardened operations, audited custody, and risk controls engineered for capital that cannot afford downtime." },
  { Icon: Globe2, t: "Tokenized Ecosystem", d: "NCT as the settlement, access and incentive layer — aligning long-term value across every product surface." },
];

const TIMELINE = [
  { phase: "Phase I", year: "2024", title: "Foundation", body: "Ncore 2.0 core architecture, Crypto Reserve Platform, and the senior technical teams that anchor every product." },
  { phase: "Phase II", year: "2025", title: "Stabilization", body: "Ncore 2.0 production hardening, Ncore X concept design, arbitrage strategy paths and security expansion.", active: true },
  { phase: "Phase III", year: "2025 Q1–Q4", title: "Live Trading Expansion", body: "Trading scale grows from $200K to $1M, security envelopes deepen, Ncore X enters closed testing.", active: true },
  { phase: "Phase IV", year: "2026 Q1–Q4", title: "Scale & Market Readiness", body: "International expansion, $5M → $50M trading scale, 100,000 user target, and full Ncore X release." },
  { phase: "Phase V", year: "Beyond 2026", title: "Global Infrastructure", body: "Ncore as a foundational layer for digital finance — extending into structured products, custody and institutional rails." },
];

function StrategyPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
          <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-10 lg:pt-28">
          <MReveal>
            <span className="m-eyebrow">Strategic Direction</span>
          </MReveal>
          <MReveal delay={120}>
            <h1 className="mt-6 max-w-5xl font-serif text-5xl leading-[1.05] md:text-7xl">
              Engineering the <span className="m-gold-text">long compounding</span> of digital finance.
            </h1>
          </MReveal>
          <MReveal delay={240}>
            <p className="mt-7 max-w-2xl text-lg text-foreground/75">
              Naslab's strategy is not a quarterly story. It is a multi-decade plan to
              evolve from automated trading systems into a scalable, global digital
              finance infrastructure — engineered to compound technical advantage,
              capital efficiency, and ecosystem value.
            </p>
          </MReveal>
        </div>
      </section>

      {/* PILLARS */}
      <Section>
        <MReveal>
          <div className="text-center">
            <span className="m-eyebrow">Four Pillars</span>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl md:text-5xl">
              Where <span className="m-gold-text">technology</span> meets <span className="m-cyan-glow">capital</span>.
            </h2>
          </div>
        </MReveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {PILLARS.map(({ Icon, t, d }, i) => (
            <MReveal key={t} delay={i * 100}>
              <div className="m-glass m-tilt h-full p-8">
                <div className="flex items-start gap-5">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gradient-to-br from-gold/20 to-transparent">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl">{t}</h3>
                    <p className="mt-3 text-sm text-foreground/70">{d}</p>
                  </div>
                </div>
              </div>
            </MReveal>
          ))}
        </div>
      </Section>

      {/* TIMELINE */}
      <Section>
        <MReveal>
          <div className="text-center">
            <span className="m-eyebrow">The Long Plan</span>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl md:text-5xl">
              A <span className="m-gold-text">multi-phase</span> journey, executed in sequence.
            </h2>
          </div>
        </MReveal>
        <div className="relative mt-16">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent md:left-1/2" />
          <div className="space-y-10">
            {TIMELINE.map((row, i) => (
              <MReveal key={row.phase} delay={i * 80}>
                <div className={`relative flex gap-6 md:grid md:grid-cols-2 md:gap-12 ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}>
                  <div className={`hidden md:block ${i % 2 === 0 ? "text-right" : ""}`}>
                    <div className="font-mono text-xs uppercase tracking-[0.3em] text-gold/70">{row.phase}</div>
                    <div className="mt-1 font-serif text-3xl text-gold">{row.year}</div>
                  </div>
                  <div className="absolute left-4 top-2 -translate-x-1/2 md:left-1/2">
                    <div className={`grid h-4 w-4 place-items-center rounded-full border-2 ${row.active ? "border-gold bg-gold shadow-[0_0_18px_color-mix(in_oklab,var(--gold)_70%,transparent)]" : "border-gold/60 bg-[color:var(--m-bg)]"}`}>
                      {row.active && <span className="h-1.5 w-1.5 rounded-full bg-gold-foreground" />}
                    </div>
                  </div>
                  <div className="ml-12 md:ml-0">
                    <div className="md:hidden mb-2">
                      <div className="font-mono text-xs uppercase tracking-[0.3em] text-gold/70">{row.phase} · {row.year}</div>
                    </div>
                    <div className="m-glass m-tilt p-6">
                      <h3 className="font-serif text-2xl">{row.title}</h3>
                      <p className="mt-2 text-sm text-foreground/70">{row.body}</p>
                    </div>
                  </div>
                </div>
              </MReveal>
            ))}
          </div>
        </div>
      </Section>

      {/* METRICS */}
      <Section>
        <div className="m-luxe-border">
          <div className="grid gap-8 p-10 md:grid-cols-4 md:p-14">
            {[
              { Icon: Target, k: "Trading Scale Target", v: "$50M" },
              { Icon: Rocket, k: "User Target", v: "100K+" },
              { Icon: LineChart, k: "Markets Covered", v: "DEX + CEX" },
              { Icon: Layers, k: "Product Surfaces", v: "Ncore × NCT" },
            ].map(({ Icon, k, v }, i) => (
              <MReveal key={k} delay={i * 80}>
                <div className="text-center">
                  <Icon className="mx-auto h-7 w-7 text-gold" />
                  <div className="mt-4 font-serif text-3xl m-gold-text md:text-4xl">{v}</div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-foreground/60">{k}</div>
                </div>
              </MReveal>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <MReveal>
          <div className="text-center">
            <h2 className="mx-auto max-w-3xl font-serif text-4xl md:text-5xl">
              See the <span className="m-gold-text">execution roadmap</span>.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/main/roadmap">
                <MagneticButton className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold to-gold/90 px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold-foreground">
                  View Roadmap <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </Link>
              <Link to="/main/ncore" className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-foreground/85 hover:border-gold/60 hover:text-gold transition-all">
                Explore Ncore <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </MReveal>
      </Section>
    </>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">{children}</section>;
}
