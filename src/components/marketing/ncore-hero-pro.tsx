import { type ReactNode } from "react";
import { SplitLines } from "@/components/marketing/split-lines";

/** Editorial full-screen hero for ncore subpages: left text, right large chart visual. */
export function NcoreHeroPro({
  ch,
  eyebrow,
  titleA,
  titleB,
  description,
  visual,
  variant = "gold",
}: {
  ch: string;
  eyebrow: string;
  titleA: string;
  titleB: string;
  description: string;
  visual: ReactNode;
  variant?: "gold" | "cyan";
}) {
  const accent = variant === "cyan" ? "text-cyan-300" : "text-gold";
  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className={`absolute -top-40 -right-20 h-[42rem] w-[42rem] rounded-full blur-3xl ${variant === "cyan" ? "bg-cyan-500/12" : "bg-gold/12"}`} />
        <div className="absolute bottom-0 left-0 h-[24rem] w-[24rem] rounded-full bg-orange-700/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-[1500px] grid-cols-12 gap-8 px-6 pt-16 lg:px-12 lg:pt-24">
        {/* LEFT 30%: editorial copy */}
        <div className="col-span-12 lg:col-span-4">
          <div className={`font-mono text-[10px] font-semibold uppercase tracking-[0.45em] ${accent}/85`}>{ch}</div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-foreground/15 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/55">
            {eyebrow}
          </div>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="mt-7 text-[clamp(2.6rem,6vw,5.6rem)] font-light leading-[0.96] tracking-[-0.04em]"
          >
            <SplitLines text={titleA} className="block" />
            <span style={{ fontFamily: "var(--font-serif)" }} className="block italic">
              <SplitLines text={titleB} delay={300} className={variant === "cyan" ? "text-cyan-300" : "lg-tagline"} />
            </span>
          </h1>
          <p className="mt-7 max-w-md text-[15px] leading-relaxed text-foreground/75">{description}</p>

          <div className="mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/40">
            <span className="h-px w-10 bg-foreground/30" /> scroll for detail
          </div>
        </div>

        {/* RIGHT 70%: large visual */}
        <div className="col-span-12 min-h-[60vh] lg:col-span-8">
          <div className="relative h-full w-full">
            <div className="lg-card lg-card-pro relative h-full p-3 md:p-5">
              <div className="lg-noise" />
              <div className="relative z-[3] h-full">{visual}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
