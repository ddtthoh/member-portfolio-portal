import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Shield, Zap, Globe, Cpu, Network, Coins, BookOpen, TrendingUp, Activity, Users, Handshake } from "lucide-react";
import { lazy, Suspense } from "react";
import { ClientOnly } from "@/components/marketing/client-only";
import { MReveal } from "@/components/marketing/m-reveal";
import { MagneticButton } from "@/components/magnetic-button";
import { CountUp } from "@/components/count-up";

const Hero3D = lazy(() => import("@/components/marketing/hero-3d").then((m) => ({ default: m.Hero3D })));

export const Route = createFileRoute("/main/")({
  head: () => ({
    meta: [
      { title: "NASLAB — A New Era of Digital Wealth" },
      { name: "description", content: "Naslab is the marketing engine of Nastech Global, delivering next-generation digital finance — Ncore 2.0 MEV trading, Ncore X arbitrage, and the NCT token ecosystem." },
      { property: "og:title", content: "NASLAB — A New Era of Digital Wealth" },
      { property: "og:description", content: "Build your crypto reserve with confidence. Secure, scalable, predictive trading infrastructure for the digital economy." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ClientOnly>
            <Suspense fallback={<HeroFallback />}>
              <Hero3D />
            </Suspense>
          </ClientOnly>
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-[#06070b]/80" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col items-start justify-center px-6 lg:px-10">
          <MReveal>
            <span className="m-eyebrow">Nastech Global × Naslab</span>
          </MReveal>
          <MReveal delay={120}>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.02] md:text-7xl lg:text-[5.5rem]">
              A New Era of <br />
              <span className="m-gold-text">Digital Wealth</span>
            </h1>
          </MReveal>
          <MReveal delay={240}>
            <p className="mt-7 max-w-xl text-lg text-foreground/75">
              Build your crypto reserve with confidence — backed by predictive MEV
              trading, intelligent cross-platform arbitrage, and a tokenized ecosystem
              engineered for sustainable, long-term growth.
            </p>
          </MReveal>
          <MReveal delay={360}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/main/ncore/basic">
                <MagneticButton className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold to-gold/90 px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold-foreground shadow-[0_15px_50px_-15px_color-mix(in_oklab,var(--gold)_80%,transparent)]">
                  Explore Products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </MagneticButton>
              </Link>
              <Link
                to="/main/about"
                className="group inline-flex items-center gap-2 rounded-full border border-foreground/15 px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-foreground/85 backdrop-blur transition-all hover:border-gold/60 hover:text-gold"
              >
                Learn About Naslab <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </MReveal>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-foreground/45">
          Scroll
        </div>
      </section>

      {/* TRUST / STATS BAR */}
      <section className="relative z-10 -mt-px border-y border-gold/15 bg-black/30 py-10 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4 lg:px-10">
          <Stat label="Trading Operations" value="24/7" sub="Global cycles" />
          <Stat label="Uptime Guarantee" value="99.9%" sub="Mission-critical" />
          <Stat label="Execution Latency" value="<50ms" sub="Sub-second edge" />
          <Stat label="Market Coverage" value="Global" sub="DEX + CEX" />
        </div>
      </section>

      {/* WHAT WE DO */}
      <SectionShell>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <MReveal>
            <span className="m-eyebrow">What We Do</span>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">
              Connecting capital to the <span className="m-gold-text">future of finance</span>.
            </h2>
            <p className="mt-6 text-foreground/75">
              Naslab connects businesses and individuals with innovative digital
              finance solutions by strategically positioning Nastech Global's advanced
              products for sustainable, long-term growth.
            </p>
            <Link to="/main/strategy" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold hover:gap-3 transition-all">
              Look At Our Strategy <ArrowRight className="h-4 w-4" />
            </Link>
          </MReveal>
          <MReveal delay={150}>
            <div className="m-luxe-border">
              <div className="grid gap-px overflow-hidden bg-gold/10 sm:grid-cols-2">
                {[
                  { Icon: Cpu, title: "Predictive Engines", body: "Mempool intelligence + ordering edge." },
                  { Icon: Network, title: "Cross-Market Liquidity", body: "DEX↔DEX, CEX↔CEX, DEX↔CEX paths." },
                  { Icon: Shield, title: "Institutional Security", body: "Audited custody, hardened ops." },
                  { Icon: Coins, title: "Tokenized Ecosystem", body: "NCT settlement + scarcity by design." },
                ].map(({ Icon, title, body }) => (
                  <div key={title} className="bg-[color:var(--m-bg)] p-6 transition-colors hover:bg-gold/5">
                    <Icon className="mb-3 h-6 w-6 text-gold" />
                    <div className="font-serif text-lg">{title}</div>
                    <div className="mt-1.5 text-xs text-foreground/65">{body}</div>
                  </div>
                ))}
              </div>
            </div>
          </MReveal>
        </div>
      </SectionShell>

      {/* STRATEGIC DIRECTION */}
      <SectionShell>
        <MReveal>
          <div className="text-center">
            <span className="m-eyebrow">Strategic Direction</span>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl md:text-5xl">
              A long-term roadmap for the <span className="m-gold-text">future of digital finance</span>.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-foreground/70">
              From automated trading systems to a scalable, global digital finance
              infrastructure — engineered to compound value over decades, not quarters.
            </p>
          </div>
        </MReveal>
        <MReveal delay={150}>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { Icon: Sparkles, k: "Phase I", t: "Foundation", d: "Core architecture, technical teams, secure platform." },
              { Icon: Zap, k: "Phase II", t: "Stabilization", d: "Live trading expansion, Ncore X strategy design." },
              { Icon: Globe, k: "Phase III", t: "Scale", d: "International expansion, 100K+ users, $50M trading scale." },
            ].map(({ Icon, k, t, d }) => (
              <div key={k} className="m-glass m-tilt p-7">
                <Icon className="h-7 w-7 text-gold" />
                <div className="mt-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold/80">{k}</div>
                <div className="mt-1 font-serif text-2xl">{t}</div>
                <p className="mt-3 text-sm text-foreground/65">{d}</p>
              </div>
            ))}
          </div>
        </MReveal>
      </SectionShell>

      {/* NCORE 2.0 SHOWCASE */}
      <SectionShell>
        <div className="grid gap-10 lg:grid-cols-12">
          <MReveal className="lg:col-span-5">
            <span className="m-eyebrow">Ncore 2.0</span>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">
              Predictive <span className="m-cyan-glow">MEV trading</span><br />for DEX markets.
            </h2>
            <p className="mt-6 text-foreground/75">
              A DEX-focused MEV trading platform that monitors the mempool,
              anticipates large orders, and executes front-run and back-run strategies
              with surgical precision.
            </p>
            <Link to="/main/ncore/basic" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold hover:gap-3 transition-all">
              Explore Ncore 2.0 <ArrowRight className="h-4 w-4" />
            </Link>
          </MReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {[
              { Icon: BookOpen, t: "Basic Understanding", d: "Foundational logic of on-chain execution — visibility, ordering, paths.", to: "/main/ncore/basic" },
              { Icon: Activity, t: "Trading Logic", d: "Mempool monitoring, sandwich execution, optimized ordering before reaction.", to: "/main/ncore/trading" },
              { Icon: Cpu, t: "Features", d: "Real-time execution, gas optimization, customizable risk controls.", to: "/main/ncore/features" },
              { Icon: TrendingUp, t: "Market Trends", d: "DeFi growth, MEV dynamics, L2 scaling, AI-driven trading, volatility.", to: "/main/ncore/trends" },
            ].map(({ Icon, t, d, to }, i) => (
              <MReveal key={t} delay={i * 100}>
                <Link to={to} className="m-glass m-tilt block h-full p-6">
                  <Icon className="h-6 w-6 text-gold" />
                  <div className="mt-4 font-serif text-xl">{t}</div>
                  <p className="mt-2 text-xs text-foreground/65">{d}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/85">
                    Read more <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </MReveal>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* NCORE X */}
      <SectionShell>
        <div className="m-luxe-border">
          <div className="grid items-center gap-10 p-10 lg:grid-cols-2 lg:p-14">
            <MReveal>
              <span className="m-eyebrow">Ncore X</span>
              <h2 className="mt-5 font-serif text-4xl md:text-5xl">
                Intelligent <span className="m-gold-text">cross-platform</span> arbitrage engine.
              </h2>
              <p className="mt-6 text-foreground/75">
                Covering DEX↔DEX, CEX↔CEX, and DEX↔CEX — transforming market price
                discrepancies into repeatable, systematic returns.
              </p>
              <Link to="/main/ncore/x" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold hover:gap-3 transition-all">
                Explore Ncore X <ArrowRight className="h-4 w-4" />
              </Link>
            </MReveal>
            <MReveal delay={150}>
              <ArbitrageDiagram />
            </MReveal>
          </div>
        </div>
      </SectionShell>

      {/* NCT TOKEN */}
      <SectionShell>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <MReveal className="order-2 lg:order-1">
            <div className="relative mx-auto aspect-square max-w-md">
              <div className="absolute inset-0 m-orbit-slow">
                <div className="absolute inset-0 rounded-full border border-gold/20" />
              </div>
              <div className="absolute inset-6 m-orbit-rev">
                <div className="absolute inset-0 rounded-full border border-cyan-400/20" />
              </div>
              <div className="absolute inset-12 m-orbit-slow">
                <div className="absolute inset-0 rounded-full border border-gold/30" />
              </div>
              <div className="absolute inset-0 grid place-items-center">
                <div className="m-float relative grid h-44 w-44 place-items-center rounded-full bg-gradient-to-br from-gold via-[#c89a2a] to-[#7a5b13] shadow-[0_30px_80px_-20px_color-mix(in_oklab,var(--gold)_80%,transparent),inset_0_-12px_30px_color-mix(in_oklab,black_45%,transparent),inset_0_8px_20px_color-mix(in_oklab,white_25%,transparent)]">
                  <span className="font-serif text-5xl font-bold text-[#3a2a08]">NCT</span>
                  <span className="absolute -inset-3 rounded-full border border-gold/50 [mask:radial-gradient(closest-side,transparent_70%,black)]" />
                </div>
              </div>
            </div>
          </MReveal>
          <MReveal delay={150} className="order-1 lg:order-2">
            <span className="m-eyebrow">NCT Token</span>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">
              The native asset of the <span className="m-gold-text">Ncore ecosystem</span>.
            </h2>
            <p className="mt-6 text-foreground/75">
              NCT is the exclusive settlement, access, and incentive layer that drives
              system usage, enforces scarcity through burn mechanisms, and aligns
              long-term ecosystem value.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                { k: "Utility", v: "Settlement" },
                { k: "Mechanism", v: "Deflationary" },
                { k: "Access", v: "Exclusive" },
              ].map((it) => (
                <div key={it.k} className="rounded-lg border border-gold/20 bg-card/30 p-3">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.25em] text-foreground/50">{it.k}</div>
                  <div className="mt-1 font-serif text-base text-gold">{it.v}</div>
                </div>
              ))}
            </div>
            <Link to="/main/ncore/token" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold hover:gap-3 transition-all">
              Explore NCT <ArrowRight className="h-4 w-4" />
            </Link>
          </MReveal>
        </div>
      </SectionShell>

      {/* ROADMAP PREVIEW */}
      <SectionShell>
        <MReveal>
          <div className="text-center">
            <span className="m-eyebrow">Roadmap</span>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl md:text-5xl">
              Shaping the <span className="m-gold-text">future of digital finance</span>.
            </h2>
          </div>
        </MReveal>
        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent md:block" />
          <div className="relative grid gap-6 md:grid-cols-4">
            {[
              { y: "2024", t: "Foundation", d: "Ncore 2.0 core architecture, Crypto Reserve Platform, technical teams formed." },
              { y: "2025", t: "Stabilization", d: "Ncore 2.0 upgrades, Ncore X concept design, arbitrage strategy paths.", active: true },
              { y: "2025 Q1–Q4", t: "Live Trading Expansion", d: "Trading scale $200K → $1M, security enhancements, Ncore X closed testing.", active: true },
              { y: "2026 Q1–Q4", t: "Scale & Market Readiness", d: "International expansion, $5M → $50M trading scale, 100,000 users target." },
            ].map((r, i) => (
              <MReveal key={r.y} delay={i * 100}>
                <div className="m-glass m-tilt relative p-6">
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-2">
                    {r.active && <span className="ring-pulse h-2 w-2 rounded-full bg-gold" />}
                    <span className="rounded-full border border-gold/40 bg-[color:var(--m-bg)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
                      {r.y}
                    </span>
                  </div>
                  <div className="mt-3 font-serif text-xl">{r.t}</div>
                  <p className="mt-2 text-xs text-foreground/65">{r.d}</p>
                </div>
              </MReveal>
            ))}
          </div>
        </div>
        <MReveal delay={400}>
          <div className="mt-10 text-center">
            <Link to="/main/roadmap" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold hover:gap-3 transition-all">
              Explore Full Roadmap <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </MReveal>
      </SectionShell>

      {/* CAREERS + COLLABORATION */}
      <SectionShell>
        <div className="grid gap-6 lg:grid-cols-2">
          <MReveal>
            <Link to="/main/careers" className="m-glass m-tilt block h-full p-10">
              <Users className="h-8 w-8 text-gold" />
              <h3 className="mt-6 font-serif text-3xl">Careers at Naslab</h3>
              <p className="mt-3 text-sm text-foreground/70">
                We're building technology-driven systems for fast-moving digital
                markets — and we're looking for people who care about execution,
                precision, and impact.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                See Open Roles <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </MReveal>
          <MReveal delay={120}>
            <Link to="/main/collaboration" className="m-glass m-tilt block h-full p-10">
              <Handshake className="h-8 w-8 text-gold" />
              <h3 className="mt-6 font-serif text-3xl">Collaboration</h3>
              <p className="mt-3 text-sm text-foreground/70">
                We collaborate with partners who value execution quality, technical
                rigor, and long-term system building.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                Partner With Us <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </MReveal>
        </div>
      </SectionShell>

      {/* FINAL CTA */}
      <SectionShell>
        <MReveal>
          <div className="m-luxe-border">
            <div className="relative overflow-hidden p-14 text-center md:p-20">
              <div className="absolute -top-20 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />
              <span className="m-eyebrow">Get In Touch</span>
              <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl md:text-6xl">
                Ready to navigate the <span className="m-gold-text">future of digital finance</span>?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-foreground/70">
                Have a question or want to learn more about our products? Let's
                start the conversation.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link to="/main/contact">
                  <MagneticButton className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold to-gold/90 px-9 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold-foreground shadow-[0_15px_50px_-15px_color-mix(in_oklab,var(--gold)_80%,transparent)]">
                    Contact Us <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                </Link>
                <a
                  href="mailto:contact@naslabtec.com"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-9 py-4 text-sm font-medium uppercase tracking-[0.18em] text-foreground/85 transition-all hover:border-gold/60 hover:text-gold"
                >
                  contact@naslabtec.com
                </a>
              </div>
            </div>
          </div>
        </MReveal>
      </SectionShell>
    </>
  );
}

function HeroFallback() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-gold/40 to-transparent blur-3xl" />
    </div>
  );
}

function SectionShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
      {children}
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  // numeric-only count up if value is numeric, else show static
  const isNumeric = /^\d/.test(value);
  return (
    <div className="text-center">
      <div className="font-serif text-4xl md:text-5xl">
        {isNumeric ? (
          value.includes(".") ? (
            <span className="m-gold-text">
              <CountUp value={parseFloat(value)} decimals={1} suffix="%" duration={1800} />
            </span>
          ) : (
            <span className="m-gold-text">{value}</span>
          )
        ) : (
          <span className="m-gold-text">{value}</span>
        )}
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.28em] text-foreground/65">{label}</div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-foreground/40">{sub}</div>
    </div>
  );
}

function ArbitrageDiagram() {
  const nodes = [
    { id: "DEX A", x: 10, y: 50 },
    { id: "DEX B", x: 90, y: 50 },
    { id: "CEX", x: 50, y: 10 },
    { id: "Vault", x: 50, y: 90 },
  ];
  return (
    <div className="relative aspect-square w-full max-w-md">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="ng" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--gold)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {nodes.map((a, i) =>
          nodes.slice(i + 1).map((b) => (
            <line
              key={`${a.id}-${b.id}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="url(#ng)"
              strokeWidth="0.4"
            />
          )),
        )}
      </svg>
      {nodes.map((n) => (
        <div
          key={n.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <div className="ring-pulse grid h-12 w-12 place-items-center rounded-full border border-gold/60 bg-[color:var(--m-bg)] text-[10px] font-bold uppercase tracking-wider text-gold">
            {n.id}
          </div>
        </div>
      ))}
    </div>
  );
}
