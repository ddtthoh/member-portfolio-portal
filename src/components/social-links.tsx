import { Globe } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Variant = "row" | "stack" | "labeled";

type Channel = {
  name: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M21.94 4.32a1.2 1.2 0 0 0-1.63-1.18L2.7 10.05c-1.05.41-1.04 1.9.02 2.29l4.5 1.66 1.74 5.55a.85.85 0 0 0 1.4.36l2.6-2.4 4.66 3.42c.7.51 1.69.13 1.86-.72l2.46-15.89zM9.7 14.55l8.86-7.4-7.34 8.06-1.52 4.04-.96-3.07 7.34-8.06-7.34 6.43z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const channels: Channel[] = [
  { name: "Telegram", href: "https://t.me/NaslabMiddleEast", Icon: TelegramIcon },
  { name: "Instagram", href: "https://www.instagram.com/naslab_tec/", Icon: InstagramIcon },
  { name: "X", href: "https://x.com/NaslabTec", Icon: XIcon },
  { name: "Website", href: "https://www.naslabtec.com", Icon: Globe },
];

interface SocialLinksProps {
  variant?: Variant;
  size?: number;
  className?: string;
  /** Show "CONNECT" eyebrow + gold hairline above icons (row/stack only). */
  showEyebrow?: boolean;
}

export function SocialLinks({
  variant = "row",
  size = 16,
  className,
  showEyebrow = true,
}: SocialLinksProps) {
  if (variant === "labeled") {
    return (
      <div className={cn("grid grid-cols-4 gap-3", className)}>
        {channels.map(({ name, href, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="group flex flex-col items-center gap-2 rounded-xl border border-border/40 bg-card/30 px-3 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-card/60"
          >
            <span
              className="inline-flex items-center justify-center text-muted-foreground/80 transition-all duration-300 group-hover:text-gold group-hover:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,var(--gold)_55%,transparent))]"
              style={{ width: size, height: size }}
            >
              <Icon className="h-full w-full" />
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-gold">
              {name}
            </span>
          </a>
        ))}
      </div>
    );
  }

  const isStack = variant === "stack";
  const buttonSize = size + 16;

  const iconRow = (
    <div
      className={cn(
        "relative",
        isStack ? "flex flex-col items-center gap-2" : "flex items-center justify-center gap-2",
      )}
    >
      {channels.map(({ name, href, Icon }) => (
        <Tooltip key={name}>
          <TooltipTrigger asChild>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="group relative inline-flex items-center justify-center text-muted-foreground/85 transition-all duration-300 hover:-translate-y-0.5 hover:text-gold"
              style={{ width: buttonSize, height: buttonSize }}
            >
              <span
                aria-hidden
                className="absolute inset-0 rounded-full border border-gold/25 bg-card/40 transition-all duration-300 [box-shadow:inset_0_1px_0_color-mix(in_oklab,var(--gold)_10%,transparent)] group-hover:!border-gold/60 group-hover:bg-[color-mix(in_oklab,var(--gold)_10%,transparent)] group-hover:![box-shadow:0_0_0_1px_color-mix(in_oklab,var(--gold)_45%,transparent),0_8px_22px_-6px_color-mix(in_oklab,var(--gold)_55%,transparent)]"
              />
              <span
                className="relative inline-flex items-center justify-center transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_0_6px_color-mix(in_oklab,var(--gold)_55%,transparent))]"
                style={{ width: size, height: size }}
              >
                <Icon className="h-full w-full" />
              </span>
            </a>
          </TooltipTrigger>
          <TooltipContent side={isStack ? "right" : "top"}>{name}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn("flex flex-col items-center gap-2", className)}>
        {showEyebrow && (
          <div
            className={cn(
              "flex items-center gap-2",
              isStack ? "flex-col" : "w-full",
            )}
          >
            <span
              aria-hidden
              className={cn(
              "h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent dark:via-gold/50",
                isStack ? "w-6" : "flex-1",
              )}
            />
            {!isStack && (
              <span className="text-[9px] font-semibold uppercase tracking-[0.32em] text-gold/70">
                Connect
              </span>
            )}
            {!isStack && (
              <span
                aria-hidden
                className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent dark:via-gold/50"
              />
            )}
          </div>
        )}
        {iconRow}
      </div>
    </TooltipProvider>
  );
}
