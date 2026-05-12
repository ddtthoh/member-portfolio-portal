import { useState, type ReactNode } from "react";
import logoMark from "@/assets/participant-portal-logo.png";
import { CountUp } from "@/components/count-up";

type Theme = "light" | "dark";

/**
 * MobilePoster — single-piece, 1080px-wide vertical poster.
 * Theme-aware (light / dark) so it mirrors the portal's current mode.
 *
 * `animate` enables count-up effects and component motion. We keep it OFF
 * for the portal preview / PNG-PDF capture (so html2canvas grabs the final
 * numbers, not 0) and ON for the public /invite/:memberId landing page.
 */
export function MobilePoster({
  memberId,
  theme = "dark",
  animate = false,
}: {
  memberId: string;
  theme?: Theme;
  animate?: boolean;
}) {
  const inviteUrl = `https://invite.naslabtec.com/${memberId}`;
  const t = palette(theme);
  const qrFg = "0a0805";
  const qrBg = "ffffff";
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=1&format=png&ecc=H&color=${qrFg}&bgcolor=${qrBg}&data=${encodeURIComponent(
    inviteUrl,
  )}`;
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = inviteUrl;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

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
      className="poster-root relative mx-auto overflow-hidden"
      style={{
        width: "1080px",
        background: t.pageBg,
        color: t.text,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      }}
    >
      {/* ============= AMBIENT LAYERS ============= */}
      <Ornaments theme={theme} />
      <BokehGlow theme={theme} />

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
            <div className="font-serif text-4xl font-bold tracking-[0.22em]" style={gold()}>
              NASLAB
            </div>
            <div
              className="mt-1 text-[13px] uppercase tracking-[0.32em]"
              style={{ color: t.eyebrow }}
            >
              Powered by Ncore 2.0
            </div>
          </div>
        </div>

        <Filigree className="mt-10" />

        <div
          className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full px-7 py-2.5 text-[12px] uppercase tracking-[0.34em]"
          style={{
            border: `1px solid ${t.goldBorder}`,
            background: t.chipBg,
            color: t.goldStrong,
          }}
        >
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

        <p
          className="mx-auto mt-12 max-w-[820px] text-[26px] leading-[1.5]"
          style={{ color: t.body }}
        >
          An intelligent trading platform for on-chain market opportunities — institutional-grade
          MEV strategies executed 24/7 by the{" "}
          <span style={{ color: t.goldStrong }}>Ncore 2.0</span> AI engine.
        </p>

        {/* hero stat strip */}
        <div
          className="mt-16 grid grid-cols-3 gap-px overflow-hidden rounded-2xl"
          style={{
            border: `1px solid ${t.goldBorder}`,
            background: t.goldBorder,
            boxShadow: `0 30px 80px -30px ${t.goldGlow}`,
          }}
        >
          {[
            { v: 0.45, decimals: 2, suffix: "%", l: "Daily peak ROI" },
            { v: 13.5, decimals: 1, suffix: "%", l: "Monthly peak ROI" },
            { v: 24, decimals: 0, suffix: "/7", l: "AI Execution" },
          ].map((s) => (
            <div key={s.l} className="px-6 py-9" style={{ background: t.surface }}>
              <div
                className="font-serif text-[60px] font-bold leading-none"
                style={gold()}
              >
                {animate ? (
                  <CountUp value={s.v} decimals={s.decimals} suffix={s.suffix} duration={1600} />
                ) : (
                  `${s.v.toFixed(s.decimals)}${s.suffix}`
                )}
              </div>
              <div
                className="mt-3 text-[13px] uppercase tracking-[0.24em]"
                style={{ color: t.muted }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>

      </section>

      <Divider theme={theme} />

      {/* ============= COMPANY INTRO ============= */}
      <section className="relative px-16 py-20 text-center">
        <Eyebrow theme={theme}>Company Introduction</Eyebrow>
        <H2 theme={theme}>An institutional engine, opened to a private circle.</H2>
        <Filigree className="mt-8" />
        <p
          className="mx-auto mt-8 max-w-[860px] text-[24px] leading-[1.55]"
          style={{ color: t.body }}
        >
          Naslab is a platform focused on blockchain trading strategies and automated execution
          systems. Through the <span style={{ color: t.goldStrong }}>Ncore 2.0</span> technology
          system, we specialize in MEV trading by analyzing on-chain data, market liquidity and
          transaction opportunities — delivering a more efficient digital asset trading solution.
        </p>

      </section>

      <Divider theme={theme} />

      {/* ============= CORE FOCUS ============= */}
      <section className="relative px-16 py-20">
        <div className="text-center">
          <Eyebrow theme={theme}>Core Focus</Eyebrow>
          <H2 theme={theme}>Three pillars. One unfair advantage.</H2>
        </div>

        <div className="mt-14 space-y-6">
          {focus.map((f) => (
            <div
              key={f.n}
              className="relative overflow-hidden rounded-2xl p-10"
              style={{ border: `1px solid ${t.goldBorderSoft}`, background: t.cardBg }}
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
                  <h3
                    className="font-serif text-[34px] font-bold"
                    style={{ color: t.goldStrong }}
                  >
                    {f.t}
                  </h3>
                  <p className="mt-3 text-[20px] leading-[1.55]" style={{ color: t.body }}>
                    {f.d}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider theme={theme} />

      {/* ============= PACKAGES ============= */}
      <section className="relative px-16 py-20">
        <div className="text-center">
          <Eyebrow theme={theme}>Estimated Returns</Eyebrow>
          <H2 theme={theme}>
            From <span style={gold()}>4.5%</span> to <span style={gold()}>13.5%</span> a month.
          </H2>
          <Filigree className="mt-8" />
          <p
            className="mx-auto mt-6 max-w-[820px] text-[20px] leading-[1.55]"
            style={{ color: t.body }}
          >
            Three private tiers, each with reference ROI ranges based on market conditions,
            strategy performance and the actual execution results of Ncore 2.0.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="relative overflow-hidden rounded-[24px] p-9 text-center"
              style={{
                border: `1px solid ${t.goldBorderStrong}`,
                background: t.tierBg,
                boxShadow: `0 40px 100px -25px ${t.goldGlow}`,
              }}
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
                  {tier.name}
                </div>

                <div className="mx-auto my-7 flex items-center justify-center gap-3">
                  <div className="h-px w-10" style={{ background: t.goldBorder }} />
                  <div className="text-[10px] tracking-[0.4em]" style={{ color: t.goldFaint }}>
                    ✦
                  </div>
                  <div className="h-px w-10" style={{ background: t.goldBorder }} />
                </div>

                {/* Monthly — primary, single-line */}
                <div
                  className="text-[10px] uppercase tracking-[0.35em]"
                  style={{ color: t.eyebrow }}
                >
                  Monthly
                </div>
                <div
                  className="mt-2 font-serif font-black"
                  style={{
                    fontSize: "36px",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    whiteSpace: "nowrap",
                    ...gold(),
                  }}
                >
                  {tier.monthly.replace(/\s+/g, "\u00A0")}
                </div>

                {/* Daily — secondary, single-line */}
                <div
                  className="mt-7 rounded-xl px-4 py-4"
                  style={{
                    border: `1px solid ${t.goldBorderSoft}`,
                    background: t.surfaceDeep,
                  }}
                >
                  <div
                    className="text-[10px] uppercase tracking-[0.35em]"
                    style={{ color: t.muted }}
                  >
                    Daily
                  </div>
                  <div
                    className="mt-1.5 font-serif font-bold"
                    style={{
                      fontSize: "22px",
                      lineHeight: 1,
                      letterSpacing: "-0.01em",
                      whiteSpace: "nowrap",
                      color: t.goldStrong,
                    }}
                  >
                    {tier.daily.replace(/\s+/g, "\u00A0")}
                  </div>
                </div>

                <p
                  className="mt-6 text-[14px] italic leading-relaxed"
                  style={{ color: t.muted }}
                >
                  {tier.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p
          className="mx-auto mt-10 max-w-[820px] text-center text-[13px] leading-relaxed"
          style={{ color: t.faint }}
        >
          * Reference ranges only. Past performance does not guarantee future returns.
          Crypto investments carry risk.
        </p>
      </section>

      <Divider theme={theme} />

      {/* ============= CTA + QR ============= */}
      <section className="relative px-16 py-20">
        <div
          className="relative overflow-hidden rounded-[40px] p-14 text-center"
          style={{
            border: `1px solid ${t.goldBorderStrong}`,
            background: t.ctaBg,
            boxShadow: `0 50px 120px -30px ${t.goldGlow}`,
          }}
        >
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
            <Eyebrow theme={theme}>Start Your Journey</Eyebrow>
            <h2
              className="mt-6 font-serif font-black"
              style={{
                fontSize: "84px",
                lineHeight: 1.25,
                paddingBottom: "0.28em",
                paddingLeft: "0.06em",
                overflow: "visible",
                ...gold("strong"),
              }}
            >
              Join Naslab Today
            </h2>
            <p
              className="mx-auto mt-6 max-w-[760px] text-[22px] leading-[1.55]"
              style={{ color: t.body }}
            >
              Discover how Naslab captures on-chain trading opportunities through the Ncore 2.0
              technology system. Scan the QR or visit the link below.
            </p>

            <div className="mt-12 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-12">
              {/* QR with fancy double gold frame */}
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-3 rounded-[28px]"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #fff5d4, #c79a3e, #fff5d4, #7a5818, #fff5d4)",
                    filter: "blur(2px)",
                    opacity: 0.85,
                  }}
                />
                <div
                  className="relative rounded-[24px] p-[3px]"
                  style={{
                    background:
                      "linear-gradient(135deg,#fff8dc 0%,#f0cf7a 35%,#7a5818 70%,#f0cf7a 100%)",
                  }}
                >
                  <div
                    className="rounded-[22px] p-[2px]"
                    style={{ background: t.surfaceDeep }}
                  >
                    <div
                      className="relative rounded-[20px] p-5"
                      style={{
                        background: "#ffffff",
                        boxShadow: "0 30px 80px -15px rgba(212,170,80,0.55)",
                      }}
                    >
                      <CornerOrnaments />
                      <img src={qrSrc} alt="QR" className="h-[280px] w-[280px]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Invite link panel — consistent typography */}
              <div className="text-left">
                <div
                  className="text-[12px] font-semibold uppercase tracking-[0.32em]"
                  style={{ color: t.eyebrow }}
                >
                  Invite Link
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy invite link"
                  className="mt-4 flex w-full items-center gap-3 rounded-xl px-5 py-4 text-left transition-all hover:brightness-110 active:scale-[0.99]"
                  style={{
                    border: `1px solid ${copied ? "#34d399" : t.goldBorder}`,
                    background: t.surfaceDeep,
                    cursor: "pointer",
                  }}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: t.chipBg, border: `1px solid ${t.goldBorder}` }}>
                    <CopyIcon color={copied ? "#34d399" : t.goldStrong} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className="truncate text-[18px] font-light tabular-nums tracking-[-0.04em] mx-0 px-[5px]"
                      style={{ color: t.text }}
                    >
                      invite.naslabtec.com/{memberId}
                    </div>
                  </div>
                  <div
                    className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: copied ? "#34d399" : t.eyebrow }}
                  >
                    {copied ? "Copied" : "Copy"}
                  </div>
                </button>

                <div className="mt-4">
                  <Stat label="Member" value={memberId} theme={theme} />
                </div>

                <div
                  className="mt-7 inline-flex items-center gap-3 rounded-full px-9 py-4 text-[18px] font-bold"
                  style={{
                    color: "#0a0805",
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
        <div
          className="mt-6 text-[13px] uppercase tracking-[0.32em]"
          style={{ color: t.faint }}
        >
          Naslab Technologies · Powered by Ncore 2.0
        </div>
        <div className="mt-2 text-[12px]" style={{ color: t.faint }}>
          © {new Date().getFullYear()} Naslab. All rights reserved. · Member #{memberId}
        </div>
      </footer>
    </div>
  );
}

/* ─────────────── theme palette ─────────────── */

function palette(theme: Theme) {
  if (theme === "light") {
    return {
      pageBg:
        "linear-gradient(180deg,#f4ede0 0%,#efe7d6 100%)",
      surface: "linear-gradient(180deg,#ffffff 0%,#faf3e2 100%)",
      surfaceDeep: "#fbf6ea",
      cardBg: "linear-gradient(135deg,#fff8e8 0%,#fbf3df 60%,#f6ecd2 100%)",
      tierBg: "linear-gradient(180deg,#fff8e6 0%,#fbf2dc 60%,#f4e9cb 100%)",
      ctaBg: "linear-gradient(135deg,#fff8e8 0%,#fbf2dc 60%,#f1e4c1 100%)",
      chipBg: "linear-gradient(180deg,rgba(212,170,80,0.18),transparent)",
      text: "#241a07",
      body: "rgba(36,26,7,0.78)",
      muted: "rgba(36,26,7,0.55)",
      faint: "rgba(36,26,7,0.42)",
      eyebrow: "rgba(122,88,24,0.85)",
      goldStrong: "#7a5818",
      goldBorder: "rgba(122,88,24,0.45)",
      goldBorderSoft: "rgba(122,88,24,0.2)",
      goldBorderStrong: "rgba(122,88,24,0.65)",
      goldFaint: "rgba(122,88,24,0.6)",
      goldGlow: "rgba(212,170,80,0.5)",
    };
  }
  return {
    pageBg:
      "radial-gradient(140% 80% at 50% 110%, #15100a 0%, #07050a 60%, #030206 100%)",
    surface: "linear-gradient(180deg,#0e0a05 0%,#080604 100%)",
    surfaceDeep: "rgba(10,8,5,0.7)",
    cardBg: "linear-gradient(135deg,#1c1408 0%,#0d0a05 60%,#0a0805 100%)",
    tierBg: "linear-gradient(180deg,#2a1d08 0%,#15100a 60%,#0d0a05 100%)",
    ctaBg: "linear-gradient(135deg,#2a1d08 0%,#0d0a05 60%,#0a0805 100%)",
    chipBg: "linear-gradient(180deg,rgba(212,170,80,0.15),transparent)",
    text: "#ffffff",
    body: "rgba(255,255,255,0.75)",
    muted: "rgba(255,255,255,0.55)",
    faint: "rgba(255,255,255,0.4)",
    eyebrow: "rgba(212,170,80,0.85)",
    goldStrong: "#f0cf7a",
    goldBorder: "rgba(212,170,80,0.4)",
    goldBorderSoft: "rgba(212,170,80,0.25)",
    goldBorderStrong: "#e6c473",
    goldFaint: "rgba(212,170,80,0.6)",
    goldGlow: "rgba(212,170,80,0.7)",
  };
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

function Ornaments({ theme }: { theme: Theme }) {
  const gridOpacity = theme === "light" ? 0.05 : 0.07;
  return (
    <>
      {/* fine grid only — no big gold radial vignette at top anymore */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: gridOpacity,
          backgroundImage:
            "linear-gradient(rgba(212,170,80,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,170,80,0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(70% 50% at 50% 50%, black 30%, transparent 80%)",
        }}
      />
      {/* film grain (very subtle) */}
      {theme === "dark" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
      )}
    </>
  );
}

/** Soft bokeh glow blobs — concentrated near content, no edge sparkles */
function BokehGlow({ theme }: { theme: Theme }) {
  const c =
    theme === "light"
      ? "rgba(199,154,62,0.18)"
      : "rgba(240,207,122,0.18)";
  const blobs = [
    { x: "50%", y: "30%", size: 320, c: c.replace("0.18", "0.10") },
    { x: "50%", y: "65%", size: 280, c },
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

/** Floating geometric / 3D-ish shapes (rings, hex), away from text columns */
function FloatingShapes({ theme }: { theme: Theme }) {
  const stroke = theme === "light" ? "rgba(122,88,24,0.18)" : "rgba(212,170,80,0.22)";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* perspective ring near hero bottom */}
      <svg
        width="380"
        height="120"
        viewBox="0 0 380 120"
        style={{ position: "absolute", left: "50%", top: "1380px", transform: "translateX(-50%)" }}
      >
        <ellipse cx="190" cy="60" rx="180" ry="40" fill="none" stroke={stroke} strokeWidth="1.5" />
        <ellipse cx="190" cy="60" rx="140" ry="30" fill="none" stroke={stroke} strokeWidth="1" />
        <ellipse cx="190" cy="60" rx="100" ry="20" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.6" />
      </svg>
      {/* hex outline near footer */}
      <svg
        width="180"
        height="180"
        viewBox="0 0 100 100"
        style={{ position: "absolute", right: "40px", bottom: "200px", opacity: 0.35 }}
      >
        <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" fill="none" stroke={stroke} strokeWidth="0.7" />
        <polygon points="50,18 78,33 78,67 50,82 22,67 22,33" fill="none" stroke={stroke} strokeWidth="0.5" />
      </svg>
      <svg
        width="160"
        height="160"
        viewBox="0 0 100 100"
        style={{ position: "absolute", left: "30px", top: "60%", opacity: 0.3 }}
      >
        <circle cx="50" cy="50" r="40" fill="none" stroke={stroke} strokeWidth="0.6" />
        <circle cx="50" cy="50" r="28" fill="none" stroke={stroke} strokeWidth="0.5" />
        <circle cx="50" cy="50" r="16" fill="none" stroke={stroke} strokeWidth="0.4" />
      </svg>
    </div>
  );
}

/** Animated bar-chart flourish under hero stats */
function BarChartFlourish({ theme, animate }: { theme: Theme; animate: boolean }) {
  const t = palette(theme);
  const bars = [42, 58, 36, 71, 49, 83, 62, 95, 78, 88, 66, 92];
  return (
    <div className="mt-12">
      <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.3em]"
        style={{ color: t.muted }}>
        <span>30-Day Yield Pulse</span>
        <span style={{ color: t.goldStrong }}>● Live</span>
      </div>
      <div
        className="relative h-[120px] overflow-hidden rounded-2xl px-5 py-4"
        style={{ border: `1px solid ${t.goldBorderSoft}`, background: t.surface }}
      >
        <div className="flex h-full items-end gap-2">
          {bars.map((h, i) => (
            <div key={i} className="relative flex-1">
              <div
                className="w-full rounded-t-sm"
                style={{
                  height: `${h}%`,
                  background:
                    "linear-gradient(180deg,#fff8dc 0%,#f0cf7a 35%,#c79a3e 100%)",
                  boxShadow: "0 0 12px rgba(240,207,122,0.45)",
                  animation: animate ? `growBar 1.4s ${i * 60}ms cubic-bezier(.2,.8,.2,1) both` : undefined,
                  transformOrigin: "bottom",
                }}
              />
            </div>
          ))}
        </div>
        <style>{`@keyframes growBar { from { transform: scaleY(0); opacity: 0 } to { transform: scaleY(1); opacity: 1 } }`}</style>
      </div>
    </div>
  );
}

/** Subtle sparkline added to focus cards */
function Sparkline({ theme, animate }: { theme: Theme; animate: boolean }) {
  const t = palette(theme);
  const pts = [10, 18, 14, 24, 30, 22, 36, 28, 44, 38, 52, 46, 60];
  const max = 70;
  const w = 320;
  const h = 50;
  const path = pts
    .map((p, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - (p / max) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <div className="relative mt-6 flex items-center justify-end">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id={`spk-${theme}`} x1="0" x2="1">
            <stop offset="0%" stopColor="#7a5818" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f0cf7a" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d={path}
          fill="none"
          stroke={`url(#spk-${theme})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: "drop-shadow(0 0 6px rgba(240,207,122,0.5))",
            strokeDasharray: animate ? "1000" : undefined,
            strokeDashoffset: animate ? "1000" : undefined,
            animation: animate ? "drawLine 1.6s ease-out forwards" : undefined,
          }}
        />
        <circle cx={w} cy={h - (pts[pts.length - 1] / max) * h} r="3.5" fill={t.goldStrong} />
        <style>{`@keyframes drawLine { to { stroke-dashoffset: 0 } }`}</style>
      </svg>
    </div>
  );
}

