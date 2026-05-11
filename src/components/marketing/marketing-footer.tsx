import { Link } from "@tanstack/react-router";
import { Mail, Globe } from "lucide-react";
import naslabMark from "@/assets/naslab-mark.png";

const TelegramIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M21.94 4.32a1.2 1.2 0 0 0-1.63-1.18L2.7 10.05c-1.05.41-1.04 1.9.02 2.29l4.5 1.66 1.74 5.55a.85.85 0 0 0 1.4.36l2.6-2.4 4.66 3.42c.7.51 1.69.13 1.86-.72l2.46-15.89zM9.7 14.55l8.86-7.4-7.34 8.06-1.52 4.04-.96-3.07 7.34-8.06-7.34 6.43z" />
  </svg>
);
const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const XIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const socials = [
  { name: "Telegram", href: "https://t.me/NaslabMiddleEast", Icon: TelegramIcon },
  { name: "X", href: "https://x.com/NaslabTec", Icon: XIcon },
  { name: "Instagram", href: "https://www.instagram.com/naslab_tec/", Icon: InstagramIcon },
  { name: "Website", href: "https://www.naslabtec.com", Icon: Globe },
];

export function MarketingFooter() {
  return (
    <footer className="relative z-10 mt-32 border-t border-gold/20 bg-gradient-to-b from-transparent to-black/40">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/main" className="flex items-center gap-2.5">
              <img
                src={naslabMark}
                alt="NASLAB"
                className="h-12 w-12 object-contain drop-shadow-[0_2px_14px_color-mix(in_oklab,var(--gold)_55%,transparent)]"
              />
              <span className="font-serif text-xl font-semibold tracking-[0.2em]">
                NAS<span className="m-gold-text">LAB</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-foreground/65">
              The marketing engine of Nastech Global — empowering individuals and
              businesses to access next-generation digital finance.
            </p>
          </div>

          <FooterCol
            title="Products"
            items={[
              { label: "Ncore 2.0 — Basic", to: "/main/ncore/basic" },
              { label: "Ncore 2.0 — Trading", to: "/main/ncore/trading" },
              { label: "Ncore 2.0 — Features", to: "/main/ncore/features" },
              { label: "Ncore X", to: "/main/ncore/x" },
              { label: "NCT Token", to: "/main/ncore/token" },
            ]}
          />

          <FooterCol
            title="Company"
            items={[
              { label: "About", to: "/main/about" },
              { label: "Strategy", to: "/main/strategy" },
              { label: "Roadmap", to: "/main/roadmap" },
              { label: "Careers", to: "/main/careers" },
              { label: "Collaboration", to: "/main/collaboration" },
              { label: "Contact", to: "/main/contact" },
            ]}
          />

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-gold">
              Connect
            </h4>
            <a
              href="mailto:contact@naslabtec.com"
              className="group inline-flex items-center gap-2 text-sm text-foreground/75 transition-colors hover:text-gold"
            >
              <Mail className="h-4 w-4" />
              <span>contact@naslabtec.com</span>
            </a>
            <div className="mt-5 flex items-center gap-2.5">
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 bg-card/30 text-foreground/75 transition-all hover:-translate-y-0.5 hover:border-gold hover:text-gold hover:shadow-[0_8px_22px_-6px_color-mix(in_oklab,var(--gold)_55%,transparent)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-gold/15 pt-6 text-xs text-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Naslab — A Nastech Global Company. All rights reserved.</span>
          <span className="font-mono uppercase tracking-[0.25em] text-gold/70">
            naslabtec.com
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-gold">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it.to}>
            <Link
              to={it.to}
              className="text-sm text-foreground/75 transition-colors hover:text-gold"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
