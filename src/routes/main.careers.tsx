import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Briefcase, Cpu, LineChart, ShieldCheck, Megaphone, HeartHandshake, MapPin, Clock, ArrowRight } from "lucide-react";
import { MReveal } from "@/components/marketing/m-reveal";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/main/careers")({
  head: () => ({
    meta: [
      { title: "Careers — NASLAB" },
      { name: "description", content: "Join Naslab — building technology-driven systems for fast-moving digital markets. We're hiring engineers, traders, security, and growth talent." },
      { property: "og:title", content: "Careers — NASLAB" },
      { property: "og:description", content: "We hire for execution, precision, and impact. Open roles across engineering, trading, security, and growth." },
    ],
  }),
  component: CareersPage,
});

const ROLES = [
  { Icon: Cpu, t: "Senior Backend Engineer", d: "Build the low-latency execution pipeline behind Ncore 2.0 and Ncore X.", loc: "Remote · Global", type: "Full-time" },
  { Icon: LineChart, t: "Quantitative Researcher", d: "Design and validate strategies across MEV and cross-platform arbitrage paths.", loc: "Remote · Global", type: "Full-time" },
  { Icon: ShieldCheck, t: "Security Engineer", d: "Harden our key management, signing, and operational infrastructure.", loc: "Remote · Global", type: "Full-time" },
  { Icon: Briefcase, t: "Operations Lead", d: "Own day-to-day execution oversight, monitoring, and capital activity reporting.", loc: "UAE · Hybrid", type: "Full-time" },
  { Icon: Megaphone, t: "Growth & Partnerships", d: "Lead institutional relationships, distribution, and ecosystem partnerships.", loc: "UAE · Hybrid", type: "Full-time" },
];

const VALUES = [
  { t: "Execution over noise", d: "We measure ourselves in shipped systems, not slide decks." },
  { t: "Precision is culture", d: "From code reviews to capital flows — small details compound." },
  { t: "Long-term alignment", d: "We hire people who want to build something that lasts a decade." },
];

function CareersPage() {
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<string>("General Application");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setSubmitting(true);
    try {
      let resume_url: string | null = null;
      const file = data.get("resume") as File | null;
      if (file && file.size > 0) {
        if (file.size > 8 * 1024 * 1024) {
          toast.error("Resume must be under 8MB.");
          setSubmitting(false);
          return;
        }
        const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from("career-resumes").upload(path, file);
        if (upErr) {
          toast.error("Resume upload failed. Please try again.");
          setSubmitting(false);
          return;
        }
        resume_url = path;
      }

      const { error } = await supabase.from("career_applications").insert({
        position: selected,
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? "") || null,
        message: String(data.get("message") ?? "") || null,
        resume_url,
      });
      if (error) {
        toast.error("Could not submit application. Please try again.");
        return;
      }
      toast.success("Application received — we'll be in touch shortly.");
      form.reset();
      setSelected("General Application");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-10 lg:pt-28">
          <MReveal><span className="m-eyebrow">Careers</span></MReveal>
          <MReveal delay={120}>
            <h1 className="mt-6 max-w-5xl font-serif text-5xl leading-[1.05] md:text-7xl">
              Build the systems behind <span className="m-gold-text">a new digital economy</span>.
            </h1>
          </MReveal>
          <MReveal delay={240}>
            <p className="mt-7 max-w-2xl text-lg text-foreground/75">
              We're looking for engineers, researchers, operators and partners who care about
              execution, precision, and long-term impact.
            </p>
          </MReveal>
        </div>
      </section>

      {/* VALUES */}
      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <MReveal key={v.t} delay={i * 100}>
              <div className="m-glass m-tilt h-full p-7">
                <HeartHandshake className="h-6 w-6 text-gold" />
                <div className="mt-5 font-serif text-xl">{v.t}</div>
                <p className="mt-2 text-sm text-foreground/70">{v.d}</p>
              </div>
            </MReveal>
          ))}
        </div>
      </Section>

      {/* ROLES */}
      <Section>
        <MReveal>
          <div className="text-center">
            <span className="m-eyebrow">Open Roles</span>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl md:text-5xl">
              Where you can <span className="m-gold-text">make an impact</span>.
            </h2>
          </div>
        </MReveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {ROLES.map(({ Icon, t, d, loc, type }, i) => (
            <MReveal key={t} delay={i * 80}>
              <button
                type="button"
                onClick={() => {
                  setSelected(t);
                  document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`m-glass m-tilt block w-full p-7 text-left ${selected === t ? "ring-1 ring-gold/60" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gradient-to-br from-gold/20 to-transparent">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-serif text-2xl">{t}</h3>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/85">
                        Apply <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-foreground/70">{d}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-foreground/60">
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gold/70" /> {loc}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-gold/70" /> {type}</span>
                    </div>
                  </div>
                </div>
              </button>
            </MReveal>
          ))}
        </div>
      </Section>

      {/* APPLY */}
      <section id="apply" className="relative z-10 mx-auto max-w-4xl px-6 py-20 lg:px-10">
        <MReveal>
          <div className="m-luxe-border">
            <div className="p-10 md:p-14">
              <span className="m-eyebrow">Apply</span>
              <h2 className="mt-5 font-serif text-3xl md:text-4xl">
                Send us your <span className="m-gold-text">application</span>.
              </h2>
              <p className="mt-3 text-sm text-foreground/65">
                Currently applying for: <span className="text-gold">{selected}</span>
              </p>
              <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field name="name" label="Full Name" placeholder="Your full name" required />
                  <Field name="email" type="email" label="Email" placeholder="you@example.com" required />
                </div>
                <Field name="phone" label="Phone (optional)" placeholder="+1 555 555 5555" />
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/60">
                    Resume (PDF · optional · max 8MB)
                  </label>
                  <input
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full rounded-lg border border-gold/25 bg-card/30 px-4 py-3 text-sm text-foreground file:mr-3 file:rounded file:border-0 file:bg-gold/20 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:text-gold"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/60">
                    Why Naslab?
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us about you and what you'd build with us…"
                    className="w-full rounded-lg border border-gold/25 bg-card/30 px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-gold/70"
                  />
                </div>
                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold to-gold/90 px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold-foreground shadow-[0_15px_50px_-15px_color-mix(in_oklab,var(--gold)_80%,transparent)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </MReveal>
      </section>
    </>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-10">{children}</section>;
}

function Field({
  name, label, placeholder, type = "text", required = false,
}: { name: string; label: string; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/60">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gold/25 bg-card/30 px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-gold/70"
      />
    </div>
  );
}
