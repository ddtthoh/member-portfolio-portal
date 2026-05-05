## Plan: make ticker links work inside the Lovable preview

Change the anchor `target` in `src/components/ticker-tape.tsx` from `_blank` to `_top`.

The preview iframe blocks popups (`target="_blank"`), so clicks currently do nothing. `target="_top"` navigates the parent window instead — works in both the preview and the published site.

Tradeoff: in the preview, clicking replaces the whole window with PancakeSwap. The user uses browser back to return. On the published site behaviour is identical to the previous setup for end users.

### Files touched
- `src/components/ticker-tape.tsx` — single one-word change: `target="_blank"` → `target="_top"`.