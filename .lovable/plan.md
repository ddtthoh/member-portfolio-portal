## Hybrid Trading Portal — Meme Coin Edition

### Dependencies (install)
- `three`, `@react-three/fiber`, `@react-three/drei`
- `react-parallax-tilt`
- `react-countup`

### New components
- `src/components/three-background.tsx` — Fixed full-viewport WebGL canvas behind app. ~36 wireframe icosahedron nodes (gold) with bright cores, connected by gold lines, with glowing packets traveling along edges. Slow auto-rotation, cursor parallax. Reduced node count on mobile, disabled on `prefers-reduced-motion`.
- `src/components/ticker-tape.tsx` — Marquee strip of meme coins (DOGE, SHIB, PEPE, WIF, BONK, FLOKI, BRETT, MOG, POPCAT, MEW, TURBO, NEIRO). Mock prices update every ~3s with a brief gold flash; 24h % colored green/red.
- `src/components/tilt-card.tsx` — `react-parallax-tilt` wrapper with gold glare for any liquid-glass card.
- `src/components/sparkline.tsx` — Animated SVG sparkline that draws itself on mount, colored by trend.
- `src/components/count-value.tsx` — `react-countup` wrapper for currency formatting.

### Edits
- `src/routes/__root.tsx` — Mount `<ThreeBackground />` once globally inside `RootComponent` so it spans landing, login, and portal.
- `src/components/portal-shell.tsx` — Insert `<TickerTape />` directly under the sticky header. Wrap `<Outlet />` in framer-motion `AnimatePresence` keyed by pathname (fade + small Y).
- `src/routes/portal.index.tsx` — Wrap each `Stat` in `<TiltCard>`, swap raw value for `<CountValue>`, add `<Sparkline>` under the value, add staggered framer-motion fade-in per tile.
- `src/components/page-header.tsx` — Animate the title with framer-motion (blur-to-sharp + fade).
- `src/styles.css` — Add keyframes: `spark-draw` (sparkline draw), `flash-gold` (value-change glow), `ticker-marquee` (continuous left-scroll). Add `prefers-reduced-motion` overrides that freeze 3D/tilt/count-up.

### Performance & a11y
- Canvas uses `dpr={[1, 1.5]}` and only mounts when `prefers-reduced-motion` is not set.
- Mobile (<768px): node count drops to ~18, tilt disabled.
- Ticker pauses on hover.

### Result
WebGL blockchain network drifts behind the entire app, meme-coin ticker scrolls under the portal header with gold flashes on each tick, stat tiles tilt under the cursor with gold glare, numbers count up smoothly, sparklines draw themselves, and routes fade between each other — on the existing private-banking palette.
