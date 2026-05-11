import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageCircle, Send, Globe } from "lucide-react";
import { MReveal } from "@/components/marketing/m-reveal";

export const Route = createFileRoute("/main/contact")({
  head: () => ({
    meta: [
      { title: "Contact — NASLAB" },
      { name: "description", content: "Get in touch with Naslab. Reach our team via email, Telegram, X, or Instagram. Headquartered globally — we respond within 24 hours." },
      { property: "og:title", content: "Contact NASLAB" },
      { property: "og:description", content: "Email contact@naslabtec.com or reach us on Telegram, X, and Instagram." },
    ],
  }),
  component: ContactPage,
});

const channels = [
  { Icon: Mail, label: "Email", value: "contact@naslabtec.com", href: "mailto:contact@naslabtec.com" },
  { Icon: Send, label: "Telegram", value: "@NaslabMiddleEast", href: "https://t.me/NaslabMiddleEast" },
  { Icon: MessageCircle, label: "X / Twitter", value: "@NaslabTec", href: "https://x.com/NaslabTec" },
  { Icon: Globe, label: "Instagram", value: "@naslab_tec", href: "https://www.instagram.com/naslab_tec/" },
];

function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--gold)_22%,transparent),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
          <MReveal>
            <span className="m-eyebrow">Contact</span>
          </MReveal>
          <MReveal delay={120}>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.05] md:text-7xl">
              Let's start a <span className="m-gold-text">conversation</span>.
            </h1>
          </MReveal>
          <MReveal delay={240}>
            <p className="mt-6 max-w-2xl text-lg text-foreground/75">
              Have a question or want to learn more about our products? Reach out
              and our team will respond within 24 hours.
            </p>
          </MReveal>
        </div>
      </section>

      {/* CHANNELS */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map(({ Icon, label, value, href }, i) => (
            <MReveal key={label} delay={i * 100}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="m-glass m-tilt block h-full p-7"
              >
                <Icon className="h-6 w-6 text-gold" />
                <div className="mt-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/55">{label}</div>
                <div className="mt-1.5 break-all font-serif text-lg text-gold">{value}</div>
              </a>
            </MReveal>
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-32 lg:px-10">
        <MReveal>
          <div className="m-luxe-border">
            <div className="p-10 md:p-14">
              <span className="m-eyebrow">Send a message</span>
              <h2 className="mt-5 font-serif text-3xl md:text-4xl">
                Tell us about your <span className="m-gold-text">interest</span>.
              </h2>
              <form
                className="mt-8 grid gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement;
                  const data = new FormData(form);
                  const subject = encodeURIComponent(`[Website] ${data.get("subject") ?? "Inquiry"}`);
                  const body = encodeURIComponent(
                    `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`,
                  );
                  window.location.href = `mailto:contact@naslabtec.com?subject=${subject}&body=${body}`;
                }}
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field name="name" label="Name" placeholder="Your full name" required />
                  <Field name="email" type="email" label="Email" placeholder="you@example.com" required />
                </div>
                <Field name="subject" label="Subject" placeholder="What is this about?" />
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/60">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Share more details…"
                    className="w-full rounded-lg border border-gold/25 bg-card/30 px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-gold/70"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-foreground/55">
                    Or email us directly at{" "}
                    <a href="mailto:contact@naslabtec.com" className="text-gold underline-offset-4 hover:underline">
                      contact@naslabtec.com
                    </a>
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-gold to-gold/90 px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold-foreground shadow-[0_15px_50px_-15px_color-mix(in_oklab,var(--gold)_80%,transparent)] transition-transform hover:-translate-y-0.5"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </MReveal>

        <MReveal delay={200}>
          <div className="mt-10 text-center text-sm text-foreground/60">
            Looking to invest? Visit the{" "}
            <Link to="/login" className="text-gold underline-offset-4 hover:underline">
              member portal
            </Link>{" "}
            to access your account.
          </div>
        </MReveal>
      </section>
    </>
  );
}

function Field({
  name, label, placeholder, type = "text", required = false,
}: { name: string; label: string; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/60">
        {label}
      </label>
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
