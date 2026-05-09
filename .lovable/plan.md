## Goal

Add the four official channels — **Telegram**, **Instagram**, **X**, **Website** — across the app in a quietly premium way that matches the gold accent / private-banking aesthetic.

## Links

- Telegram → https://t.me/NaslabMiddleEast
- Instagram → https://www.instagram.com/naslab_tec/
- X → https://x.com/NaslabTec
- Website → https://www.naslabtec.com

## Design (high-end, minimal)

A reusable `<SocialLinks />` component rendered as a horizontal row of 4 brand-accurate icons.

**Visual language:**
- **Brand-accurate SVG icons** for Telegram / Instagram / X (Lucide doesn't ship faithful versions of these). Website uses Lucide `Globe`. Inline SVGs (no extra dependency), `currentColor` so they adapt to theme.
- **Icon size:** 16px (sidebar) / 18px (footer & support).
- **Default state:** `text-muted-foreground/70`, no background, no border — pure icon.
- **Hover state:** smooth 250ms transition to `text-gold`, with a soft gold halo via `drop-shadow(0 0 6px color-mix(in oklab, var(--gold) 55%, transparent))` and a subtle `-translate-y-0.5` lift.
- **Spacing:** `gap-4` between icons (sidebar `gap-3.5` when collapsed allows vertical stack).
- **Accessibility:** each link has `aria-label`, `target="_blank"`, `rel="noopener noreferrer"`, and a tooltip showing the channel name (sidebar variant).
- **Optional thin top divider** (`h-px bg-gradient-to-r from-transparent via-border to-transparent`) above the row in the sidebar to separate it from Sign Out.

This avoids colored brand fills (which would look cheap next to gold-on-charcoal) and instead reads as discreet, editorial — the same restraint as the rest of the portal.

## Placement (3 spots)

1. **Portal sidebar footer** (`src/components/portal-shell.tsx`)
   - Inserted just **above** the existing Sign Out / collapse-toggle row.
   - Expanded sidebar: horizontal row, centered, with the thin divider above.
   - Collapsed sidebar (68px): icons stack vertically, centered, tooltips on hover.

2. **Landing page footer** (`src/routes/index.tsx`)
   - In the existing `<footer>`, change layout to two rows or a flex row: copyright on the left, social icons on the right. 18px icons, same hover behavior.

3. **Support page** (`src/routes/portal.support.tsx`)
   - New "Official Channels" card: small eyebrow label + 4 icons with channel names below each (icon + label vertical micro-stack), so users can clearly identify them in a support context.

## Technical Details

**New file:** `src/components/social-links.tsx`
- Exports `<SocialLinks variant="row" | "stack" | "labeled" size={16|18} />`.
- Holds the link constants and inline SVG icon components: `TelegramIcon`, `InstagramIcon`, `XIcon`, plus Lucide `Globe` for the website.
- Uses `Tooltip` from `@/components/ui/tooltip` only when `variant !== "labeled"`.

**Edits:**
- `src/components/portal-shell.tsx` — render `<SocialLinks variant={collapsed ? "stack" : "row"} />` inside the sidebar footer block above the Sign Out row.
- `src/routes/index.tsx` — add `<SocialLinks variant="row" size={18} />` to the footer.
- `src/routes/portal.support.tsx` — add an "Official Channels" section using `<SocialLinks variant="labeled" />`.

**i18n:** add keys `social.telegram`, `social.instagram`, `social.x`, `social.website`, `social.officialChannels` to `src/i18n/locales/en.json` (other locales fall back to English; translation script can be run later).

**No new dependencies.** No business-logic changes. Pure presentation.

## Out of scope

- Login page socials (can be added later if you want).
- Header icon (intentionally avoided to keep top bar clean).
- Animated logo marks or full-color brand fills.
