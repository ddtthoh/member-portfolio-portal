I found this is not just the old background effect. The remaining first-scroll hitch is likely caused by first-render animation work still happening at the same time as the user’s first scroll:

1. **Remove first-load motion from the /portal overview**
   - Replace the `framer-motion` wrappers on the overview cards/action tiles with normal `div`s.
   - This stops multiple delayed opacity/translate animations from running during the first scroll.

2. **Disable animated numbers on initial portal load**
   - Update `CountUp` so it renders the final number immediately instead of animating through many DOM text updates.
   - This matches the replay showing many number updates right before the scroll lag.

3. **Make the sparkline static**
   - Remove `framer-motion` path animation from `Sparkline`.
   - Keep the exact same chart visual, just no first-load SVG path drawing.

4. **Remove remaining motion/tilt listeners from action buttons**
   - Replace `TiltCard` usage on overview action tiles with a static wrapper.
   - This removes parallax/device-orientation setup that can initialize around the first interaction.

5. **Remove remaining paint-heavy decorative CSS on portal shell/cards**
   - Remove the fixed SVG noise overlay and card SVG noise layer.
   - Disable aurora blur/grid floor on the portal shell so the browser has less to rasterize on the first scroll.

6. **Fix the hydration mismatch warning**
   - Add a stable `dir="ltr"` on the root `<html>` element.
   - This prevents React hydration recovery work from competing with early interactions.

7. **Verify after implementation**
   - Re-profile the first scroll and confirm the page no longer performs number animation/motion initialization during the first scroll.