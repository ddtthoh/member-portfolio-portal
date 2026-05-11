import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Target, Eye, Compass, Award, Globe2, Shield } from "lucide-react";
import { MReveal } from "@/components/marketing/m-reveal";

export const Route = createFileRoute("/main/about")({
  head: () => ({
    meta: [
      { title: "About — NASLAB" },
      { name: "description", content: "Naslab is the marketing engine of Nastech Global, building secure, scalable digital finance infrastructure for individuals and businesses." },
      { property: "og:title", content: "About NASLAB" },
      { property: "og:description", content: "The marketing engine of Nastech Global. Mission, vision, and the team behind next-generation digital finance." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Naslab"
        title={<>The marketing engine of <span className="m-gold-text">Nastech Global</span>.</>}
        sub="We empower individuals and businesses to access next-generation digital finance solutions through secure, scalable, and forward-looking strategies."
      />

      {/* MISSION / VISION / VALUES */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { Icon: Target, t: "Mission", d: "To make next-generation digital finance accessible, secure, and sustainable for clients across global markets." },
            { Icon: Eye, t: "Vision", d: "A world where intelligent infrastructure compounds capital with the precision and discipline of institutional finance." },
            { Icon: Compass, t: "Values", d: "Execution quality. Technical rigor. Long-term thinking. Transparent stewardship of every dollar entrusted to us." },
          ].map(({ Icon, t, d }, i) => (
            <MReveal key={t} delay={i * 100}>
              <div className="m-glass m-tilt h-full p-8">
                <Icon className="h-7 w-7 text-gold" />
                <h3 className="mt-5 font-serif text-2xl">{t}</h3>
                <p className="mt-3 text-sm text-foreground/70">{d}</p>
              </div>
            </MReveal>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <MReveal>
          <div className="text-center">
            <span className="m-eyebrow">Our Foundation</span>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl md:text-5xl">
              Built on three <span className="m-gold-text">non-negotiables</span>.
            </h2>
          </div>
        </MReveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { Icon: Shield, t: "Security First", d: "Every system, every wallet, every line of code is engineered with defensive design as a starting principle." },
            { Icon: Award, t: "Performance That Compounds", d: "We measure success in years, not days. Every strategy is built to compound returns reliably." },
            { Icon: Globe2, t: "Global From Day One", d: "Infrastructure designed for cross-border participation, multi-market liquidity, and 24/7 operation." },
          ].map(({ Icon, t, d }, i) => (
            <MReveal key={t} delay={i * 120}>
              <div className="m-luxe-border h-full">
                <div className="h-full p-8">
                  <Icon className="h-8 w-8 text-gold" />
                  <h3 className="mt-5 font-serif text-2xl">{t}</h3>
                  <p className="mt-3 text-sm text-foreground/70">{d}</p>
                </div>
              </div>
            </MReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <MReveal>
          <div className="m-glass flex flex-col items-center gap-6 p-12 text-center md:p-16">
            <h2 className="max-w-3xl font-serif text-3xl md:text-4xl">
              Want to learn more about how Naslab builds <span className="m-gold-text">long-term value</span>?
            </h2>
            <Link
              to="/main/strategy"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold to-gold/90 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-gold-foreground shadow-[0_15px_50px_-15px_color-mix(in_oklab,var(--gold)_80%,transparent)]"
            >
              See Our Strategy <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </MReveal>
      </section>
    </>
  );
}

function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--gold)_22%,transparent),transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
        <MReveal>
          <span className="m-eyebrow">{eyebrow}</span>
        </MReveal>
        <MReveal delay={120}>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.05] md:text-7xl">
            {title}
          </h1>
        </MReveal>
        <MReveal delay={240}>
          <p className="mt-6 max-w-2xl text-lg text-foreground/75">{sub}</p>
        </MReveal>
      </div>
    </section>
  );
}
