## What's happening

When you open the preview in a new tab, every box briefly looks fully transparent / washed out. This isn't an opacity bug — it's a theme bug.

- Your glass boxes use `var(--card)` mixed at 30%.
- In **dark mode**, `--card` is a dark onyx → 30% over the dark page background reads as a subtle frosted box. ✅
- In **light mode**, `--card` is pure white → 30% white over the dark page background looks like a faint white haze, almost invisible. ❌

The dark class is only applied **after** React hydrates on the client (`theme-provider.tsx` runs in a `useEffect`). On a fresh tab, the server-rendered HTML has no `dark` class, so light-theme tokens apply for the first paint — that's the "fully transparent" flash you're seeing. After JS runs it snaps back to dark and the boxes look normal.

## Fix

Default the SSR shell to dark so the very first paint already uses dark tokens.

**Edit `src/routes/__root.tsx`** (line 59):

```tsx
<html lang="en" className="dark">
```

That's it — one attribute. The existing `useTheme` hook continues to toggle the class on the client, so the light/dark switch still works for users who pick light mode.

## Why this is the right fix (vs. tweaking opacity)

If we instead bumped the box opacity higher, dark-mode boxes would become too opaque and lose the frosted look you've been refining. The flash only happens because the wrong theme paints first; fixing the default eliminates the flash without touching your finely-tuned 30% glass.