/** Horizontal ticker row with mock pairs */
function TickerTape({ theme }: { theme: Theme }) {
  const t = palette(theme);
  const items = [
    { p: "ETH/USDT", v: "+0.42%" },
    { p: "SOL/USDC", v: "+0.31%" },
    { p: "ARB/USDT", v: "+0.58%" },
    { p: "BNB/USDT", v: "+0.27%" },
    { p: "OP/USDT", v: "+0.39%" },
  ];
  return (
    <div
      className="mx-auto mt-10 flex max-w-[860px] items-center gap-px overflow-hidden rounded-xl"
      style={{ border: `1px solid ${t.goldBorderSoft}`, background: t.goldBorderSoft }}
    >
      {items.map((it) => (
        <div
          key={it.p}
          className="flex flex-1 items-center justify-between px-4 py-3"
          style={{ background: t.surface }}
        >
          <span className="font-mono text-[13px]" style={{ color: t.muted }}>
            {it.p}
          </span>
          <span className="font-mono text-[13px] font-bold" style={{ color: t.goldStrong }}>
            {it.v}
          </span>
        </div>
      ))}
    </div>
  );
}

function Stat({
  label,
  value,
  theme,
  mono = false,
}: {
  label: string;
  value: string;
  theme: Theme;
  mono?: boolean;
}) {
  const t = palette(theme);
  return (
    <div
      className="rounded-lg px-4 py-3"
      style={{ border: `1px solid ${t.goldBorderSoft}`, background: t.surfaceDeep }}
    >
      <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: t.eyebrow }}>
        {label}
      </div>
      <div
        className={`mt-1 ${mono ? "font-mono" : ""} text-[18px] font-light tabular-nums tracking-[-0.04em]`}
        style={{ color: t.text }}
      >
        {value}
      </div>
    </div>
  );
}

function LinkIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
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

function Divider({ theme }: { theme: Theme }) {
  const t = palette(theme);
  return (
    <div className="flex items-center justify-center px-16">
      <div className="flex w-full max-w-[400px] items-center gap-4">
        <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${t.goldBorder})` }} />
        <div className="text-[10px] tracking-[0.4em]" style={{ color: t.goldFaint }}>✦</div>
        <div className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${t.goldBorder})` }} />
      </div>
    </div>
  );
}

function Eyebrow({ children, theme }: { children: ReactNode; theme: Theme }) {
  const t = palette(theme);
  return (
    <div
      className="text-[14px] font-semibold uppercase tracking-[0.42em]"
      style={{ color: t.eyebrow }}
    >
      {children}
    </div>
  );
}

function H2({ children, theme }: { children: ReactNode; theme: Theme }) {
  void theme;
  return (
    <h2
      className="mt-5 font-serif font-bold leading-[1.1]"
      style={{ fontSize: "64px", ...gold() }}
    >
      {children}
    </h2>
  );
}
