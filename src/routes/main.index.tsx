import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Sparkles, Shield, Zap, Globe, Cpu, Network, Coins,
  BookOpen, TrendingUp, Activity, Users, Handshake, Gauge, Timer, Wifi,
} from "lucide-react";
import { lazy, Suspense } from "react";
import { ClientOnly } from "@/components/marketing/client-only";
import { MReveal } from "@/components/marketing/m-reveal";
import { MagneticButton } from "@/components/magnetic-button";
import { CountUp } from "@/components/count-up";
import { LGCard } from "@/components/marketing/lg-card";
import { Tagline } from "@/components/marketing/tagline";
import { Sparkline } from "@/components/marketing/charts/sparkline";
import { ArbitrageGraph } from "@/components/marketing/charts/arbitrage-graph";
import { BurnCurve, AllocationDonut } from "@/components/marketing/charts/token-charts";

const Hero3D = lazy(() => import("@/components/marketing/hero-3d").then((m) => ({ default: m.Hero3D })));
const NCTCoin3D = lazy(() => import("@/components/marketing/nct-coin-3d").then((m) => ({ default: m.NCTCoin3D })));

export const Route = createFileRoute("/main/")({
  head: () => ({
    meta: [
      { title: "NASLAB — Where Luxury Meets Decentralized Innovation" },
      { name: "description", content: "Naslab is the marketing engine of Nastech Global, delivering next-generation digital finance — Ncore 2.0 MEV trading, Ncore X arbitrage, and the NCT token ecosystem." },
      { property: "og:title", content: "NASLAB — Where Luxury Meets Decentralized Innovation" },
      { property: "og:description", content: "Build your crypto reserve with confidence. Predictive trading infrastructure for the digital economy." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* ────────── HERO ────────── */}
      <section className="relative -mt-20 h-screen min-h-[640px] overflow-hidden">
        {/* Background 3D scene */}
        <div className="absolute inset-0 z-0">
          <ClientOnly>
            <Suspense fallback={<HeroFallback />}>
              <Hero3D />
            </Suspense>
          </ClientOnly>
        </div>

        {/* God-ray overlay (CSS, on top of canvas for extra depth) */}
        <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
          <div className="lg-godray h-[120vh] w-[120vh] opacity-60" />
        </div>

        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_30%,#06070b_85%)]" />

        {/* Bottom tagline */}
        <div className="absolute inset-x-0 bottom-12 z-10 flex flex-col items-center gap-5 px-6 text-center md:bottom-20">
          <div className="lg-pill">Naslab × Nastech Global</div>
          <h1 className="font-serif text-[clamp(1.6rem,4.5vw,3.4rem)] leading-tight tracking-[0.01em]">
            <Tagline text="Where Luxury Meets" className="lg-tagline block" />
            <Tagline text="Decentralized Innovation" className="lg-tagline mt-1 block" />
          </h1>
          <div className="mt-2 flex items-center gap-3 text-[10px] uppercase tracking-[0.45em] text-foreground/45">
            <span className="h-px w-10 bg-foreground/30" />
            scroll to enter
            <span className="h-px w-10 bg-foreground/30" />
          </div>
        </div>
      </section>

      {/* ────────── INTRO + CTA ────────── */}
      <SectionShell tight>
        <MReveal>
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="lg-pill">A New Era of Digital Wealth</span>
              <h2 className="mt-6 font-serif text-4xl leading-[1.05] md:text-6xl">
                Build your crypto reserve with <span className="lg-tagline">confidence</span>.
              </h2>
              <p className="mt-6 max-w-xl text-foreground/75">
                Backed by predictive MEV trading, intelligent cross-platform arbitrage,
                and a tokenized ecosystem engineered for sustainable, long-term growth.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:col-span-5 lg:justify-end">
              <Link to="/main/ncore/basic">
                <MagneticButton className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold to-gold/90 px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold-foreground shadow-[0_15px_50px_-15px_color-mix(in_oklab,var(--gold)_80%,transparent)]">
                  Explore Products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </MagneticButton>
              </Link>
              <Link
                to="/main/about"
                className="group inline-flex items-center gap-2 rounded-full border border-foreground/15 px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-foreground/85 backdrop-blur transition-all hover:border-gold/60 hover:text-gold"
              >
                About Naslab <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </MReveal>
      </SectionShell>

      {/* ────────── LIVE METRICS ────────── */}
      <SectionShell tight>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            Icon={Wifi}
            label="Trading Operations"
            value="24/7"
            sub="Global cycles"
            spark={[3, 4, 6, 5, 7, 8, 9, 10, 9, 11, 12, 14]}
          />
          <MetricCard
            Icon={Shield}
            label="Uptime Guarantee"
            value="99.9%"
            sub="Mission-critical"
            spark={[8, 9, 9.2, 9.5, 9.7, 9.6, 9.8, 9.9, 9.85, 9.95, 9.9, 9.99]}
          />
          <MetricCard
            Icon={Timer}
            label="Execution Latency"
            value="<50ms"
            sub="Sub-second edge"
            spark={[120, 90, 70, 80, 60, 55, 48, 50, 45, 47, 44, 42]}
            invert
          />
          <MetricCard
            Icon={Globe}
            label="Market Coverage"
            value="Global"
            sub="DEX + CEX"
            spark={[2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 19]}
          />
        </div>
      </SectionShell>

      {/* ────────── WHAT WE DO ────────── */}
      <SectionShell>
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <MReveal className="lg:col-span-5">
            <span className="lg-pill">What We Do</span>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">
              Connecting capital to the <span className="lg-tagline">future of finance</span>.
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
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {[
              { Icon: Cpu, t: "Predictive Engines", d: "Mempool intelligence + ordering edge." },
              { Icon: Network, t: "Cross-Market Liquidity", d: "DEX↔DEX, CEX↔CEX, DEX↔CEX paths." },
              { Icon: Shield, t: "Institutional Security", d: "Audited custody, hardened ops." },
              { Icon: Coins, t: "Tokenized Ecosystem", d: "NCT settlement + scarcity by design." },
            ].map(({ Icon, t, d }, i) => (
              <MReveal key={t} delay={i * 80}>
                <LGCard className="h-full p-6">
                  <Icon className="h-6 w-6 text-gold" />
                  <div className="mt-4 font-serif text-xl">{t}</div>
                  <p className="mt-2 text-sm text-foreground/65">{d}</p>
                </LGCard>
              </MReveal>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ────────── STRATEGIC DIRECTION ────────── */}
      <SectionShell>
        <MReveal>
          <div className="text-center">
            <span className="lg-pill">Strategic Direction</span>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl md:text-5xl">
              A long-term roadmap for the <span className="lg-tagline">future of digital finance</span>.
            </h2>
          </div>
        </MReveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { Icon: Sparkles, k: "Phase I", t: "Foundation", d: "Core architecture, technical teams, secure platform." },
            { Icon: Zap, k: "Phase II", t: "Stabilization", d: "Live trading expansion, Ncore X strategy design." },
            { Icon: Globe, k: "Phase III", t: "Scale", d: "International expansion, 100K+ users, $50M trading scale." },
          ].map(({ Icon, k, t, d }, i) => (
            <MReveal key={k} delay={i * 100}>
              <LGCard className="lg-mesh-bg h-full p-7">
                <Icon className="h-7 w-7 text-gold" />
                <div className="mt-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold/80">{k}</div>
                <div className="mt-1 font-serif text-2xl">{t}</div>
                <p className="mt-3 text-sm text-foreground/65">{d}</p>
              </LGCard>
            </MReveal>
          ))}
        </div>
      </SectionShell>

      {/* ────────── NCORE 2.0 SHOWCASE ────────── */}
      <SectionShell>
        <div className="grid gap-10 lg:grid-cols-12">
          <MReveal className="lg:col-span-5">
            <span className="lg-pill">Ncore 2.0</span>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">
              Predictive <span className="lg-tagline">MEV trading</span><br />for DEX markets.
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
              { Icon: BookOpen, t: "Basic Understanding", d: "Foundational logic of on-chain execution.", to: "/main/ncore/basic" },
              { Icon: Activity, t: "Trading Logic", d: "Mempool monitoring, sandwich execution.", to: "/main/ncore/trading" },
              { Icon: Cpu, t: "Features", d: "Real-time execution, gas optimization, risk controls.", to: "/main/ncore/features" },
              { Icon: TrendingUp, t: "Market Trends", d: "DeFi growth, MEV dynamics, L2 scaling, AI trading.", to: "/main/ncore/trends" },
            ].map(({ Icon, t, d, to }, i) => (
              <MReveal key={t} delay={i * 100}>
                <LGCard as="a" className="block h-full p-6">
                  <Link to={to} className="block">
                    <Icon className="h-6 w-6 text-gold" />
                    <div className="mt-4 font-serif text-xl">{t}</div>
                    <p className="mt-2 text-xs text-foreground/65">{d}</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/85">
                      Read more <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                </LGCard>
              </MReveal>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ────────── NCORE X ────────── */}
      <SectionShell>
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <MReveal className="lg:col-span-5">
            <span className="lg-pill">Ncore X</span>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">
              Intelligent <span className="lg-tagline">cross-platform</span> arbitrage.
            </h2>
            <p className="mt-6 text-foreground/75">
              Covering DEX↔DEX, CEX↔CEX, and DEX↔CEX — transforming market price
              discrepancies into repeatable, systematic returns.
            </p>
            <Link to="/main/ncore/x" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold hover:gap-3 transition-all">
              Explore Ncore X <ArrowRight className="h-4 w-4" />
            </Link>
          </MReveal>
          <MReveal delay={150} className="lg:col-span-7">
            <ArbitrageGraph />
          </MReveal>
        </div>
      </SectionShell>

      {/* ────────── NCT TOKEN ────────── */}
      <SectionShell>
        <MReveal>
          <div className="text-center">
            <span className="lg-pill">NCT Token</span>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl md:text-5xl">
              The native asset of the <span className="lg-tagline">Ncore ecosystem</span>.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-foreground/70">
              Settlement, access, and incentive layer — engineered with deflationary
              scarcity to align long-term value.
            </p>
          </div>
        </MReveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <MReveal className="lg:col-span-5">
            <LGCard className="p-2">
              <ClientOnly>
                <Suspense fallback={<div className="h-[360px]" />}>
                  <NCTCoin3D />
                </Suspense>
              </ClientOnly>
            </LGCard>
          </MReveal>
          <MReveal delay={120} className="lg:col-span-7">
            <div className="grid gap-6">
              <BurnCurve />
              <AllocationDonut />
            </div>
          </MReveal>
        </div>
        <div className="mt-8 text-center">
          <Link to="/main/ncore/token" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold hover:gap-3 transition-all">
            Explore NCT <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SectionShell>

      {/* ────────── ROADMAP PREVIEW ────────── */}
      <SectionShell>
        <MReveal>
          <div className="text-center">
            <span className="lg-pill">Roadmap</span>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl md:text-5xl">
              Shaping the <span className="lg-tagline">future of digital finance</span>.
            </h2>
          </div>
        </MReveal>
        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent md:block" />
          <div className="relative grid gap-6 md:grid-cols-4">
            {[
              { y: "2024", t: "Foundation", d: "Ncore 2.0 architecture, Crypto Reserve Platform, technical teams." },
              { y: "2025", t: "Stabilization", d: "Ncore 2.0 upgrades, Ncore X concept, arbitrage strategy paths.", active: true },
              { y: "2025 Q1–Q4", t: "Live Expansion", d: "Trading scale $200K → $1M, security, Ncore X testing.", active: true },
              { y: "2026 Q1–Q4", t: "Scale", d: "International expansion, $5M → $50M scale, 100K users." },
            ].map((r, i) => (
              <MReveal key={r.y} delay={i * 100}>
                <LGCard className="relative p-6">
                  <div className="absolute -top-3 left-6 inline-flex items-center gap-2 z-[4]">
                    {r.active && <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />}
                    <span className="rounded-full border border-gold/40 bg-[color:var(--m-bg)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
                      {r.y}
                    </span>
                  </div>
                  <div className="mt-3 font-serif text-xl">{r.t}</div>
                  <p className="mt-2 text-xs text-foreground/65">{r.d}</p>
                </LGCard>
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

      {/* ────────── CAREERS + COLLABORATION ────────── */}
      <SectionShell>
        <div className="grid gap-6 lg:grid-cols-2">
          <MReveal>
            <LGCard className="lg-mesh-bg h-full p-10">
              <Link to="/main/careers" className="block">
                <Users className="h-8 w-8 text-gold" />
                <h3 className="mt-6 font-serif text-3xl">Careers at Naslab</h3>
                <p className="mt-3 text-sm text-foreground/70">
                  Building technology-driven systems for fast-moving digital
                  markets — for people who care about execution, precision, and impact.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                  See Open Roles <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </LGCard>
          </MReveal>
          <MReveal delay={120}>
            <LGCard className="lg-mesh-bg h-full p-10">
              <Link to="/main/collaboration" className="block">
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
            </LGCard>
          </MReveal>
        </div>
      </SectionShell>

      {/* ────────── FINAL CTA ────────── */}
      <SectionShell>
        <MReveal>
          <LGCard className="relative overflow-hidden p-14 text-center md:p-20">
            <div className="lg-halo absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2" />
            <span className="lg-pill">Get In Touch</span>
            <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl md:text-6xl">
              <Tagline text="Where Luxury Meets Decentralized Innovation" className="lg-tagline" />
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-foreground/70">
              Have a question or want to learn more about our products? Let's start
              the conversation.
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
          </LGCard>
        </MReveal>
      </SectionShell>
    </>
  );
}

function HeroFallback() {
  return (
    <div className="relative h-full w-full bg-[#06070b]">
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-gold/40 to-transparent blur-3xl" />
    </div>
  );
}

function SectionShell({ children, tight }: { children: React.ReactNode; tight?: boolean }) {
  return (
    <section className={`relative z-10 mx-auto max-w-7xl px-6 lg:px-10 ${tight ? "py-14 md:py-20" : "py-24 md:py-32"}`}>
      {children}
    </section>
  );
}

function MetricCard({
  Icon, label, value, sub, spark, invert,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; sub: string; spark: number[]; invert?: boolean;
}) {
  const isPct = value.endsWith("%");
  const numeric = parseFloat(value);
  return (
    <LGCard className="p-6">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-gold" />
        <Sparkline data={invert ? [...spark].reverse() : spark} width={90} height={28} />
      </div>
      <div className="mt-5 font-serif text-4xl">
        {Number.isFinite(numeric) ? (
          <span className="lg-tagline">
            <CountUp value={numeric} decimals={isPct ? 1 : 0} suffix={isPct ? "%" : ""} duration={1800} />
          </span>
        ) : (
          <span className="lg-tagline">{value}</span>
        )}
      </div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-foreground/65">{label}</div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-foreground/40">{sub}</div>
    </LGCard>
  );
}
