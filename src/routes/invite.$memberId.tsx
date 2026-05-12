import { useEffect, useRef, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Cpu,
  Globe2,
  LineChart,
  Lock,
  Send as TgIcon,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import logoMark from "@/assets/participant-portal-logo.png";
import { MobilePoster } from "@/components/marketing/mobile-poster";
import { ThreeBackground } from "@/components/three-background";

type Search = { print?: string };

export const Route = createFileRoute("/invite/$memberId")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    print: typeof s.print === "string" ? s.print : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      { title: `You're Invited to NASLAB — Member ${params.memberId}` },
      {
        name: "description",
        content:
          "Join NASLAB. Institutional-grade MEV trading powered by Ncore 2.0 AI. Earn while the market sleeps.",
      },
      { property: "og:title", content: `You're Invited to NASLAB` },
      {
        property: "og:description",
        content: "Institutional-grade MEV trading. Earn while the market sleeps.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: InviteLandingPage,
});

function InviteLandingPage() {
  const { memberId } = Route.useParams();
  const { print } = Route.useSearch();
  const isPrint = print === "1";
  return <InviteLandingContent memberId={memberId} isPrint={isPrint} />;
}

/**
 * Renders MobilePoster on small screens (≤ md) and the rich multi-section
 * desktop landing on larger screens. The portal preview always renders the
 * MobilePoster directly via <MobilePoster /> — this component is for the
 * public /invite/:memberId page.
 */
