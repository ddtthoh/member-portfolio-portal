import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { MReveal } from "@/components/marketing/m-reveal";

export const Route = createFileRoute("/main/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap — NASLAB" },
      { name: "description", content: "Naslab's strategic roadmap from 2024 foundation to 2026+ global scale: Ncore 2.0, Ncore X, NCT token, and 100,000-user expansion." },
      { property: "og:title", content: "NASLAB Strategic Roadmap" },
      { property: "og:description", content: "Foundation → Stabilization → Live Trading Expansion → Scale & Market Readiness." },
    ],
  }),
  component: RoadmapPage,
});

const PHASES = [
  {
    year: "2024",
    title: "Foundation & Core System Development",
    status: "complete" as const,
    items: [
      "Ncore 2.0 core architecture",
      "Crypto Reserve Platform",
      "Core technical teams formed",
    ],
  },
  {
    year: "2025",
    title: "Product Stabilization & Strategy Design",
    status: "active" as const,
    items: [
      "Ncore 2.0 upgrades",
      "Ncore X concept design",
      "Arbitrage strategy paths",
    ],
  },
  {
    year: "2025 Q1–Q4",
    title: "Live Trading Expansion",
    status: "active" as const,
    items: [
      "Trading scale: $200K → $1M",
      "Security enhancements",
      "Ncore X closed testing",
    ],
  },
  {
    year: "2026 Q1–Q4",
    title: "Scale Expansion & Market Readiness",
    status: "upcoming" as const,
    items: [
      "International expansion",
      "Trading scale: $5M → $50M",
      "100,000 users target",
    ],
  },
];

function RoadmapPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--gold)_22%,transparent),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
          <MReveal>
            <span className="m-eyebrow">Strategic Roadmap</span>
          </MReveal>
          <MReveal delay={120}>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.05] md:text-7xl">
              Shaping the <span className="m-gold-text">future of digital finance</span>.
            </h1>
          </MReveal>
          <MReveal delay={240}>
            <p className="mt-6 max-w-2xl text-lg text-foreground/75">
              From automated trading systems to a scalable, global digital finance
              infrastructure — a long-term path engineered to compound value over
              decades, not quarters.
            </p>
          </MReveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-32 lg:px-10">
        <div className="relative">
          {/* vertical rail */}
          <div className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-gold/0 via-gold/40 to-gold/0 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-16">
            {PHASES.map((p, i) => {
              const isLeft = i % 2 === 0;
              return (
                <MReveal key={p.year} delay={i * 100}>
                  <div className="relative grid gap-6 md:grid-cols-2 md:gap-12">
                    {/* node */}
                    <div className="absolute left-6 top-2 -translate-x-1/2 md:left-1/2">
                      <div className="relative">
                        <div
                          className={`grid h-12 w-12 place-items-center rounded-full border-2 ${
                            p.status === "complete"
                              ? "border-gold bg-gold text-gold-foreground"
                              : p.status === "active"
                                ? "border-gold bg-[color:var(--m-bg)] text-gold"
                                : "border-foreground/30 bg-[color:var(--m-bg)] text-foreground/50"
                          }`}
                        >
                          {p.status === "complete" ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : p.status === "active" ? (
                            <Sparkles className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </div>
                        {p.status === "active" && (
                          <span className="ring-pulse absolute inset-0 rounded-full" />
                        )}
                      </div>
                    </div>

                    {/* card */}
                    <div className={`pl-20 md:pl-0 ${isLeft ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"}`}>
                      <div className="m-glass m-tilt p-7">
                        <div className="flex items-center gap-3 md:justify-end">
                          {p.status === "active" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-gold">
                              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Active
                            </span>
                          )}
                          <span className="rounded-full border border-gold/30 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                            {p.year}
                          </span>
                        </div>
                        <h3 className="mt-4 font-serif text-2xl">{p.title}</h3>
                        <ul className={`mt-4 space-y-2 text-sm text-foreground/75 ${isLeft ? "md:text-right" : ""}`}>
                          {p.items.map((it) => (
                            <li key={it} className={`flex items-start gap-2 ${isLeft ? "md:flex-row-reverse" : ""}`}>
                              <span className="mt-1.5 inline-block h-1 w-3 rounded-full bg-gold/70" />
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </MReveal>
              );
            })}
          </div>
        </div>

        <MReveal delay={400}>
          <div className="mt-20 m-luxe-border">
            <div className="p-10 text-center md:p-14">
              <h3 className="mx-auto max-w-2xl font-serif text-3xl md:text-4xl">
                The plan is the <span className="m-gold-text">commitment</span>.
              </h3>
              <p className="mx-auto mt-5 max-w-xl text-foreground/70">
                Every milestone is published, measured, and reported back to our
                community — because long-term capital deserves long-term clarity.
              </p>
            </div>
          </div>
        </MReveal>
      </section>
    </>
  );
}
