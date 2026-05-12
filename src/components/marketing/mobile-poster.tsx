import type { ReactNode } from "react";
import logoMark from "@/assets/participant-portal-logo.png";

/**
 * MobilePoster — single-piece, 1080px-wide vertical poster.
 * Optimized to be downloaded as ONE high-res PNG / single-page PDF
 * and forwarded natively on WhatsApp.
 *
 * Art direction: gold-on-obsidian, painted serif headlines, oversized numerals,
 * hairline gold rules, layered ornamental backgrounds, sparkles + bokeh glow.
 */
export function MobilePoster({ memberId }: { memberId: string }) {
  const inviteUrl = `https://invite.naslabtec.com/${memberId}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=1&format=png&ecc=H&color=0a0a0a&bgcolor=ffffff&data=${encodeURIComponent(
    inviteUrl,
  )}`;

  const tiers = [
    { name: "STANDARD", daily: "0.15 – 0.25%", monthly: "4.5 – 7.5%", tagline: "An entry into algorithmic yield." },
    { name: "ADVANCE", daily: "0.25 – 0.35%", monthly: "7.5 – 10.5%", tagline: "For the patient compounder." },
    { name: "PREMIUM", daily: "0.35 – 0.45%", monthly: "10.5 – 13.5%", tagline: "Institutional-tier execution." },
  ];

  const focus = [
    {
      n: "01",
      t: "MEV Trading Strategies",
      d: "Analyze price differences, arbitrage opportunities and transaction sequencing on-chain through Ncore 2.0.",
    },
    {
      n: "02",
      t: "Automated Execution System",
      d: "Ncore 2.0 improves trading execution efficiency and removes manual operation delays.",
    },
    {
      n: "03",
      t: "Market Opportunity Capture",
      d: "Continuously monitor the fast-moving on-chain market to capture potential trading opportunities.",
    },
  ];

  return (
    <div
      className="poster-root relative mx-auto overflow-hidden text-white"
      style={{
        width: "1080px",
        background:
          "radial-gradient(120% 70% at 50% 0%, #2a1d08 0%, #14100a 30%, #07050a 65%, #030206 100%)",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      }}
    >
      {/* ============= AMBIENT LAYERS ============= */}
      <Ornaments />
      <Sparkles />
      <BokehGlow />

      {/* ============= HERO ============= */}
      <section className="relative px-16 pt-24 pb-28 text-center">
        <div className="flex items-center justify-center gap-5">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-2 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #f0cf7a, #7a5818, #f0cf7a, #c79a3e, #f0cf7a)",
                filter: "blur(6px)",
                opacity: 0.55,
              }}
            />
            <img
              src={logoMark}
              alt="NASLAB"
              className="relative h-20 w-20 rounded-full ring-2 ring-[#e6c473]/70"
            />
          </div>
          <div className="text-left">
            <div
              className="font-serif text-4xl font-bold tracking-[0.22em]"
              style={gold()}
            >
              NASLAB
            </div>
            <div className="mt-1 text-[13px] uppercase tracking-[0.32em] text-[#d4aa50]/80">
              Powered by Ncore 2.0
            </div>
          </div>
        </div>

        <Filigree className="mt-10" />

        <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full border border-[#d4aa50]/40 bg-gradient-to-b from-[#d4aa50]/15 to-transparent px-7 py-2.5 text-[12px] uppercase tracking-[0.34em] text-[#e6c473]">
          ✦ Personal Invitation · Member #{memberId} ✦
        </div>

        <h1
          className="mt-12 font-serif font-black tracking-tight"
          style={{
            fontSize: "128px",
            lineHeight: 1.05,
            paddingBottom: "0.12em",
            ...gold("strong"),
            textShadow: "0 8px 80px rgba(212,170,80,0.45)",
          }}
        >
          Earn While
          <br />
          the Market
          <br />
          <em
            className="not-italic"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontWeight: 700,
            }}
          >
            Sleeps.
          </em>
        </h1>

        <p className="mx-auto mt-12 max-w-[820px] text-[26px] leading-[1.5] text-white/75">
          An intelligent trading platform for on-chain market opportunities — institutional-grade
          MEV strategies executed 24/7 by the{" "}
          <span className="text-[#e6c473]">Ncore 2.0</span> AI engine.
        </p>

        {/* hero stat strip */}
        <div className="mt-16 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[#d4aa50]/30 bg-[#d4aa50]/30 shadow-[0_30px_80px_-30px_rgba(212,170,80,0.45)]">
          {[
            { v: "0.45%", l: "Daily peak ROI" },
            { v: "13.5%", l: "Monthly peak ROI" },
            { v: "24/7", l: "AI Execution" },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-gradient-to-b from-[#0e0a05] to-[#080604] px-6 py-9"
            >
              <div
                className="font-serif text-[60px] font-bold leading-none"
                style={gold()}
              >
                {s.v}
              </div>
              <div className="mt-3 text-[13px] uppercase tracking-[0.24em] text-white/55">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ============= COMPANY INTRO ============= */}
      <section className="relative px-16 py-20 text-center">
        <Eyebrow>Company Introduction</Eyebrow>
        <H2>An institutional engine, opened to a private circle.</H2>
        <Filigree className="mt-8" />
        <p className="mx-auto mt-8 max-w-[860px] text-[24px] leading-[1.55] text-white/70">
          Naslab is a platform focused on blockchain trading strategies and automated execution
          systems. Through the <span className="text-[#e6c473]">Ncore 2.0</span> technology
          system, we specialize in MEV trading by analyzing on-chain data, market liquidity and
          transaction opportunities — delivering a more efficient digital asset trading solution.
        </p>
      </section>

      <Divider />

      {/* ============= CORE FOCUS ============= */}
      <section className="relative px-16 py-20">
        <div className="text-center">
          <Eyebrow>Core Focus</Eyebrow>
          <H2>Three pillars. One unfair advantage.</H2>
        </div>

        <div className="mt-14 space-y-6">
          {focus.map((f) => (
            <div
              key={f.n}
              className="relative overflow-hidden rounded-2xl border border-[#d4aa50]/25 bg-gradient-to-br from-[#1c1408] via-[#0d0a05] to-[#0a0805] p-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 100% at 0% 0%, rgba(212,170,80,0.12), transparent 60%)",
                }}
              />
              <div className="relative flex items-start gap-8">
                <div
                  className="font-serif text-[96px] font-black leading-none"
                  style={gold("dark")}
                >
                  {f.n}
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="font-serif text-[34px] font-bold text-[#f0cf7a]">{f.t}</h3>
                  <p className="mt-3 text-[20px] leading-[1.55] text-white/70">{f.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ============= PACKAGES ============= */}
      <section className="relative px-16 py-20">
        <div className="text-center">
          <Eyebrow>Estimated Returns</Eyebrow>
          <H2>
            From <span style={gold()}>4.5%</span> to <span style={gold()}>13.5%</span> a month.
          </H2>
          <Filigree className="mt-8" />
          <p className="mx-auto mt-6 max-w-[820px] text-[20px] leading-[1.55] text-white/60">
            Three private tiers, each with reference ROI ranges based on market conditions,
            strategy performance and the actual execution results of Ncore 2.0.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className="relative overflow-hidden rounded-[24px] border border-[#e6c473] bg-gradient-to-b from-[#2a1d08] via-[#15100a] to-[#0d0a05] p-9 text-center shadow-[0_40px_100px_-25px_rgba(212,170,80,0.7)]"
            >
              <CornerOrnaments />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[24px]"
                style={{
                  background:
                    "radial-gradient(80% 60% at 50% 0%, rgba(240,207,122,0.2), transparent 60%)",
                }}
              />

              <div className="relative">
                <div
                  className="mx-auto mt-2 font-serif text-[30px] font-black tracking-[0.22em]"
                  style={gold()}
                >
                  {t.name}
                </div>

                <div className="mx-auto my-7 flex items-center justify-center gap-3">
                  <div className="h-px w-10 bg-[#d4aa50]/40" />
                  <div className="text-[10px] tracking-[0.4em] text-[#d4aa50]/60">✦</div>
                  <div className="h-px w-10 bg-[#d4aa50]/40" />
                </div>

                {/* Monthly — primary */}
                <div className="text-[10px] uppercase tracking-[0.35em] text-[#d4aa50]/70">
                  Monthly
                </div>
                <div
                  className="mt-2 font-serif font-black leading-none"
                  style={{ fontSize: "44px", ...gold() }}
                >
                  {t.monthly}
                </div>

                {/* Daily — secondary */}
                <div className="mt-7 rounded-xl border border-[#d4aa50]/25 bg-[#0a0805]/70 px-4 py-4">
                  <div className="text-[10px] uppercase tracking-[0.35em] text-white/45">
                    Daily
                  </div>
                  <div className="mt-1.5 font-serif text-[24px] font-bold text-[#f0cf7a]">
                    {t.daily}
                  </div>
                </div>

                <p className="mt-6 text-[14px] italic leading-relaxed text-white/55">
                  {t.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-[820px] text-center text-[13px] leading-relaxed text-white/40">
          * Reference ranges only. Past performance does not guarantee future returns.
          Crypto investments carry risk.
        </p>
      </section>

      <Divider />

      {/* ============= CTA + QR ============= */}
      <section className="relative px-16 py-20">
        <div className="relative overflow-hidden rounded-[40px] border border-[#d4aa50]/50 bg-gradient-to-br from-[#2a1d08] via-[#0d0a05] to-[#0a0805] p-14 text-center shadow-[0_50px_120px_-30px_rgba(212,170,80,0.5)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(212,170,80,0.4), transparent 60%)",
            }}
          />
          <CornerOrnaments large />
          <div className="relative">
            <Eyebrow>Start Your Journey</Eyebrow>
            <h2
              className="mt-6 font-serif font-black"
              style={{
                fontSize: "84px",
                lineHeight: 1.15,
                paddingBottom: "0.16em",
                ...gold("strong"),
              }}
            >
              Join Naslab Today
            </h2>
            <p className="mx-auto mt-6 max-w-[760px] text-[22px] leading-[1.55] text-white/75">
              Discover how Naslab captures on-chain trading opportunities through the Ncore 2.0
              technology system. Scan the QR or visit the link below.
            </p>

            <div className="mt-12 flex items-center justify-center gap-12">
              <div className="rounded-3xl bg-white p-5 shadow-[0_30px_80px_-15px_rgba(212,170,80,0.5)]">
                <img src={qrSrc} alt="QR" className="h-[280px] w-[280px]" />
                <div className="mt-3 text-center font-mono text-[12px] text-[#0a0805]">
                  Scan to join
                </div>
              </div>
              <div className="text-left">
                <div className="text-[14px] uppercase tracking-[0.3em] text-[#d4aa50]/70">
                  Invite Link
                </div>
                <div className="mt-3 font-mono text-[28px] font-bold text-[#f0cf7a]">
                  invite.naslabtec.com
                </div>
                <div className="mt-1 font-mono text-[40px] font-black text-white">
                  /{memberId}
                </div>
                <div
                  className="mt-7 inline-flex items-center gap-3 rounded-full px-9 py-4 text-[18px] font-bold text-[#0a0805]"
                  style={{
                    background:
                      "linear-gradient(90deg,#fff5d4 0%,#f0cf7a 50%,#c79a3e 100%)",
                    boxShadow: "0 20px 50px -15px rgba(240,207,122,0.7)",
                  }}
                >
                  Sign Up Now →
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= FOOTER ============= */}
      <footer className="relative px-16 pb-16 pt-4 text-center">
        <Filigree />
        <div className="mt-6 text-[13px] uppercase tracking-[0.32em] text-white/40">
          Naslab Technologies · Powered by Ncore 2.0
        </div>
        <div className="mt-2 text-[12px] text-white/30">
          © {new Date().getFullYear()} Naslab. All rights reserved. · Member #{memberId}
        </div>
      </footer>
    </div>
  );
}

