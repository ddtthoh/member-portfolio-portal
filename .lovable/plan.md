Plan to fix the /portal/qr-code phone overflow:

1. Make every QR page layout layer shrink correctly on phones
   - Add `min-w-0 w-full max-w-full` to the main QR grid, the QR card, the side panel, and each `SpotlightCard` used on this page.
   - This targets the real mobile overflow pattern where grid/card children keep their intrinsic width and push past the viewport.

2. Resize the QR card with viewport-safe sizing
   - Change the QR container from a fixed `max-w-[260px]` style to a viewport-aware size like `max-w-[min(260px,calc(100vw-72px))]`.
   - Keep the QR centered, but guarantee it can never exceed the phone content width.

3. Fix right-side content and buttons
   - Force the referral URL row, action button grid, and “How it works” content to stay inside the card with `min-w-0`, `max-w-full`, and `overflow-hidden` where needed.
   - Wrap long button labels in truncating spans so translated text cannot widen the button/card beyond the screen.

4. Verify on phone widths
   - Test `/portal/qr-code` at 390px, 375px, and 320px.
   - Confirm `document.documentElement.scrollWidth <= window.innerWidth` and visually confirm the QR code plus all lower/right content fit inside the screen.