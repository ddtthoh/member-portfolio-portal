## Goal

Replace the current particle field at `/portal` with a futuristic 3D **blockchain-style node web**: gold glowing nodes connected by thin gold edges that pulse with traveling light "packets," gently rotating in 3D space. Clicking anywhere triggers an interactive ripple — the nearest node lights up, fires pulses along its edges to neighbors, and briefly displaces nearby nodes outward (then springs back). The whole scene drifts and parallaxes with the cursor for a 3D depth feel.

## Scope

Single-file rewrite: **`src/components/three-background.tsx`**.
No other files change. No new dependencies (uses existing `three` + `@react-three/fiber`).
Lives behind the existing `<ThreeBackground />` mount inside `portal-shell.tsx`, so it only renders at `/portal/*`.

## What it looks like

- ~80 nodes (40 on mobile) placed in a 3D volume (roughly 16 × 10 × 6 units), biased toward the upper portion of the viewport so it reads as a "top background" while still filling depth.
- Each node = small gold sphere with additive-blended glow sprite (champagne-gold matching `--gold` token, `#f6e2b3` / `#e8c97a`).
- Edges = thin lines between nodes within a proximity threshold (~3.5 units), capped to avoid spaghetti (max ~3 edges per node, nearest-first).
- Edges have low base opacity (~0.15); a subtle constant shimmer pulses brightness sinusoidally per-edge.
- Traveling "packets": small bright dots animate along random edges every ~0.6s globally, fading in/out — gives the blockchain "transaction firing" feel.
- Slow global rotation (yaw/pitch < 5°) plus mouse-parallax tilt for 3D futurism.
- Soft fog/depth: nodes farther on Z render dimmer and smaller (handled by `sizeAttenuation` + per-node alpha tied to z).

## Interaction

- **Pointer move**: parallax tilt (group rotation eased toward mouse NDC × small factor); nearby nodes get a soft repulsion (radius ~1.5, gentle).
- **Click / tap**: 
  1. Raycast click into world plane at z=0; find nearest node.
  2. That node "ignites": scale pulse 1 → 1.8 → 1, glow color shifts brighter for ~0.8s.
  3. Spawn packet pulses along ALL connected edges, traveling outward to neighbors. On arrival, those neighbors ignite (smaller, ~0.4s) and optionally re-fire to *their* neighbors once (cascade depth = 2) for a chain-reaction feel.
  4. A short shockwave displaces nodes within radius 2.5 outward (then springs back via existing spring code).
- Touch supported via `pointerdown` (works on mobile, but reduce node count and skip cascade depth 2).
- Respects `prefers-reduced-motion`: render static node web with no animation/interaction.

## Technical design

Built as a single r3f scene inside the existing `<Canvas>`:

```text
<group> (rotates with parallax)
  <points nodes>            ← all node positions, single BufferGeometry
  <lineSegments edges>      ← all edge endpoint pairs, single BufferGeometry
  <points packets>          ← traveling pulses, positions updated each frame
</group>
```

Data structures (all `useMemo` + `useRef`, no React state in the hot loop):

- `nodes: { home: Vec3, pos: Vec3, vel: Vec3, ignite: number /* 0..1 decay */, seed: number }[]`
- `edges: { a: number, b: number, length: number, shimmerSeed: number }[]` precomputed once via O(N²) proximity scan.
- `adjacency: number[][]` (node index → connected node indices) for click cascades.
- `packets: { edge: number, t: number /* 0..1 */, dir: 1 | -1, life: number }[]` pooled (max ~120), recycled.

Per-frame `useFrame` work (cheap, all typed-array writes):
- Update node positions: spring toward `home + drift(t, seed)`, apply mouse repulsion + click shockwave decay, decay `ignite` toward 0.
- Recompute node attribute buffers: `position`, `size` (base × (1 + ignite × 0.8)), `color` (gold → bright gold by ignite via per-vertex color attribute).
- Recompute edge endpoint positions from current node positions (edges follow nodes as they move).
- Edge color: per-vertex color attribute; brighten endpoints whose nodes are ignited so edges "light up" dynamically. Combine with shimmer sin().
- Advance each live packet `t += speed * dt / edge.length`; compute world position by lerping between edge endpoints; on `t >= 1` ignite destination node and possibly cascade once.

Materials:
- Nodes: `PointsMaterial` with `vertexColors`, `sizeAttenuation`, additive blending, sprite texture (existing `makeSpriteTexture` reused).
- Edges: `LineBasicMaterial` with `vertexColors`, `transparent`, `depthWrite: false`, `blending: AdditiveBlending`. (No need for line width — keep at 1px which renders consistently across browsers.)
- Packets: separate `PointsMaterial`, smaller bright sprite, additive.

Click handling:
- Attach `onPointerDown` to a full-viewport invisible `<mesh>` (a large transparent plane at z=0) inside the Canvas — this gives reliable raycast intersect coords without needing window listeners.
- Use intersect point, find nearest node by squared distance, trigger ignite + cascade.

Mouse parallax:
- Window-level `pointermove` (already in use) updates a normalized `mouseTarget` ref.
- Group rotation lerps toward `mouseTarget * 0.15` rad each frame.

Performance:
- Single draw call per layer (nodes / edges / packets).
- All buffers updated in-place; no allocations in `useFrame`.
- DPR cap stays `[1, 1.5]`, alpha canvas, antialias on.
- Edge count target: ~140 desktop / ~60 mobile.

Accessibility:
- `aria-hidden`, `pointer-events-none` on the wrapper EXCEPT the click-catcher mesh inside the Canvas (which captures pointer events only within the Canvas; sidebar/main UI clicks remain unaffected because the wrapper itself is `pointer-events-none` — the click-catcher uses `onPointerDown` from r3f which is enabled per-mesh and the wrapper still needs `pointer-events: auto` only when interactive).

> Subtlety: r3f's per-mesh pointer events require the host DOM element to receive pointer events. To keep the rest of the portal UI clickable, set the wrapper to `pointer-events-auto` ONLY on the canvas element via CSS, but allow events to pass through "empty" areas by using a finite-size click-catcher plane sized to the viewport at z=0. Since the canvas covers the full screen, we instead: (a) keep wrapper `pointer-events-none`, (b) put the click-catcher plane with `onPointerDown` and listen at the **window** level for `click` events, raycasting manually from the captured event coords. This preserves UI clickability while still receiving clicks on the background — clicks on UI elements still trigger the background ripple too, which actually feels nice and intentional ("the whole portal is alive").

## Out of scope

- Any portal UI / layout changes.
- Real WebGL post-processing (bloom) — additive blending + bright gold sprites already give the glow look without the cost.
- Persisting node positions across route changes.
