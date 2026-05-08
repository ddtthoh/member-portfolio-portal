## Plan: remove remaining first-scroll stutter

The earlier change removed the big WebGL/cursor effects, but there are still a few CSS/React effects that can cause a first-scroll hitch, especially on mobile: glass blur on cards, animated aurora background, ticker animation, mobile tap ripple, and scroll-triggered FAB state updates.

### 1. Disable expensive glass blur globally
- Update `.liquid-glass` in `src/styles.css` to keep the same dark/gold card look without `backdrop-filter: blur(40px)`.
- Keep borders, shadows, sheen, and card opacity so the portal still looks premium.

### 2. Stop always-running background animations
- Disable the `aurora-bg::before` animation and remove its `will-change` transform promotion.
- Keep the static aurora gradient and grid floor.

### 3. Remove remaining header/mobile blur and infinite animations
- Remove `backdrop-blur-sm` from the promotion button in `src/components/portal-shell.tsx`.
- Stop the animated gift tilt and ping dot in the header.
- Remove unused `ThreeBackground` and `CursorGlow` imports from `portal-shell.tsx`.

### 4. Make the ticker static/lightweight
- Update `src/components/ticker-tape.tsx` to remove the ticker `backdrop-blur`.
- Disable the continuous marquee animation in `src/styles.css` so it no longer competes with scroll.

### 5. Reduce mobile scroll listeners/repaints
- Remove `TapGlow` from `portal-shell.tsx` so touchstart doesn’t add animated fixed elements.
- Update `MobileFab` so its scroll-to-top button is always rendered on mobile/tablet instead of setting React state during scroll.
- Remove the FAB blur classes.

### Expected result
The first scroll should feel the same as the second scroll because the browser no longer has to initialize/paint blur layers, fixed overlays, or continuous animations during that first gesture.