/* ─────────────── helpers ─────────────── */

function gold(variant: "default" | "strong" | "dark" = "default") {
  const grads = {
    default: "linear-gradient(180deg,#fff5d4 0%,#e6c473 55%,#9c7322 100%)",
    strong: "linear-gradient(180deg,#fff8dc 0%,#f0cf7a 28%,#c79a3e 62%,#7a5818 100%)",
    dark: "linear-gradient(180deg,#f0cf7a 0%,#9c7322 100%)",
  };
  return {
    background: grads[variant],
    WebkitBackgroundClip: "text" as const,
    backgroundClip: "text" as const,
    color: "transparent",
  };
}

function Ornaments() {
  return (
    <>
      {/* gold radial vignettes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 8%, rgba(212,170,80,0.25), transparent 38%), radial-gradient(circle at 80% 92%, rgba(212,170,80,0.18), transparent 45%), radial-gradient(circle at 50% 50%, rgba(120,80,200,0.06), transparent 60%)",
        }}
      />
      {/* fine grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,170,80,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,170,80,0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(80% 60% at 50% 30%, black 30%, transparent 80%)",
        }}
      />
      {/* film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </>
  );
}

/** Sparkles — distributed star/diamond glints across the canvas */
function Sparkles() {
  // deterministic positions for SSR + capture stability
  const stars = [
    { x: 6, y: 4, s: 14, o: 0.9 },
    { x: 14, y: 22, s: 10, o: 0.6 },
    { x: 92, y: 12, s: 18, o: 0.85 },
    { x: 88, y: 30, s: 9, o: 0.55 },
    { x: 4, y: 48, s: 12, o: 0.7 },
    { x: 96, y: 56, s: 14, o: 0.7 },
    { x: 10, y: 72, s: 10, o: 0.6 },
    { x: 90, y: 80, s: 16, o: 0.85 },
    { x: 50, y: 6, s: 8, o: 0.5 },
    { x: 30, y: 95, s: 11, o: 0.65 },
    { x: 70, y: 97, s: 13, o: 0.7 },
    { x: 20, y: 38, s: 7, o: 0.45 },
    { x: 80, y: 44, s: 8, o: 0.5 },
    { x: 25, y: 60, s: 9, o: 0.55 },
    { x: 75, y: 65, s: 10, o: 0.6 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {stars.map((st, i) => (
        <Sparkle key={i} xPct={st.x} yPct={st.y} size={st.s} opacity={st.o} />
      ))}
    </div>
  );
}

function Sparkle({ xPct, yPct, size, opacity }: { xPct: number; yPct: number; size: number; opacity: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={{
        position: "absolute",
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: "translate(-50%, -50%)",
        opacity,
        filter: "drop-shadow(0 0 6px rgba(255,225,140,0.85))",
      }}
    >
      <path
        d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
        fill="url(#sg)"
      />
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="100%" stopColor="#e6c473" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Soft bokeh glow circles for depth */
function BokehGlow() {
  const blobs = [
    { x: "8%", y: "18%", size: 220, c: "rgba(240,207,122,0.18)" },
    { x: "92%", y: "10%", size: 180, c: "rgba(199,154,62,0.18)" },
    { x: "5%", y: "62%", size: 260, c: "rgba(212,170,80,0.14)" },
    { x: "95%", y: "70%", size: 220, c: "rgba(240,207,122,0.16)" },
    { x: "50%", y: "40%", size: 320, c: "rgba(120,80,200,0.07)" },
    { x: "30%", y: "85%", size: 200, c: "rgba(240,207,122,0.12)" },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${b.c} 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />
      ))}
    </div>
  );
}

function Filigree({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#d4aa50]/60" />
      <div className="text-[14px] tracking-[0.4em] text-[#d4aa50]/70">✦ ✦ ✦</div>
      <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#d4aa50]/60" />
    </div>
  );
}

function CornerOrnaments({ large = false }: { large?: boolean }) {
  void large;
  return (
    <>
      <span className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l border-t border-[#e6c473]/50" />
      <span className="pointer-events-none absolute right-3 top-3 h-6 w-6 border-r border-t border-[#e6c473]/50" />
      <span className="pointer-events-none absolute left-3 bottom-3 h-6 w-6 border-l border-b border-[#e6c473]/50" />
      <span className="pointer-events-none absolute right-3 bottom-3 h-6 w-6 border-r border-b border-[#e6c473]/50" />
    </>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center px-16">
      <div className="flex w-full max-w-[400px] items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4aa50]/40 to-[#d4aa50]/60" />
        <div className="text-[10px] tracking-[0.4em] text-[#d4aa50]/60">✦</div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#d4aa50]/40 to-[#d4aa50]/60" />
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="text-[14px] font-semibold uppercase tracking-[0.42em] text-[#d4aa50]/85">
      {children}
    </div>
  );
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2
      className="mt-5 font-serif font-bold leading-[1.1]"
      style={{ fontSize: "64px", ...gold() }}
    >
      {children}
    </h2>
  );
}
