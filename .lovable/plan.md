## Goal

Replicate the Spline scene's vibe: a dense field of small glowing particles that drift gently and react to the cursor (particles near the pointer get pushed away / swirl, then settle back).

We'll do this with the existing react-three-fiber stack (no Spline runtime needed — keeps bundle small and SSR-safe) by rewriting `src/components/three-background.tsx`.

## What changes

**File: `src/components/three-background.tsx`** (rewrite)

Replace the current "nodes + connecting lines + packets" scene with a single GPU-friendly `<Points>` particle system:

- ~2,500 particles on desktop / ~900 on mobile, distributed in a soft 3D volume.
- Render with `THREE.Points` + `PointsMaterial` (additive blending, soft round sprite via a generated canvas texture, gold/ivory tint matching `--gold`).
- Per-frame update in `useFrame`:
  - Each particle has a base position + velocity. Apply gentle curl-noise-like drift (cheap sin/cos of position + time) so the field breathes.
  - Project the mouse onto the particle plane (using `useThree().viewport` + raycaster plane at z=0). For each particle, if distance to cursor < radius (~1.6), push it radially outward with falloff; otherwise spring it back toward its home position.
  - Slow global rotation for parallax.
- Mouse tracking via a `pointermove` listener on `window`, normalized to NDC then unprojected.
- Respect `prefers-reduced-motion` (already handled) and lower particle count + disable mouse repulsion on mobile.
- Keep the existing `<ThreeBackground />` export and the `fixed inset-0 -z-10` wrapper so `__root.tsx` keeps working unchanged.

No other files change. No new dependencies (three + @react-three/fiber are already installed).

## Technical notes

- Use a single `Float32Array` for positions and update `geometry.attributes.position.needsUpdate = true` each frame — avoids per-particle React overhead.
- Store `home`, `velocity`, and `seed` arrays in `useMemo` refs.
- Sprite texture: generate once with a 2D canvas radial gradient (white center → transparent) and reuse.
- Cursor interaction is pointer-based (works for touch drag too); on touch-end, particles spring back naturally.
- Keep DPR capped at `[1, 1.5]` and `alpha: true` so the page background shows through.

## Out of scope

- Importing the actual Spline file (would require `@splinetool/react-spline` + a runtime fetch of their scene; heavier and less controllable than a native r3f port).
- Changing colors / theme / any portal UI.
