# Landing Page → Single-Piece Mobile Poster

## What's wrong today

Current `/invite/:memberId` is a multi-section website with sticky nav (Why / How / Packages / FAQ tabs) and desktop-first layout. You want the opposite, like `tptraders.com.my/new--20`:

- **One single tall image / poster** (no nav, no tabs, no anchor jumps)
- **Mobile-format aspect ratio** (portrait, ~1080px wide) so it looks native when forwarded on WhatsApp
- Downloadable as **one high-res PNG** and **one PDF** (single long page, not multi-page)
- Desktop "Open full page" shows the same poster, just centered on screen — no tabs, no chrome

## Proposed structure

### 1. New component: `MobilePoster` (`src/components/marketing/mobile-poster.tsx`)

A single fixed-width (1080px) vertical canvas, designed mobile-first, with bold editorial blocks stacked top-to-bottom. No sticky nav, no in-page anchors, no router links.

Sections (all in one continuous scroll, one piece):

```text
┌──────────────────── 1080px wide ────────────────────┐
│  HERO — full-bleed                                  │
│   • NASLAB logo + "Member #06047282" chip           │
│   • Massive serif headline (黄金猎人 2.0 style)     │
│   • Gold gradient + dark background + chart accent  │
│                                                     │
│  STAT STRIP — 4 numbers in one row                  │
│   8.42% · $XX M+ · 12,000+ · 24/7                   │
│                                                     │
│  WHY (3 cards stacked vertically)                   │
│  HOW IT WORKS (4 numbered steps stacked)            │
│  PACKAGES (3 tier cards stacked, Premium hero'd)    │
│  FOUNDER NOTE (editorial quote block)               │
│  FAQ (accordion-less, just Q→A pairs)               │
│  FINAL CTA — big gold button + QR code + invite URL │
│  FOOTER — minimal, member ID + legal one-liner      │
└─────────────────────────────────────────────────────┘
```

No `<a href="#...">`, no sticky header. Just one tall surface.

Bold design direction: heavier serif display type, larger hero (60-80% of first viewport on mobile), more gold-on-black contrast, oversized numerals, brushy/painted accent on the headline word like the reference.

### 2. Route changes

- **`/invite/:memberId`** — replace current multi-section content with `<MobilePoster memberId={...} />` only. The poster is centered on desktop (max-width 1080px, gutters on the sides). Same component on every device — desktop just shows it bigger / centered.
- **`/portal/landing-page`** — preview already renders `InviteLandingContent` inline; no structural change, just inherits the new poster automatically. "Open full page" still opens `/invite/:memberId` in a new tab — now that page is the single poster.

### 3. Download flows

- **PNG**: `html2canvas-pro` on the `.landing-root` poster element at 2× scale → one tall PNG (~1080×~6000px). Already wired in `portal.landing-page.tsx`; just keeps working because target is a single element.
- **PDF**: switch from `window.print()` (which paginates into A4 sheets) to **client-side `jsPDF`**: capture poster with `html2canvas-pro`, embed as one image into a custom-size PDF page (1080pt × posterHeight pt) so the PDF is **one continuous page**, not sliced. Add `jspdf` dependency.
- Old `?print=1` route flag and print stylesheet → removed.

### 4. Cleanup

Delete (or stop importing) the now-unused multi-section pieces from `invite.$memberId.tsx`: the in-page nav bar, anchor IDs, and per-section route-style separation. Keep the data (headline copy, package tiers, FAQ list, founder note) — just re-render it inside the poster.

## Content source

Yes — please **re-upload the original content file** (the one you used last time with all the copy: hero headline, ROI ranges per tier, founder note, FAQ Q&A, footer disclaimer). The PDF you just uploaded is the *visual reference* (黄金猎人 2.0 poster) — I'll use it for the **art direction** (gold-on-black, painted serif headline, oversized hero, vertical stacking rhythm). For the actual English copy I need the text source again so I don't paraphrase the current placeholder text.

## Out of scope

- No backend / auth / data-model changes
- No changes to `/portal/*` other than the preview using the new poster
- No new routes — `/invite/:memberId` stays the only public URL

## Open questions

1. **Language** — keep English (current), or mirror the 黄金猎人 reference and offer Chinese too? (Defaulting to English unless you say otherwise.)
2. **PDF dependency** — OK to add `jspdf` (~50kb) for true single-page PDF export? Alternative is keeping `window.print()` but it will paginate.
