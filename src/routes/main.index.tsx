import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Sparkles, Shield, Zap, Globe, Cpu, Network, Coins,
  BookOpen, TrendingUp, Activity, Users, Handshake, Timer, Wifi,
} from "lucide-react";
import { lazy, Suspense } from "react";
import { ClientOnly } from "@/components/marketing/client-only";
import { MountInView } from "@/components/marketing/mount-in-view";
import { MReveal } from "@/components/marketing/m-reveal";
import { MagneticButton } from "@/components/magnetic-button";
import { CountUp } from "@/components/count-up";
import { LGCard } from "@/components/marketing/lg-card";
import { SplitLines } from "@/components/marketing/split-lines";
import { ChapterDivider } from "@/components/marketing/chapter-divider";
import { TickerTape } from "@/components/marketing/charts-pro/ticker-tape";
import { SparklinePro } from "@/components/marketing/charts-pro/sparkline-pro";
import { ArbConstellation } from "@/components/marketing/charts-pro/arb-constellation";
import { AllocationOrbit } from "@/components/marketing/charts-pro/allocation-orbit";
import { BurnDecay } from "@/components/marketing/charts-pro/burn-decay";
import { HeatmapGrid } from "@/components/marketing/charts-pro/heatmap-grid";


const NCTCoin3D = lazy(() => import("@/components/marketing/nct-coin-3d").then((m) => ({ default: m.NCTCoin3D })));
const SignatureDissolve = lazy(() => import("@/components/marketing/signature-dissolve").then((m) => ({ default: m.SignatureDissolve })));

