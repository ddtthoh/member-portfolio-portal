# Why Visual Edits can't load the landing page

`/portal/landing-page` doesn't render the landing UI directly — it embeds it inside an `<iframe src="/invite/:memberId">` (scaled to 50% inside a 1280×1600 box).

Visual Edits works by injecting a selector overlay into the **top page's** DOM and listening to clicks there. It cannot cross into an iframe (browser security + the Lovable selector script only runs at the top level). So when you turn Visual Edits on while viewing `/portal/landing-page`:

- The chrome around the iframe (header, side panel, QR card, buttons) is selectable ✅
- Everything inside the iframe (the actual landing content you want to tweak) is **not reachable** ❌
- On top of that, the iframe re-mounts the entire app a second time inside itself, which is what triggers the "Failed to fetch dynamically imported module / hydration mismatch" noise you see in the console — the dev server's HMR client gets confused by two copies of the app in one tab.

That's the root cause. It is not a bug in your landing page; it's the iframe wrapper.

## The fix

Render the landing component **inline** on `/portal/landing-page` instead of through an iframe. Keep the "browser chrome" frame look so it still feels like a preview, and keep a separate "Open full page" button for the real `/invite/:memberId` route (used for PDF print and PNG capture).

### Steps

1. **Extract the landing UI** from `src/routes/invite.$memberId.tsx` into a reusable component, e.g. `src/components/marketing/invite-landing.tsx`, that takes `{ memberId, isPrint? }` as props. The route file becomes a thin wrapper that reads the param and renders the component.

2. **Refactor `src/routes/portal.landing-page.tsx`**:
   - Remove the `<iframe>`.
   - Render `<InviteLanding memberId={memberId} />` inside a scaled wrapper:
     ```
     <div style={{ width: 1280, transform: "scale(0.5)", transformOrigin: "top left" }}>
       <InviteLanding memberId={memberId} />
     </div>
     ```
     wrapped in a container with `overflow: hidden` and the matching reduced height (so layout doesn't jump).
   - Keep the fake browser chrome (the three colored dots + URL bar + Open button) as decoration around the scaled preview.

3. **PNG capture** (`downloadPNG`): point `html2canvas-pro` at the inline `.landing-root` element instead of `iframeRef.current.contentDocument`. Temporarily un-scale it during capture (`scale: 1` + render at natural size off-screen) so the PNG is full-resolution.

4. **PDF capture** (`downloadPDF`): unchanged — it already opens `/invite/:memberId?print=1` in a new tab and triggers `window.print()`. That flow doesn't need the iframe.

5. **"Open full page"**: unchanged — still opens `/invite/:memberId` in a new tab.

### Result

- Visual Edits can now click into the headline, CTA, hero image, etc. on `/portal/landing-page` directly — every element lives in the top document.
- The duplicate-app hydration warnings disappear.
- PNG/PDF/share actions keep working with the same UX.

### Out of scope

- No design changes to the actual landing page.
- No backend / auth changes.
- The public route `/invite/:memberId` keeps working exactly as today (it just imports the new shared component).