export function InviteLandingContent({
  memberId,
}: {
  memberId: string;
  isPrint?: boolean;
}) {
  // Mirror the portal's chosen theme (stored in localStorage by useTheme).
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = (localStorage.getItem("iv-theme") as "light" | "dark" | null) ?? "dark";
    setTheme(stored);
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);

  const bg =
    theme === "light"
      ? "linear-gradient(180deg, #ffffff 0%, #f4f4f5 100%)"
      : "radial-gradient(120% 60% at 50% 0%, #1a1407 0%, #0a0805 35%, #050403 100%)";

  return (
    <div
      className="landing-root invite-scroll-reveal relative min-h-screen w-full overflow-x-hidden"
      style={{ background: bg }}
    >
      <style>{`
        .invite-scroll-reveal .poster-root > section,
        .invite-scroll-reveal .poster-root > footer {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
          will-change: opacity, transform;
        }
        .invite-scroll-reveal .poster-root > section.in-view,
        .invite-scroll-reveal .poster-root > footer.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        @supports (animation-timeline: view()) {
          .invite-scroll-reveal .poster-root > section,
          .invite-scroll-reveal .poster-root > footer {
            opacity: 1;
            transform: none;
            transition: none;
            animation: invite-section-reveal linear both;
            animation-timeline: view();
            animation-range: entry 0% entry 60%;
          }
          @keyframes invite-section-reveal {
            0%   { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>
      <div className="pointer-events-none fixed inset-0 z-0">
        <ThreeBackground />
      </div>
      <LightningNodes theme={theme} />
      <ResponsiveInvitePoster>
        <MobilePoster memberId={memberId} theme={theme} animate />
      </ResponsiveInvitePoster>
      <ScrollRevealFallback />
    </div>
  );
}

function ResponsiveInvitePoster({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState({ scale: 1, height: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const compute = () => {
      const available = Math.min(window.innerWidth, wrap.clientWidth || window.innerWidth);
      const scale = Math.min(1, available / 1080);
      setLayout({ scale, height: Math.ceil(inner.scrollHeight * scale) });
    };

    compute();
    const raf = requestAnimationFrame(compute);
    const ro = new ResizeObserver(compute);
    ro.observe(wrap);
    ro.observe(inner);
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative z-10 mx-auto w-full overflow-hidden" style={{ maxWidth: 1080 }}>
      <div style={{ height: layout.height || undefined }}>
        <div
          ref={innerRef}
          style={{
            width: 1080,
            transform: `scale(${layout.scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** IntersectionObserver fallback for browsers without animation-timeline (Safari/Firefox). */
function ScrollRevealFallback() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (CSS.supports?.("animation-timeline: view()")) return;
    const els = document.querySelectorAll(
      ".invite-scroll-reveal .poster-root > section, .invite-scroll-reveal .poster-root > footer",
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

/* ==================== LIGHTNING NODES BACKGROUND ====================
 * Subtle animated constellation behind the poster. Kept low-opacity so it
 * never competes with text. Sits behind the 1080px poster column and is
 * only really visible in the side gutters on wide screens. */
function LightningNodes({ theme }: { theme: "light" | "dark" }) {
  const nodeColor = theme === "light" ? "rgba(122,88,24,0.55)" : "rgba(240,207,122,0.7)";
  const lineColor = theme === "light" ? "rgba(122,88,24,0.18)" : "rgba(240,207,122,0.22)";
  const boltColor = theme === "light" ? "rgba(199,154,62,0.85)" : "rgba(255,235,170,0.95)";
  // Deterministic node positions (percent-based so it scales with viewport).
  const nodes = [
    [6, 8], [14, 22], [4, 38], [10, 55], [18, 70], [7, 86], [22, 92],
    [94, 6], [86, 18], [96, 32], [88, 48], [94, 64], [82, 78], [92, 90],
    [30, 4], [70, 3], [50, 96],
  ] as const;
  const links: [number, number][] = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[1,3],
    [7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[8,10],
    [14,7],[15,0],[6,16],[13,16],
  ];
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ opacity: theme === "light" ? 0.45 : 0.6 }}
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id="ln-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {links.map(([a, b], i) => {
          const [x1, y1] = nodes[a];
          const [x2, y2] = nodes[b];
          return (
            <line
              key={i}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke={lineColor}
              strokeWidth={0.8}
              strokeDasharray="3 6"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-90"
                dur={`${8 + (i % 5)}s`}
                repeatCount="indefinite"
              />
            </line>
          );
        })}
        {nodes.map(([x, y], i) => (
          <g key={i} filter="url(#ln-glow)">
            <circle cx={`${x}%`} cy={`${y}%`} r={1.6} fill={nodeColor}>
              <animate
                attributeName="opacity"
                values="0.35;1;0.35"
                dur={`${3 + (i % 4)}s`}
                begin={`${(i % 6) * 0.4}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
        {/* occasional bolt flashes between paired nodes */}
        {[[0, 7], [6, 13], [14, 15]].map(([a, b], i) => {
          const [x1, y1] = nodes[a];
          const [x2, y2] = nodes[b];
          return (
            <line
              key={`bolt-${i}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke={boltColor}
              strokeWidth={1.2}
              strokeLinecap="round"
              opacity={0}
              filter="url(#ln-glow)"
            >
              <animate
                attributeName="opacity"
                values="0;0;0.9;0;0"
                dur="7s"
                begin={`${i * 2.3}s`}
                repeatCount="indefinite"
              />
            </line>
          );
        })}
      </svg>
    </div>
  );
}