export const Route = createFileRoute("/main/")({
  head: () => ({
    meta: [
      { title: "NASLAB — Where Luxury Meets Decentralized Innovation" },
      { name: "description", content: "Predictive MEV trading, intelligent cross-platform arbitrage, and the NCT token ecosystem." },
      { property: "og:title", content: "NASLAB — Where Luxury Meets Decentralized Innovation" },
      { property: "og:description", content: "Build your crypto reserve with confidence." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative -mt-20 h-screen min-h-[680px] overflow-hidden bg-[#06070b]">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,170,80,0.18)_0%,transparent_55%),radial-gradient(ellipse_at_center,transparent_30%,#06070b_85%)]" />

        <div className="absolute inset-x-0 bottom-20 z-10 flex flex-col items-center gap-6 px-6 text-center md:bottom-28">
          <h1 className="m-h1">
            <SplitLines text="Where Luxury Meets" className="lg-tagline block" />
            <SplitLines text="Decentralized Innovation" className="lg-tagline mt-1 block" delay={400} />
          </h1>
        </div>
      </section>

      {/* SIGNATURE MOMENT — logo dissolves into NCT particles */}
      <ClientOnly>
        <MountInView rootMargin="20% 0px" minHeight="100vh" unmountWhenOut fallback={<div className="h-screen" />}>
          <Suspense fallback={<div className="h-screen" />}>
            <SignatureDissolve />
          </Suspense>
        </MountInView>
      </ClientOnly>

      {/* TICKER */}
      <TickerTape />

      <ChapterDivider ch="CH.01" label="A NEW ERA OF DIGITAL WEALTH" />

      {/* INTRO + CTA */}
      <SectionShell tight>
        <MReveal>
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className=" m-h2">
                Build your crypto reserve with <span className="m-accent lg-tagline">confidence</span>.
              </h2>
              <p className="mt-7 max-w-xl text-foreground/70">
                Backed by predictive MEV trading, intelligent cross-platform arbitrage,
                and a tokenized ecosystem engineered for sustainable, long-term growth.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 lg:col-span-5 lg:justify-end">
              <Link to="/main/ncore/basic">
                <MagneticButton className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold to-gold/90 px-10 py-5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-foreground shadow-[0_18px_60px_-15px_color-mix(in_oklab,var(--gold)_85%,transparent)]">
                  Explore Products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </MagneticButton>
              </Link>
            </div>
          </div>
        </MReveal>
      </SectionShell>

      <ChapterDivider ch="CH.02" label="LIVE PULSE" />

      {/* LIVE METRICS */}
      <SectionShell tight>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard Icon={Wifi} label="Trading Operations" value="24/7" sub="Global cycles" spark={[3,4,6,5,7,8,9,10,9,11,12,14]} />
          <MetricCard Icon={Shield} label="Uptime Guarantee" value="99.9%" sub="Mission-critical" spark={[8,9,9.2,9.5,9.7,9.6,9.8,9.9,9.85,9.95,9.9,9.99]} />
          <MetricCard Icon={Timer} label="Execution Latency" value="<50ms" sub="Sub-second edge" spark={[120,90,70,80,60,55,48,50,45,47,44,42]} invert />
          <MetricCard Icon={Globe} label="Market Coverage" value="Global" sub="DEX + CEX" spark={[2,3,5,6,8,9,11,12,14,15,17,19]} />
        </div>
      </SectionShell>

      {/* ACTIVITY HEATMAP */}
      <SectionShell tight>
        <MReveal><HeatmapGrid /></MReveal>
      </SectionShell>

      <ChapterDivider ch="CH.03" label="WHAT WE DO" />

      <SectionShell>
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <MReveal className="lg:col-span-5">
            
            <h2 className="mt-5 m-h2">
              Connecting capital to the <span className="m-accent lg-tagline">future of finance</span>.
            </h2>
            <p className="mt-6 text-foreground/75">
              Naslab connects businesses and individuals with innovative digital
              finance solutions by strategically positioning Nastech Global's advanced
              products for sustainable, long-term growth.
            </p>
            <Link to="/main/strategy" className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-all hover:gap-3">
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
                  <div className="mt-4 m-card-title">{t}</div>
                  <p className="mt-2 text-sm text-foreground/65">{d}</p>
                </LGCard>
              </MReveal>
            ))}
          </div>
        </div>
      </SectionShell>

      <ChapterDivider ch="CH.04" label="STRATEGIC DIRECTION" />

      <SectionShell>
        <MReveal>
          <div className="text-center">
            
            <h2 className="mx-auto mt-5 max-w-3xl m-h2">
              A long-term roadmap for the <span className="m-accent lg-tagline">future of digital finance</span>.
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
                <div className="mt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-gold/80">{k}</div>
                <div className="mt-1 text-2xl m-display">{t}</div>
                <p className="mt-3 text-sm text-foreground/65">{d}</p>
              </LGCard>
            </MReveal>
          ))}
        </div>
      </SectionShell>

      <ChapterDivider ch="CH.05" label="NCORE 2.0" />

      <SectionShell>
        <div className="grid gap-10 lg:grid-cols-12">
          <MReveal className="lg:col-span-5">
            
            <h2 className="mt-5 m-h2">
              Predictive <span className="m-accent lg-tagline">MEV trading</span><br />for DEX markets.
            </h2>
            <p className="mt-6 text-foreground/75">
              A DEX-focused MEV trading platform that monitors the mempool,
              anticipates large orders, and executes front-run and back-run strategies
              with surgical precision.
            </p>
            <Link to="/main/ncore/basic" className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-all hover:gap-3">
              Explore Ncore 2.0 <ArrowRight className="h-4 w-4" />
            </Link>
          </MReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {[
              { Icon: BookOpen, t: "Basic Understanding", d: "Foundational logic of on-chain execution.", to: "/main/ncore/basic" as const },
              { Icon: Activity, t: "Trading Logic", d: "Mempool monitoring, sandwich execution.", to: "/main/ncore/trading" as const },
              { Icon: Cpu, t: "Features", d: "Real-time execution, gas optimization.", to: "/main/ncore/features" as const },
              { Icon: TrendingUp, t: "Market Trends", d: "DeFi growth, MEV dynamics, L2 scaling.", to: "/main/ncore/trends" as const },
            ].map(({ Icon, t, d, to }, i) => (
              <MReveal key={t} delay={i * 100}>
                <Link to={to} className="block">
                  <LGCard className="h-full p-6">
                    <Icon className="h-6 w-6 text-gold" />
                    <div className="mt-4 m-card-title">{t}</div>
                    <p className="mt-2 text-xs text-foreground/65">{d}</p>
                    <div className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/85">
                      Read more <ArrowRight className="h-3 w-3" />
                    </div>
                  </LGCard>
                </Link>
              </MReveal>
            ))}
          </div>
        </div>
      </SectionShell>

      <ChapterDivider ch="CH.06" label="NCORE X" />

      <SectionShell>
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <MReveal className="lg:col-span-5">
            
            <h2 className="mt-5 m-h2">
              Intelligent <span className="m-accent lg-tagline">cross-platform</span> arbitrage.
            </h2>
            <p className="mt-6 text-foreground/75">
              Covering DEX↔DEX, CEX↔CEX, and DEX↔CEX — transforming market price
              discrepancies into repeatable, systematic returns.
            </p>
            <Link to="/main/ncore/x" className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-all hover:gap-3">
              Explore Ncore X <ArrowRight className="h-4 w-4" />
            </Link>
          </MReveal>
          <MReveal delay={150} className="lg:col-span-7">
            <ArbConstellation />
          </MReveal>
        </div>
      </SectionShell>

      <ChapterDivider ch="CH.07" label="NCT TOKEN" />

      <SectionShell>
        <MReveal>
          <div className="text-center">
            
            <h2 className="mx-auto mt-5 max-w-3xl m-h2">
              The native asset of the <span className="m-accent lg-tagline">Ncore ecosystem</span>.
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
                <MountInView rootMargin="25% 0px" minHeight={360} fallback={<div className="h-[360px]" />}>
                  <Suspense fallback={<div className="h-[360px]" />}>
                    <NCTCoin3D />
                  </Suspense>
                </MountInView>
              </ClientOnly>
            </LGCard>
          </MReveal>
          <MReveal delay={120} className="lg:col-span-7">
            <AllocationOrbit />
          </MReveal>
          <MReveal delay={200} className="lg:col-span-12">
            <BurnDecay />
          </MReveal>
        </div>
        <div className="mt-8 text-center">
          <Link to="/main/ncore/token" className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-all hover:gap-3">
            Explore NCT <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SectionShell>

      <ChapterDivider ch="CH.08" label="ROADMAP" />

      <SectionShell>
        <MReveal>
          <div className="text-center">
            
            <h2 className="mx-auto mt-5 max-w-3xl m-h2">
              Shaping the <span className="m-accent lg-tagline">future of digital finance</span>.
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
                    <span className="rounded-full border border-gold/40 bg-[color:var(--m-bg)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
                      {r.y}
                    </span>
                  </div>
                  <div className="mt-3 m-card-title">{r.t}</div>
                  <p className="mt-2 text-xs text-foreground/65">{r.d}</p>
                </LGCard>
              </MReveal>
            ))}
          </div>
        </div>
        <MReveal delay={400}>
          <div className="mt-10 text-center">
            <Link to="/main/roadmap" className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-all hover:gap-3">
              Explore Full Roadmap <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </MReveal>
      </SectionShell>

      <ChapterDivider ch="CH.09" label="JOIN" />

      <SectionShell>
        <div className="grid gap-6 lg:grid-cols-2">
          <MReveal>
            <Link to="/main/careers" className="block">
              <LGCard className="lg-mesh-bg h-full p-10">
                <Users className="h-8 w-8 text-gold" />
                <h3 className="mt-6 text-3xl m-display">Careers at Naslab</h3>
                <p className="mt-3 text-sm text-foreground/70">
                  Building technology-driven systems for fast-moving digital
                  markets — for people who care about execution, precision, and impact.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  See Open Roles <ArrowRight className="h-4 w-4" />
                </div>
              </LGCard>
            </Link>
          </MReveal>
          <MReveal delay={120}>
            <Link to="/main/collaboration" className="block">
              <LGCard className="lg-mesh-bg h-full p-10">
                <Handshake className="h-8 w-8 text-gold" />
                <h3 className="mt-6 text-3xl m-display">Collaboration</h3>
                <p className="mt-3 text-sm text-foreground/70">
                  We collaborate with partners who value execution quality, technical
                  rigor, and long-term system building.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Partner With Us <ArrowRight className="h-4 w-4" />
                </div>
              </LGCard>
            </Link>
          </MReveal>
        </div>
      </SectionShell>

      {/* FINAL CTA */}
      <SectionShell>
        <MReveal>
          <LGCard className="relative overflow-hidden p-14 text-center md:p-20">
            <div className="lg-halo absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2" />
            
            <h2 className="mx-auto mt-6 max-w-4xl m-h2">
              <SplitLines text="Where Luxury Meets Decentralized Innovation" className="lg-tagline" />
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-foreground/70">
              Have a question or want to learn more about our products? Let's start the conversation.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/main/contact">
                <MagneticButton className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold to-gold/90 px-9 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold-foreground shadow-[0_15px_50px_-15px_color-mix(in_oklab,var(--gold)_80%,transparent)]">
                  Contact Us <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </Link>
              <a
                href="mailto:contact@naslabtec.com"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-9 py-4 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/85 transition-all hover:border-gold/60 hover:text-gold"
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
    <section className={`relative z-10 mx-auto max-w-7xl px-6 lg:px-10 ${tight ? "py-12 md:py-16" : "py-20 md:py-28"}`}>
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
        <SparklinePro data={invert ? [...spark].reverse() : spark} width={90} height={28} />
      </div>
      <div className="mt-5 text-4xl tabular-nums m-display" style={{ letterSpacing: "-0.03em" }}>
        {Number.isFinite(numeric) ? (
          <span className="lg-tagline">
            <CountUp value={numeric} decimals={isPct ? 1 : 0} suffix={isPct ? "%" : ""} duration={1800} />
          </span>
        ) : (
          <span className="lg-tagline">{value}</span>
        )}
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/65">{label}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">{sub}</div>
    </LGCard>
  );
}
