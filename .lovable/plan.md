## Futuristic, click-interactive background for /portal

Good news: the portal already mounts `ThreeBackground` — a 3D node-web (Three.js / R3F) that reacts to mouse movement and **fires energy packets along edges when you click**. Right now it's clipped to a 520–620px strip at the top of the page, so the cool effect is mostly invisible behind your cards.

This change unlocks it across the entire viewport and adds a richer ambient backdrop so the empty space feels futuristic.

### Changes

**`src/components/portal-shell.tsx`** (around line 50–52)
- Replace the single `<ThreeBackground />` mount with:
  1. A fixed full-viewport gradient layer (`-z-20`) — deep space-blue with two radial gold glows (top-left & bottom-right) using existing `--gold` token.
  2. `<ThreeBackground className="pointer-events-none fixed inset-0 -z-10" fade={false} />` so the node-web fills the whole window and stays as you scroll/navigate between portal pages.
- `pointer-events-none` keeps clicks falling through to your cards and buttons; the existing `window`-level click listener inside `ThreeBackground` still picks them up and triggers the cascade animation.

**No other files need changes.** All interactivity (cursor repulsion, click shockwave, packet cascade through neighboring nodes) already exists in `src/components/three-background.tsx`.

### What you'll see
- Dark, deep gradient base with subtle gold ambience.
- Constellation of gold nodes connected by faint lines drifting gently.
- Cursor pushes nearby nodes away (parallax + repulsion).
- **Clicking anywhere** ignites the nearest node and sends glowing packets racing along its edges to neighbors — a chain-reaction shockwave.
- Same effect applies on every `/portal/*` sub-route since it lives in the shell.

### Optional follow-ups (say the word)
- Tune density (`count`) or color palette (cyan/magenta cyber vibe instead of gold).
- Add a subtle vignette or grid overlay.
- Add a toggle in the sidebar to turn the background off for performance.