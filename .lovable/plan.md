## Goal

Take the futuristic upgrades we already shipped (3D constellation, command palette, magnetic buttons, cursor glow, count-up KPIs, tilt cards, spotlight cards, sparklines, ambient three-background) and make them feel **first-class on phone and tablet**, not just desktop. Add touch-native equivalents where the desktop interaction doesn't translate.

## Principles

- Touch first, mouse second. If an effect requires hover or fine pointer, give touch a different but equally premium effect.
- Respect `prefers-reduced-motion` and battery — drop frame rate / disable WebGL on small + low-power.
- Never block scroll; gestures must be passive or scoped.

## What changes per component

**1) `network-constellation.tsx` (3D)**
- Detect viewport: on `<768px` lower DPR cap to 1.25, particle/orbit count halved, disable bloom-like material expense, auto-rotate slower.
- Replace `OrbitControls` drag with `enableZoom={false}` and one-finger orbit only; add `touch-action: none` on the canvas wrapper.
- Increase canvas height on mobile (260px) vs desktop (380px) so it doesn't feel cramped.
- Add a subtle "tap a node" hint chip on touch devices; tapping a node opens its contact card sheet.

**2) `command-palette.tsx`**
- Desktop: keep ⌘K.
- Tablet/phone: add a floating action button (bottom-right, safe-area aware) that opens the same palette as a bottom `Sheet` instead of centered Dialog. Snap-points + drag-to-dismiss.
- Larger 44px hit targets, `inputMode="search"`, autofocus only on desktop (avoid keyboard pop on mobile open from FAB? still focus — user tapped search).

**3) `magnetic-button.tsx`**
- On `(pointer: coarse)` skip the magnet effect entirely and substitute: press-scale (`active:scale-[0.97]`), gold ripple on tap, and 10ms haptic via `navigator.vibrate?.(8)`.

**4) `cursor-glow.tsx`**
- Already gated to fine-pointer. Add a touch counterpart: `tap-glow` — quick 320ms gold radial pulse at touch point, mounted globally, throttled.

**5) `tilt-card.tsx`**
- On coarse pointer, replace mouse-tilt with **device-orientation parallax** (gyro) with ±6° clamp, and graceful no-op if permission denied (iOS requires `DeviceOrientationEvent.requestPermission()` — request lazily on first user tap inside portal).
- Reduce tilt amplitude on small screens to avoid clipping shadows.

**6) `spotlight-card.tsx`**
- Coarse pointer: animate the radial spotlight from tap origin and fade out (acts like ripple). Keeps the premium look without hover.

**7) `three-background.tsx` (ambient)**
- Pause render loop when `document.hidden`.
- On mobile: cap DPR to 1, particle count *0.4, switch to `frameloop="demand"` updating every 2nd frame, and fully disable when `prefers-reduced-motion` or `(max-width: 480px) and (prefers-reduced-data: reduce)`.

**8) `portal-shell.tsx` (layout)**
- Add `safe-area-inset` padding (top notch, bottom home indicator).
- Convert top utility row to a sticky header that hides on scroll-down / shows on scroll-up (mobile only) using a small scroll-direction hook.
- Bottom-right FAB cluster: Command palette + scroll-to-top (appears after 600px scroll).
- Sidebar: on tablet make it a collapsible rail (icon-only 64px); on phone keep the existing Sheet but add edge-swipe-to-open (left edge 16px hit zone, follows finger, opens past 40% threshold). Backdrop blur stronger.
- Page transitions: framer-motion `AnimatePresence` between routes — fade+8px slide on mobile, fade+scale on desktop.

**9) Tables (`portal-ui.tsx` DataTable)**
- On `<640px` switch table → stacked card list automatically (one card per row, label/value pairs). New `MobileRowList` primitive used by `DataTable` when narrow.
- Sticky first column on tablet horizontal scroll; momentum + scroll snap on `x`.
- Long-press a row to copy its primary value, with toast confirmation.

**10) `page-header.tsx`**
- Smaller h1 on phone (already responsive) — verify and tighten line-height.
- Eyebrow + actions stack with `gap-3`, actions become full-width pill row on phone.

**11) `count-up.tsx` / KPI numbers**
- Trigger only when in viewport via `IntersectionObserver` (saves work for off-screen mobile cards).
- Honor `prefers-reduced-motion` → skip animation, render final value.

**12) Pull-to-refresh (new, mobile only)**
- Add to portal data routes (`portal.holdings`, `portal.transactions`, `portal.statement.*`, `portal.network`). Lightweight: track touchstart at scrollTop===0, show gold spinner that grows with pull, fire route refetch on release past threshold.

**13) Bottom tab bar (new, phone only)**
- Replace burger-only nav with a 5-icon bottom tab bar: Home, Wallet, Network, Reports, More. Active indicator morphs between tabs (Framer `layoutId="tabPill"`). Hidden on tablet+.

**14) Gesture polish**
- Add `touch-action: manipulation` on all interactive controls to remove 300ms tap delay.
- Add `:active` gold glow ring globally (`@layer utilities`) for buttons.

**15) Performance gates**
- New hook `useDeviceCapability()` returning `{ tier: "low"|"mid"|"high", coarse, reduceMotion }` based on `navigator.hardwareConcurrency`, `deviceMemory`, viewport, media queries. All heavy components consult this and downshift.

## New files

- `src/hooks/use-device-capability.ts`
- `src/hooks/use-scroll-direction.ts`
- `src/components/tap-glow.tsx`
- `src/components/mobile-fab.tsx` (Cmd palette FAB + scroll-top)
- `src/components/bottom-tab-bar.tsx`
- `src/components/pull-to-refresh.tsx`
- `src/components/page-transition.tsx`

## Edited files

`network-constellation.tsx`, `command-palette.tsx`, `magnetic-button.tsx`, `cursor-glow.tsx`, `tilt-card.tsx`, `spotlight-card.tsx`, `three-background.tsx`, `portal-shell.tsx`, `portal-ui.tsx` (DataTable), `page-header.tsx`, `count-up.tsx`, `styles.css` (safe-area, tap-glow, active ring, touch-action utilities).

## Out of scope

- Replacing the design system / colors.
- Adding native app packaging (Capacitor/PWA install prompt) — can follow if you want.

After approval I'll implement in this order: capability hook → shell + bottom tab + FAB → table responsive → 3D/effects downshift → pull-to-refresh → polish.