/* ==================== NAV ==================== */
function LandingNav({ memberId }: { memberId: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#07080c]/85 backdrop-blur-xl border-b border-gold/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <img src={logoMark} alt="NASLAB" className="h-9 w-9 rounded-full ring-1 ring-gold/40" />
          <span className="font-serif text-lg font-semibold tracking-wide text-gold-shine">
            NASLAB
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {[
            ["Why NASLAB", "#why"],
            ["How it Works", "#how"],
            ["Packages", "#packages"],
            ["FAQ", "#faq"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[13px] font-medium text-foreground/70 transition-colors hover:text-gold"
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href={`/signup?ref=${memberId}`}
          className="group inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-gold/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-gold transition-all hover:bg-gold hover:text-[#0a0b10] hover:shadow-[0_0_30px_color-mix(in_oklab,var(--gold)_60%,transparent)]"
        >
          Join Now
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </header>
  );
}

/* ==================== HERO ==================== */
function Hero({ memberId, isPrint }: { memberId: string; isPrint: boolean }) {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Orbital rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2">
        <div className="orbit-spin-slow relative">
          <div className="h-[700px] w-[700px] rounded-full border border-gold/15" />
        </div>
        <div className="absolute inset-0 orbit-spin-rev">
          <div className="h-[900px] w-[900px] -translate-x-[100px] -translate-y-[100px] rounded-full border border-cyan/10"
               style={{ borderColor: "color-mix(in oklab, oklch(0.78 0.14 200) 14%, transparent)" }} />
        </div>
        <div className="orbit-spin-slow absolute inset-0">
          <div className="h-[1100px] w-[1100px] -translate-x-[200px] -translate-y-[200px] rounded-full border border-gold/8" />
        </div>
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute block h-1 w-1 rounded-full bg-gold/60 float-y"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              animationDelay: `${(i % 6) * 0.7}s`,
              boxShadow: "0 0 8px color-mix(in oklab, var(--gold) 80%, transparent)",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-gold/90"
        >
          <Sparkles className="h-3 w-3" />
          Personal Invitation · Member #{memberId}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[88px]"
        >
          <span className="text-gold-shine">Earn While</span>
          <br />
          <span className="text-foreground/95">the Market Sleeps</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground/65 sm:text-lg"
        >
          Institutional-grade MEV trading, powered by{" "}
          <span className="text-cyan-glow font-medium">Ncore 2.0 AI</span>. Now open
          to a private circle of members — including you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <a
            href={`/signup?ref=${memberId}`}
            className="landing-print-hide group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-gold via-amber-300 to-gold bg-[length:200%_auto] px-8 py-4 text-sm font-semibold text-[#0a0b10] shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--gold)_70%,transparent)] transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-[0_20px_60px_-10px_color-mix(in_oklab,var(--gold)_90%,transparent)]"
          >
            <span className="relative z-10">Start Earning Now</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#packages"
            className="landing-print-hide inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-white/5 px-8 py-4 text-sm font-medium text-foreground/85 backdrop-blur-md transition-all hover:border-gold/50 hover:bg-gold/5 hover:text-gold"
          >
            Explore Packages
          </a>
          {isPrint && (
            <div className="rounded-xl border border-gold/40 bg-[#0a0b10] p-3">
              <img
                alt="QR"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=1&format=png&ecc=H&data=${encodeURIComponent(
                  `https://invite.naslabtec.com/${memberId}`,
                )}`}
                className="h-32 w-32"
              />
              <p className="mt-2 text-center text-[9px] uppercase tracking-[0.2em] text-gold/70">
                Scan to Join
              </p>
            </div>
          )}
        </motion.div>

        {/* Live ticker glass */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mx-auto mt-16 flex max-w-md items-center justify-between gap-4 rounded-2xl landing-glass px-5 py-3 text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative block h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
              Live · Last 30 days
            </span>
          </div>
          <div className="text-right">
            <div className="font-serif text-2xl font-semibold text-gold-shine">8.42%</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">
              avg monthly ROI
            </div>
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-foreground/40 landing-print-hide">
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </div>
    </section>
  );
}

/* ==================== TRUST BAR ==================== */
function TrustBar() {
  const items = [
    { v: "$XX M+", l: "Assets Under Management" },
    { v: "12,000+", l: "Active Members" },
    { v: "36 mo", l: "Track Record" },
    { v: "24/7", l: "AI Trading Engine" },
  ];
  return (
    <section className="relative border-y border-gold/10 bg-[#06070b] py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
        {items.map((it) => (
          <div key={it.l} className="text-center">
            <div className="font-serif text-2xl font-semibold text-gold-shine sm:text-3xl">
              {it.v}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-foreground/45">
              {it.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==================== WHY ==================== */
function WhySection() {
  const cards = [
    {
      icon: Cpu,
      title: "Ncore 2.0 AI Engine",
      body: "Our proprietary neural core executes thousands of micro-trades per second across DEX liquidity pools — never sleeps, never panics.",
      accent: "gold",
    },
    {
      icon: Zap,
      title: "MEV Strategy",
      body: "Maximal Extractable Value: capture risk-managed arbitrage opportunities the moment they appear, before retail traders can react.",
      accent: "cyan",
    },
    {
      icon: Lock,
      title: "Transparent On-Chain",
      body: "Every position, every reward distribution recorded on-chain. Withdraw to your own wallet, anytime. Your keys, your control.",
      accent: "gold",
    },
  ];
  return (
    <section id="why" className="relative px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow>Why NASLAB</SectionEyebrow>
        <SectionTitle>
          Built for the <span className="text-gold-shine">next era</span> of digital wealth
        </SectionTitle>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="landing-glass group relative overflow-hidden rounded-2xl p-7"
            >
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                  c.accent === "cyan"
                    ? "bg-[color-mix(in_oklab,oklch(0.78_0.14_200)_15%,transparent)] text-cyan-glow ring-1 ring-[color-mix(in_oklab,oklch(0.78_0.14_200)_30%,transparent)]"
                    : "bg-gold/10 text-gold ring-1 ring-gold/30"
                }`}
              >
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/65">{c.body}</p>
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================== HOW IT WORKS ==================== */
function HowItWorks() {
  const steps = [
    { n: "01", t: "Sign Up", d: "Create your account in under 2 minutes using this invite." },
    { n: "02", t: "Choose Package", d: "Select Standard, Advance, or Premium based on your goals." },
    { n: "03", t: "Stake USDT", d: "Deposit on-chain. Funds are deployed by Ncore 2.0 instantly." },
    { n: "04", t: "Earn Daily", d: "Watch rewards accrue every day. Withdraw anytime." },
  ];
  return (
    <section id="how" className="relative px-4 py-28 sm:px-6 lg:px-8" style={{
      background: "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--gold) 4%, transparent) 50%, transparent 100%)"
    }}>
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow>The Process</SectionEyebrow>
        <SectionTitle>
          Four steps to <span className="text-gold-shine">passive yield</span>
        </SectionTitle>

        <div className="relative mt-16 grid gap-6 md:grid-cols-4">
          {/* connector line desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent md:block" />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center md:text-left"
            >
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#0a0b10] ring-1 ring-gold/40 md:mx-0">
                <span className="font-serif text-xl font-semibold text-gold">{s.n}</span>
                <span className="absolute inset-0 rounded-full ring-1 ring-gold/30 pulse-cyan" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================== PACKAGES ==================== */
function PackagesSection({ memberId }: { memberId: string }) {
  const tiers = [
    {
      name: "Standard",
      range: "4.5 – 7.5%",
      blurb: "Entry point into MEV trading.",
      features: [
        "Ncore 2.0 AI access",
        "Daily reward distribution",
        "On-chain transparency",
        "Standard support",
      ],
      highlighted: false,
    },
    {
      name: "Advance",
      range: "7.5 – 10.5%",
      blurb: "For serious wealth builders.",
      features: [
        "Everything in Standard",
        "Priority MEV opportunities",
        "Enhanced reward strategies",
        "Priority support",
      ],
      highlighted: true,
    },
    {
      name: "Premium",
      range: "10.5 – 13.5%",
      blurb: "Institutional-tier yield.",
      features: [
        "Everything in Advance",
        "Maximum allocation tier",
        "Concierge account manager",
        "VIP withdrawal channel",
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="packages" className="relative px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow>Packages</SectionEyebrow>
        <SectionTitle>
          Choose your <span className="text-gold-shine">tier</span>
        </SectionTitle>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-foreground/55">
          Estimated monthly ROI ranges based on market conditions and Ncore 2.0 performance.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative"
            >
              {tier.highlighted && (
                <>
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-gold via-gold/40 to-transparent opacity-80" />
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold to-amber-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0a0b10] shadow-lg">
                    Most Popular
                  </div>
                </>
              )}
              <div
                className={`relative h-full rounded-2xl p-8 ${
                  tier.highlighted
                    ? "bg-[#0a0b10] ring-1 ring-gold/0"
                    : "landing-glass"
                }`}
              >
                <h3 className="font-serif text-2xl font-semibold text-foreground">{tier.name}</h3>
                <p className="mt-1 text-sm text-foreground/55">{tier.blurb}</p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-serif text-4xl font-semibold text-gold-shine">
                    {tier.range}
                  </span>
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-foreground/45">
                  estimated / month
                </div>

                <ul className="mt-7 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`/signup?ref=${memberId}&plan=${tier.name.toLowerCase()}`}
                  className={`landing-print-hide mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-gold to-amber-300 text-[#0a0b10] hover:shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--gold)_80%,transparent)]"
                      : "border border-gold/40 text-gold hover:bg-gold/10"
                  }`}
                >
                  Choose {tier.name}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-[11px] leading-relaxed text-foreground/40">
          * Reference ROI ranges based on market conditions and Ncore 2.0 performance. Past
          performance does not guarantee future returns. Crypto investments carry risk.
        </p>
      </div>
    </section>
  );
}

/* ==================== STATS ==================== */
function StatsSection() {
  const stats = [
    { v: "$XX M+", l: "Total Rewards Distributed", icon: TrendingUp },
    { v: "12,000+", l: "Active Members Worldwide", icon: Users },
    { v: "8.4%", l: "Avg Monthly ROI (last 12 mo)", icon: LineChart },
    { v: "60+", l: "Countries Represented", icon: Globe2 },
  ];
  return (
    <section className="relative border-y border-gold/10 bg-[#05060a] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow>Proof in Numbers</SectionEyebrow>
        <SectionTitle>
          The numbers <span className="text-gold-shine">speak</span> for themselves
        </SectionTitle>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="landing-glass rounded-2xl p-6 text-center"
            >
              <s.icon className="mx-auto h-6 w-6 text-gold/70" />
              <div className="mt-3 font-serif text-3xl font-semibold text-gold-shine">{s.v}</div>
              <div className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-foreground/45">
                {s.l}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================== FOUNDER NOTE ==================== */
function FounderNote() {
  return (
    <section className="relative px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <SectionEyebrow>From the Founder</SectionEyebrow>
        <blockquote className="mt-8 font-serif text-2xl font-medium leading-relaxed text-foreground/85 sm:text-3xl">
          "We built NASLAB to give everyday investors the same edge that Wall Street trading
          desks have enjoyed for decades. Our AI doesn't sleep. Your wealth shouldn't either."
        </blockquote>
        <div className="mt-8">
          <div className="font-serif text-base font-semibold text-gold">NASLAB Founding Team</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-foreground/45">
            Building the future of decentralized yield
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================== FAQ ==================== */
function FaqSection() {
  const faqs = [
    {
      q: "What exactly is MEV trading?",
      a: "MEV (Maximal Extractable Value) refers to profit captured by reordering, including, or excluding transactions on the blockchain. Our Ncore 2.0 AI identifies and executes profitable MEV opportunities autonomously, 24/7.",
    },
    {
      q: "Is my capital safe?",
      a: "Funds are deployed via audited smart contracts on BNB Smart Chain. Your principal remains visible on-chain and you can withdraw at any time. As with all crypto investments, market risk applies.",
    },
    {
      q: "How are rewards distributed?",
      a: "Rewards accrue daily and are distributed automatically to your account balance. You can withdraw to your own wallet at any time with no lock-up period.",
    },
    {
      q: "What's the minimum to get started?",
      a: "The Standard package starts from a small entry stake. Full minimums for each tier are shown after you sign up using this invite.",
    },
    {
      q: "Do I need crypto experience?",
      a: "No. Our onboarding walks you through every step — from creating your account to making your first deposit. Support is available 24/7.",
    },
    {
      q: "Can I upgrade my package later?",
      a: "Yes. You can top up or upgrade to a higher tier at any time from inside your member portal.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionEyebrow>FAQ</SectionEyebrow>
        <SectionTitle>
          Questions, <span className="text-gold-shine">answered</span>
        </SectionTitle>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className="landing-glass overflow-hidden rounded-xl"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-serif text-base font-semibold text-foreground sm:text-lg">
                  {f.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-gold/10 px-6 py-5 text-sm leading-relaxed text-foreground/70">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================== FINAL CTA ==================== */
function FinalCta({ memberId, isPrint }: { memberId: string; isPrint: boolean }) {
  return (
    <section className="relative px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="luxe-border">
          <div className="relative overflow-hidden p-12 text-center sm:p-16">
            <div className="pointer-events-none absolute inset-0 opacity-50"
                 style={{
                   background: "radial-gradient(circle at 50% 0%, color-mix(in oklab, var(--gold) 20%, transparent), transparent 60%)",
                 }} />
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-gold/90">
                <Sparkles className="h-3 w-3" />
                Personal Invitation
              </div>
              <h2 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
                Start Your <span className="text-gold-shine">NASLAB</span> Journey
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base text-foreground/65">
                You were invited by Member <span className="font-mono text-gold">#{memberId}</span>.
                Join the private circle today.
              </p>

              {isPrint ? (
                <div className="mt-10 inline-flex flex-col items-center gap-3 rounded-2xl bg-white p-5">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=1&format=png&ecc=H&data=${encodeURIComponent(
                      `https://invite.naslabtec.com/${memberId}`,
                    )}`}
                    alt="QR"
                    className="h-44 w-44"
                  />
                  <div className="text-center">
                    <div className="font-mono text-xs text-[#0a0b10]">
                      invite.naslabtec.com/{memberId}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  href={`/signup?ref=${memberId}`}
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-amber-300 to-gold bg-[length:200%_auto] px-10 py-4 text-base font-semibold text-[#0a0b10] shadow-[0_15px_50px_-10px_color-mix(in_oklab,var(--gold)_80%,transparent)] transition-all duration-500 hover:bg-[position:100%_0] hover:shadow-[0_25px_70px_-10px_color-mix(in_oklab,var(--gold)_100%,transparent)]"
                >
                  Join with this Invite
                  <ArrowRight className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================== FOOTER ==================== */
function LandingFooter({ memberId }: { memberId: string }) {
  const socials = [
    { href: "https://t.me/NaslabMiddleEast", label: "Telegram", icon: TgIcon },
    { href: "https://x.com/NaslabTec", label: "X", icon: XIcon },
    { href: "https://www.instagram.com/naslab_tec/", label: "Instagram", icon: IgIcon },
    { href: "https://www.naslabtec.com", label: "Website", icon: Globe2 },
  ];
  return (
    <footer className="relative border-t border-gold/10 bg-[#05060a] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={logoMark} alt="NASLAB" className="h-9 w-9 rounded-full ring-1 ring-gold/40" />
            <span className="font-serif text-lg font-semibold text-gold-shine">NASLAB</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-foreground/55">
            Institutional-grade MEV trading powered by Ncore 2.0 AI. Building the future of
            decentralized yield.
          </p>
        </div>
        <div className="md:text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">Explore</div>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["Why NASLAB", "#why"],
              ["How it Works", "#how"],
              ["Packages", "#packages"],
              ["FAQ", "#faq"],
            ].map(([l, h]) => (
              <li key={h}>
                <a href={h} className="text-foreground/65 transition-colors hover:text-gold">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">Connect</div>
          <div className="mt-4 flex gap-3 md:justify-end">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-gold/80 transition-all hover:border-gold hover:bg-gold/15 hover:text-gold hover:shadow-[0_0_20px_color-mix(in_oklab,var(--gold)_50%,transparent)]"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <div className="mt-6 text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            Invite ID · <span className="font-mono text-gold/70">#{memberId}</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-gold/10 pt-6 text-center text-[11px] text-foreground/40">
        © {new Date().getFullYear()} NASLAB Technologies. All rights reserved.
      </div>
    </footer>
  );
}

/* ==================== HELPERS ==================== */
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center text-[10px] font-medium uppercase tracking-[0.28em] text-gold/70">
      {children}
    </div>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 text-center font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-[56px]">
      {children}
    </h2>
  );
}

/* Inline SVG socials we don't have in lucide */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.79l-4.62-6.04L5.2 22H2.44l6.98-7.97L2 2h6.91l4.18 5.53L18.24 2zM17.1 20h1.84L7.02 4H5.07L17.1 20z" />
    </svg>
  );
}
function IgIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
