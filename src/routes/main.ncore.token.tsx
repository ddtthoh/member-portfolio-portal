import { createFileRoute } from "@tanstack/react-router";
import { Coins, Flame, KeyRound, Sparkles } from "lucide-react";
import { NcoreHero, NcoreSection, SectionHeader } from "@/components/marketing/ncore-shell";
import { MReveal } from "@/components/marketing/m-reveal";

export const Route = createFileRoute("/main/ncore/token")({
  head: () => ({
    meta: [
      { title: "NCT — Ncore Token — NASLAB" },
      { name: "description", content: "NCT is the exclusive settlement, access and incentive layer of the Ncore ecosystem — engineered for scarcity, alignment and long-term value." },
      { property: "og:title", content: "NCT — Ncore Token — NASLAB" },
      { property: "og:description", content: "Settlement, access and incentive layer of the Ncore ecosystem." },
    ],
  }),
  component: TokenPage,
});

const UTILITY = [
  { Icon: Coins, t: "Settlement", d: "NCT is the native settlement asset across the Ncore ecosystem — every product surface routes back to it." },
  { Icon: KeyRound, t: "Access", d: "Holding NCT unlocks exclusive product tiers, fee economics and ecosystem participation rights." },
  { Icon: Flame, t: "Deflationary", d: "Programmatic burn mechanisms enforce scarcity as system usage grows — aligning long-term value with adoption." },
  { Icon: Sparkles, t: "Incentives", d: "NCT powers operator, partner and user incentives — creating durable, on-chain alignment across the network." },
];

function TokenPage() {
  return (
    <>
      <NcoreHero
        eyebrow="NCT · Ncore Token"
        title="The native asset of the"
        highlight="Ncore ecosystem."
        description="NCT is more than a token. It is the settlement layer, the access key and the incentive instrument that aligns every participant — operators, partners, and users — around the long-term value of the system."
      />

      <NcoreSection>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <MReveal>
            <CoinVisual />
          </MReveal>
          <MReveal delay={150}>
            <span className="m-eyebrow">Why NCT</span>
            <h2 className="mt-5 font-serif text-3xl md:text-4xl">
              Designed for <span className="m-gold-text">scarcity by usage</span>.
            </h2>
            <p className="mt-5 text-foreground/75">
              Most tokens inflate. NCT contracts. The more the Ncore ecosystem is used,
              the more value flows back into the asset through structured burn mechanisms,
              settlement demand and access economics.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                { k: "Symbol", v: "NCT" },
                { k: "Role", v: "Settlement" },
                { k: "Mechanism", v: "Deflationary" },
              ].map((it) => (
                <div key={it.k} className="rounded-lg border border-gold/20 bg-card/30 p-3">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.25em] text-foreground/50">{it.k}</div>
                  <div className="mt-1 font-serif text-base text-gold">{it.v}</div>
                </div>
              ))}
            </div>
          </MReveal>
        </div>
      </NcoreSection>

      <NcoreSection>
        <SectionHeader eyebrow="Token Utility" title="Four roles," highlight="one ecosystem." />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {UTILITY.map(({ Icon, t, d }, i) => (
            <MReveal key={t} delay={i * 80}>
              <div className="m-glass m-tilt h-full p-7">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gradient-to-br from-gold/20 to-transparent">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl">{t}</h3>
                    <p className="mt-2 text-sm text-foreground/70">{d}</p>
                  </div>
                </div>
              </div>
            </MReveal>
          ))}
        </div>
      </NcoreSection>
    </>
  );
}

function CoinVisual() {
  return (
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
        <div className="m-float relative grid h-48 w-48 place-items-center rounded-full bg-gradient-to-br from-gold via-[#c89a2a] to-[#7a5b13] shadow-[0_30px_80px_-20px_color-mix(in_oklab,var(--gold)_80%,transparent),inset_0_-12px_30px_color-mix(in_oklab,black_45%,transparent),inset_0_8px_20px_color-mix(in_oklab,white_25%,transparent)]">
          <span className="font-serif text-5xl font-bold text-[#3a2a08]">NCT</span>
          <span className="absolute -inset-3 rounded-full border border-gold/50 [mask:radial-gradient(closest-side,transparent_70%,black)]" />
        </div>
      </div>
    </div>
  );
}
