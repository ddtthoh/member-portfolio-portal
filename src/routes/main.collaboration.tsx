import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, Network, Sparkles, Handshake } from "lucide-react";
import { MReveal } from "@/components/marketing/m-reveal";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/main/collaboration")({
  head: () => ({
    meta: [
      { title: "Collaboration — NASLAB" },
      { name: "description", content: "Naslab partners with institutions, treasuries, and ecosystems that value execution quality, technical rigor, and long-term system building." },
      { property: "og:title", content: "Collaboration — NASLAB" },
      { property: "og:description", content: "Institutional, ecosystem, and technology partnerships across the Ncore stack." },
    ],
  }),
  component: CollaborationPage,
});

const TYPES = [
  { Icon: Building2, k: "Institutional", t: "Capital Partnerships", d: "Treasuries, family offices and funds seeking access to Naslab's execution infrastructure." },
  { Icon: Network, k: "Ecosystem", t: "Protocol & Venue Partners", d: "Exchanges, L2s and protocols integrating with the Ncore execution stack." },
  { Icon: Sparkles, k: "Technology", t: "Strategic Tech Partners", d: "Infrastructure, security and data partners building the next layer of digital finance." },
];

const TYPE_OPTIONS = ["Institutional", "Ecosystem", "Technology", "Other"];

function CollaborationPage() {
  const [submitting, setSubmitting] = useState(false);
  const [partnershipType, setPartnershipType] = useState("Institutional");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    const { error } = await supabase.from("collaboration_requests").insert({
      organization: String(data.get("organization") ?? ""),
      contact_name: String(data.get("contact_name") ?? ""),
      email: String(data.get("email") ?? ""),
      partnership_type: partnershipType,
      message: String(data.get("message") ?? ""),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Please try again or email us directly.");
      return;
    }
    toast.success("Request received — our team will follow up shortly.");
    form.reset();
    setPartnershipType("Institutional");
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute right-10 top-40 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-10 lg:pt-28">
          <MReveal><span className="m-eyebrow">Collaboration</span></MReveal>
          <MReveal delay={120}>
            <h1 className="mt-6 max-w-5xl font-serif text-5xl leading-[1.05] md:text-7xl">
              Partner with Naslab on the <span className="m-gold-text">long build</span>.
            </h1>
          </MReveal>
          <MReveal delay={240}>
            <p className="mt-7 max-w-2xl text-lg text-foreground/75">
              We collaborate with partners who value execution quality, technical rigor, and
              long-term system building. If you operate at that bar — let's talk.
            </p>
          </MReveal>
        </div>
      </section>

      <Section>
        <MReveal>
          <div className="text-center">
            <span className="m-eyebrow">Partnership Models</span>
            <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl md:text-5xl">
              Three ways to <span className="m-gold-text">build with us</span>.
            </h2>
          </div>
        </MReveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TYPES.map(({ Icon, k, t, d }, i) => (
            <MReveal key={k} delay={i * 100}>
              <button
                type="button"
                onClick={() => {
                  setPartnershipType(k);
                  document.getElementById("collab-form")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`m-luxe-border block h-full w-full text-left ${partnershipType === k ? "" : ""}`}
              >
                <div className="flex h-full flex-col p-8">
                  <Icon className="h-7 w-7 text-gold" />
                  <div className="mt-5 font-mono text-xs uppercase tracking-[0.3em] text-gold/80">{k}</div>
                  <div className="mt-2 font-serif text-2xl">{t}</div>
                  <p className="mt-3 flex-1 text-sm text-foreground/70">{d}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/85">
                    Start a conversation →
                  </span>
                </div>
              </button>
            </MReveal>
          ))}
        </div>
      </Section>

      <section id="collab-form" className="relative z-10 mx-auto max-w-4xl px-6 py-20 lg:px-10">
        <MReveal>
          <div className="m-luxe-border">
            <div className="p-10 md:p-14">
              <span className="m-eyebrow">Request</span>
              <h2 className="mt-5 font-serif text-3xl md:text-4xl">
                Tell us about your <span className="m-gold-text">partnership</span>.
              </h2>
              <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field name="organization" label="Organization" placeholder="Company / fund / protocol" required />
                  <Field name="contact_name" label="Contact Name" placeholder="Your full name" required />
                </div>
                <Field name="email" type="email" label="Email" placeholder="you@example.com" required />
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/60">Partnership Type</label>
                  <div className="flex flex-wrap gap-2">
                    {TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setPartnershipType(opt)}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${
                          partnershipType === opt
                            ? "bg-gold text-gold-foreground"
                            : "border border-gold/30 text-foreground/70 hover:border-gold/60 hover:text-gold"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/60">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Share what you're building and how Naslab might fit…"
                    className="w-full rounded-lg border border-gold/25 bg-card/30 px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-gold/70"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 pt-2">
                  <p className="inline-flex items-center gap-2 text-xs text-foreground/55">
                    <Handshake className="h-4 w-4 text-gold/70" /> We respond within 48 hours.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold to-gold/90 px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold-foreground shadow-[0_15px_50px_-15px_color-mix(in_oklab,var(--gold)_80%,transparent)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Submit Request"}
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
