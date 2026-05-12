import type { ReactNode } from "react";
import logoMark from "@/assets/participant-portal-logo.png";

/**
 * MobilePoster — single-piece, 1080px-wide vertical poster designed to be:
 *  - downloaded as ONE high-res PNG / single-page PDF
 *  - viewed natively on mobile (forwarded via WhatsApp)
 *
 * Art direction inspired by 黄金猎人 2.0 / TP Trader poster:
 * gold-on-black, painted serif headline, oversized numerals, bold vertical rhythm.
 *
 * Content sourced from Landing_page_1.pdf (NASLAB / Ncore 2.0).
 */
export function MobilePoster({ memberId }: { memberId: string }) {
  const inviteUrl = `https://invite.naslabtec.com/${memberId}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=1&format=png&ecc=H&color=0a0a0a&bgcolor=ffffff&data=${encodeURIComponent(
    inviteUrl,
  )}`;

  const tiers = [
    {
      name: "STANDARD",
      daily: "0.20%",
      monthly: "6.00%",
      levels: [
        { l: "LITE", v: "100" },
        { l: "PLUS", v: "300" },
        { l: "PRO", v: "500" },
      ],
    },
    {
      name: "ADVANCE",
      daily: "0.30%",
      monthly: "9.00%",
      levels: [
        { l: "LITE", v: "1,000" },
        { l: "PLUS", v: "3,000" },
        { l: "PRO", v: "5,000" },
      ],
      featured: true,
    },
    {
      name: "PREMIUM",
      daily: "0.40%",
      monthly: "12.00%",
      levels: [
        { l: "LITE", v: "10,000" },
        { l: "PLUS", v: "30,000" },
        { l: "PRO", v: "50,000" },
      ],
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
          "radial-gradient(120% 60% at 50% 0%, #1a1407 0%, #0a0805 35%, #050403 100%)",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      }}
    >
      {/* subtle gold grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(212,170,80,0.18), transparent 40%), radial-gradient(circle at 80% 90%, rgba(212,170,80,0.14), transparent 45%)",
        }}
      />

      {/* ============= HERO ============= */}
      <section className="relative px-16 pt-20 pb-24 text-center">
        <div className="flex items-center justify-center gap-4">
          <img src={logoMark} alt="NASLAB" className="h-20 w-20 rounded-full ring-2 ring-[#d4aa50]/60" />
          <div className="text-left">
            <div
              className="font-serif text-4xl font-bold tracking-[0.2em]"
              style={{
                background:
                  "linear-gradient(180deg,#fff5d4 0%,#e6c473 35%,#9c7322 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              NASLAB
            </div>
            <div className="mt-1 text-[13px] uppercase tracking-[0.32em] text-[#d4aa50]/80">
              Powered by Ncore 2.0
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 inline-flex items-center gap-3 rounded-full border border-[#d4aa50]/40 bg-[#d4aa50]/10 px-6 py-2 text-[13px] uppercase tracking-[0.3em] text-[#e6c473]">
          ✦ Personal Invitation · Member #{memberId} ✦
        </div>

        <h1
          className="mt-12 font-serif font-black leading-[0.95] tracking-tight"
          style={{
            fontSize: "120px",
            background:
              "linear-gradient(180deg,#fff5d4 0%,#f0cf7a 30%,#c79a3e 65%,#7a5818 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "0 8px 60px rgba(212,170,80,0.35)",
          }}
        >
          Earn While
          <br />
          the Market
          <br />
          Sleeps.
        </h1>

        <p className="mx-auto mt-10 max-w-[820px] text-[26px] leading-[1.5] text-white/75">
          An intelligent trading platform for on-chain market opportunities — institutional-grade
          MEV strategies executed 24/7 by the <span className="text-[#e6c473]">Ncore 2.0</span> AI engine.
        </p>

        {/* hero stat strip */}
        <div className="mt-16 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[#d4aa50]/30 bg-[#d4aa50]/20">
          {[
            { v: "0.40%", l: "Daily peak ROI" },
            { v: "12%", l: "Monthly peak ROI" },
            { v: "24/7", l: "AI Execution" },
          ].map((s) => (
            <div key={s.l} className="bg-[#0a0805] px-6 py-8">
              <div
                className="font-serif text-[56px] font-bold leading-none"
                style={{
                  background:
                    "linear-gradient(180deg,#fff5d4 0%,#e6c473 60%,#9c7322 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {s.v}
              </div>
              <div className="mt-3 text-[14px] uppercase tracking-[0.22em] text-white/55">
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
              className="relative overflow-hidden rounded-2xl border border-[#d4aa50]/25 bg-gradient-to-br from-[#1a1207] via-[#0d0a05] to-[#0a0805] p-10"
            >
              <div className="flex items-start gap-8">
                <div
                  className="font-serif text-[88px] font-black leading-none"
                  style={{
                    background:
                      "linear-gradient(180deg,#f0cf7a 0%,#9c7322 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {f.n}
                </div>
                <div className="flex-1 pt-2">
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
          <Eyebrow>Estimated Monthly ROI Range</Eyebrow>
          <H2>Choose your tier.</H2>
          <p className="mx-auto mt-6 max-w-[820px] text-[20px] leading-[1.55] text-white/60">
            NASLAB provides a reference ROI range based on different packages, market conditions,
            strategy performance and the actual execution results of Ncore 2.0.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-5">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative overflow-hidden rounded-2xl border p-8 text-center ${
                t.featured
                  ? "border-[#e6c473] bg-gradient-to-b from-[#2a1d08] to-[#0d0a05] shadow-[0_30px_80px_-20px_rgba(212,170,80,0.6)]"
                  : "border-[#d4aa50]/30 bg-gradient-to-b from-[#1a1207] to-[#0a0805]"
              }`}
            >
              {t.featured && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 rounded-b-lg bg-gradient-to-r from-[#f0cf7a] to-[#c79a3e] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0a0805]">
                  ★ Featured
                </div>
              )}
              <div
                className="mt-2 font-serif text-[28px] font-black tracking-[0.18em]"
                style={{
                  background:
                    "linear-gradient(180deg,#fff5d4 0%,#e6c473 60%,#9c7322 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {t.name}
              </div>
              <div className="mx-auto my-5 h-px w-16 bg-[#d4aa50]/40" />
              <div className="space-y-1 text-[15px] text-white/75">
                <div>
                  Daily profits <span className="text-[#e6c473] font-semibold">{t.daily} +/-</span>
                </div>
                <div>
                  Monthly profits{" "}
                  <span className="text-[#e6c473] font-semibold">{t.monthly} +/-</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {t.levels.map((lv) => (
                  <div
                    key={lv.l}
                    className="rounded-xl border border-[#d4aa50]/20 bg-[#0a0805]/60 px-4 py-3"
                  >
                    <div className="font-serif text-[20px] font-bold text-[#f0cf7a]">{lv.l}</div>
                    <div className="mt-1 text-[13px] uppercase tracking-[0.16em] text-white/55">
                      Stake {lv.v} USDT
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-[820px] text-center text-[14px] leading-relaxed text-white/40">
          * Reference ranges only. Past performance does not guarantee future returns. Crypto
          investments carry risk.
        </p>
      </section>

      <Divider />

      {/* ============= CTA + QR ============= */}
      <section className="relative px-16 py-20">
        <div className="relative overflow-hidden rounded-[36px] border border-[#d4aa50]/50 bg-gradient-to-br from-[#2a1d08] via-[#0d0a05] to-[#0a0805] p-14 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(212,170,80,0.35), transparent 60%)",
            }}
          />
          <div className="relative">
            <Eyebrow>Start Your Journey</Eyebrow>
            <h2
              className="mt-6 font-serif font-black leading-[1.05]"
              style={{
                fontSize: "84px",
                background:
                  "linear-gradient(180deg,#fff5d4 0%,#e6c473 50%,#9c7322 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Join NASLAB Today
            </h2>
            <p className="mx-auto mt-6 max-w-[760px] text-[22px] leading-[1.55] text-white/75">
              Discover how NASLAB captures on-chain trading opportunities through the Ncore 2.0
              technology system. Scan the QR or visit the link below.
            </p>

            <div className="mt-12 flex items-center justify-center gap-12">
              <div className="rounded-3xl bg-white p-5 shadow-[0_20px_60px_-10px_rgba(212,170,80,0.4)]">
                <img src={qrSrc} alt="QR" className="h-[280px] w-[280px]" />
                <div className="mt-3 text-center font-mono text-[12px] text-[#0a0805]">
                  Scan to join
                </div>
              </div>
              <div className="text-left">
                <div className="text-[14px] uppercase tracking-[0.28em] text-[#d4aa50]/70">
                  Invite Link
                </div>
                <div className="mt-3 font-mono text-[28px] font-bold text-[#f0cf7a]">
                  invite.naslabtec.com
                </div>
                <div className="mt-1 font-mono text-[40px] font-black text-white">
                  /{memberId}
                </div>
                <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#f0cf7a] to-[#c79a3e] px-8 py-4 text-[18px] font-bold text-[#0a0805]">
                  Sign Up Now →
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= FOOTER ============= */}
      <footer className="relative px-16 pb-16 pt-4 text-center">
        <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[#d4aa50]/50 to-transparent" />
        <div className="mt-6 text-[13px] uppercase tracking-[0.3em] text-white/40">
          NASLAB Technologies · Powered by Ncore 2.0
        </div>
        <div className="mt-2 text-[12px] text-white/30">
          © {new Date().getFullYear()} NASLAB. All rights reserved. · Member #{memberId}
        </div>
      </footer>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center px-16">
      <div className="h-px w-full max-w-[300px] bg-gradient-to-r from-transparent via-[#d4aa50]/40 to-transparent" />
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="text-[14px] font-semibold uppercase tracking-[0.4em] text-[#d4aa50]/80">
      {children}
    </div>
  );
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2
      className="mt-5 font-serif font-bold leading-[1.1]"
      style={{
        fontSize: "64px",
        background: "linear-gradient(180deg,#fff5d4 0%,#e6c473 60%,#9c7322 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </h2>
  );
}
