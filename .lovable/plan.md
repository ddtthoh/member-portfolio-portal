## Goal

Make the `.liquid-glass` boxes use different opacity values in light vs. dark mode so each theme reads cleanly.

## Change

In `src/styles.css`, the `.liquid-glass` utility currently hardcodes `--glass-opacity: 0.7` for both themes. I'll move that knob to the theme tokens:

- `:root` (light mode): `--glass-opacity: 0.85` — boxes look more solid/white on the bright background.
- `.dark` (dark mode): `--glass-opacity: 0.45` — boxes stay translucent so the gold/black backdrop shows through.

Then `.liquid-glass` reads `var(--glass-opacity)` instead of defining its own default. Border, fill, and sheen layers all already reference this variable, so they'll all shift together per theme.

## Question

Do those two values (light 0.85 / dark 0.45) feel right, or do you want the dark boxes more opaque / light boxes more transparent? I can tune after you try it.