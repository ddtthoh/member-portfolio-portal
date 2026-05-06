## Goal
Make the standalone preview (new tab) and the future published site look the same as the in‑app preview panel — specifically the light‑mode glass boxes, which currently read as more transparent outside the editor.

## Why they differ today
The in‑app preview iframe is composited on the editor's chrome, which sits behind the translucent glass and visually "fills in" the boxes. Outside the editor (new tab / published), only your real white backdrop is behind the glass, so the same `--glass-opacity: 0.35` reads as much more see‑through.

The fix is to raise the light‑mode glass tokens so the standalone view ends up looking like the in‑app version. Dark mode already matches and is left untouched.

## Change
Single file: `src/styles.css`, light-mode `:root` block.

```text
--glass-opacity:        0.35  →  0.62
--glass-sheen-top:      60%   →  55%
--glass-sheen-bottom:   8%    →  10%
--glass-border-strength: 70%  →  85%
```

Effects on every `.liquid-glass` card across `/portal` and all subpages:
- More solid card fill (closer to in‑app look)
- Slightly stronger gold border for definition on white
- Sheen tuned down a touch so the more opaque fill doesn't look milky

## Out of scope
- No changes to dark mode tokens
- No changes to the page backdrop (stays white)
- No changes to any component markup or text colors

## Verification
After the change, open the project in a new tab at `/portal` and `/portal/staking-plans` and compare against the in‑app panel — boxes should match. If you want them slightly more or less opaque after seeing it live, I can fine‑tune the single `--glass-opacity` value.
