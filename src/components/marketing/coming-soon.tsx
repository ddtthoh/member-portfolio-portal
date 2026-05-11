import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { MReveal } from "@/components/marketing/m-reveal";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <section className="relative mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center px-6 py-24 text-center lg:px-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(60%_50%_at_50%_30%,color-mix(in_oklab,var(--gold)_20%,transparent),transparent_70%)]" />
      <MReveal>
        <span className="m-eyebrow">
          <Sparkles className="h-3 w-3" /> Coming soon
        </span>
      </MReveal>
      <MReveal delay={120}>
        <h1 className="mt-7 font-serif text-5xl md:text-7xl">
          <span className="m-gold-text">{title}</span>
        </h1>
      </MReveal>
      <MReveal delay={240}>
        <p className="mt-6 max-w-xl text-lg text-foreground/75">{description}</p>
      </MReveal>
      <MReveal delay={360}>
        <Link
          to="/main"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-gold/40 px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold transition-all hover:bg-gold hover:text-gold-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </MReveal>
    </section>
  );
}
