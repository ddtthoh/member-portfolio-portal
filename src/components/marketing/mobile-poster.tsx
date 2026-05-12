import type { ReactNode } from "react";
import logoMark from "@/assets/participant-portal-logo.png";

/**
 * MobilePoster — single-piece, 1080px-wide vertical poster.
 * Optimized to be downloaded as ONE high-res PNG / single-page PDF
 * and forwarded natively on WhatsApp.
 *
 * Art direction: gold-on-obsidian, painted serif headlines, oversized numerals,
 * hairline gold rules, layered ornamental backgrounds.
 */
export function MobilePoster({ memberId }: { memberId: string }) {
  const inviteUrl = `https://invite.naslabtec.com/${memberId}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=1&format=png&ecc=H&color=0a0a0a&bgcolor=ffffff&data=${encodeURIComponent(
    inviteUrl,
  )}`;

  const tiers = [
    {
      name: "STANDARD",
      roman: "I",
      daily: "0.15 – 0.25%",
      monthly: "4.5 – 7.5%",
      tagline: "An entry into algorithmic yield.",
    },
    {
      name: "ADVANCE",
      roman: "II",
      daily: "0.25 – 0.35%",
      monthly: "7.5 – 10.5%",
      tagline: "For the patient compounder.",
      featured: true,
    },
    {
      name: "PREMIUM",
      roman: "III",
      daily: "0.35 – 0.45%",
      monthly: "10.5 – 13.5%",
      tagline: "Institutional-tier execution.",
    },
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
          "radial-gradient(120% 70% at 50% 0%, #221806 0%, #0e0a05 35%, #050302 100%)",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      }}
    >
      {/* ============= AMBIENT LAYERS ============= */}
      <Ornaments />

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
          className="mt-12 font-serif font-black leading-[0.95] tracking-tight"
          style={{
            fontSize: "128px",
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
          NASLAB is a platform focused on blockchain trading strategies and automated execution
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
          <Eyebrow>Estimated Monthly ROI</Eyebrow>
          <H2>
            From <span style={gold()}>4.5%</span> to <span style={gold()}>13.5%</span> a month.
          </H2>
          <Filigree className="mt-8" />
          <p className="mx-auto mt-6 max-w-[820px] text-[20px] leading-[1.55] text-white/60">
            Three private tiers, each with reference ROI ranges based on market conditions,
            strategy performance and the actual execution results of Ncore 2.0.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-5">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative overflow-hidden rounded-[22px] border p-9 text-center ${
                t.featured
                  ? "border-[#e6c473] bg-gradient-to-b from-[#2a1d08] via-[#15100a] to-[#0d0a05] shadow-[0_40px_100px_-25px_rgba(212,170,80,0.7)]"
                  : "border-[#d4aa50]/30 bg-gradient-to-b from-[#1a1207] via-[#0e0a05] to-[#080604]"
              }`}
            >
              {/* corner ornaments */}
              <CornerOrnaments />

              {t.featured && (
                <div
                  className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-lg px-4 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#0a0805]"
                  style={{
                    background:
                      "linear-gradient(90deg,#f0cf7a 0%,#fff5d4 50%,#c79a3e 100%)",
                  }}
                >
                  ★ Most Chosen
                </div>
              )}

              <div className="relative">
                <div
                  className="mx-auto mt-3 font-serif text-[28px] font-black tracking-[0.2em]"
                  style={gold()}
                >
                  {t.name}
                </div>
                <div
                  className="mt-1 font-serif text-[15px] italic tracking-wider text-[#d4aa50]/70"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Tier {t.roman}
                </div>

                <div className="mx-auto my-6 flex items-center justify-center gap-3">
                  <div className="h-px w-10 bg-[#d4aa50]/40" />
                  <div className="text-[10px] tracking-[0.4em] text-[#d4aa50]/60">✦</div>
                  <div className="h-px w-10 bg-[#d4aa50]/40" />
                </div>

                <div
                  className="font-serif font-black leading-none"
                  style={{ fontSize: "52px", ...gold() }}
                >
                  {t.monthly}
                </div>
                <div className="mt-2 text-[12px] uppercase tracking-[0.3em] text-white/50">
                  Estimated / month
                </div>

                <div className="mt-6 rounded-xl border border-[#d4aa50]/20 bg-[#0a0805]/60 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                    Daily reference
                  </div>
                  <div className="mt-1 font-serif text-[22px] font-bold text-[#f0cf7a]">
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
              className="mt-6 font-serif font-black leading-[1.05]"
              style={{ fontSize: "84px", ...gold("strong") }}
            >
              Join NASLAB Today
            </h2>
            <p className="mx-auto mt-6 max-w-[760px] text-[22px] leading-[1.55] text-white/75">
              Discover how NASLAB captures on-chain trading opportunities through the Ncore 2.0
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
          NASLAB Technologies · Powered by Ncore 2.0
        </div>
        <div className="mt-2 text-[12px] text-white/30">
          © {new Date().getFullYear()} NASLAB. All rights reserved. · Member #{memberId}
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
            "radial-gradient(circle at 20% 8%, rgba(212,170,80,0.2), transparent 38%), radial-gradient(circle at 80% 92%, rgba(212,170,80,0.16), transparent 45%)",
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
  const s = large ? 36 : 24;
  const Corner = ({ pos }: { pos: string }) => (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${pos}`}
      style={{ width: s, height: s }}
    >
      <div className="absolute inset-0 border-[#e6c473]/60" />
    </div>
  );
  return (
    <>
      <span className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l border-t border-[#e6c473]/50" />
      <span className="pointer-events-none absolute right-3 top-3 h-6 w-6 border-r border-t border-[#e6c473]/50" />
      <span className="pointer-events-none absolute left-3 bottom-3 h-6 w-6 border-l border-b border-[#e6c473]/50" />
      <span className="pointer-events-none absolute right-3 bottom-3 h-6 w-6 border-r border-b border-[#e6c473]/50" />
      {large ? <Corner pos="hidden" /> : null}
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
