## Goal

Play a short intro video full-screen (with sound) immediately after a successful sign-in and after a confirmed sign-out. The overlay auto-dismisses when the video ends, then routes the user to the appropriate page.

## What I need from you

Please upload both video files in your next message:
- **Sign-in video** (plays after login succeeds, before landing on `/portal`)
- **Sign-out video** (plays after the sign-out confirmation, before landing on `/login`)

Recommended format: MP4 (H.264 + AAC), under ~10 MB each, 1080p or smaller. If you only have one clip, I can use it for both.

## Plan

1. **Store the videos** in `public/videos/` (`signin.mp4`, `signout.mp4`) so they're served as static assets — no DB/storage bucket needed.

2. **Create `<IntroVideoOverlay />`** (`src/components/intro-video-overlay.tsx`)
   - Fixed full-screen black overlay with a centered `<video>` element
   - `autoPlay`, `playsInline`, **not** muted, controls hidden
   - `onEnded` → fires a callback to dismiss + navigate
   - Safety fallback: if `play()` rejects (rare — both triggers come from a user click so audio autoplay is allowed), retry muted so the video still shows
   - Optional tiny "Skip" affordance in the corner in case playback stalls

3. **Wire sign-in** (`src/routes/login.tsx` or wherever `signIn` succeeds)
   - On success: mount the overlay with `signin.mp4` instead of navigating immediately
   - On video end: `navigate({ to: "/portal" })`

4. **Wire sign-out** (`src/components/portal-shell.tsx`, inside the existing `AlertDialogAction` confirm handler)
   - On confirm: call `signOut()`, then mount the overlay with `signout.mp4`
   - On video end: `navigate({ to: "/login" })`
   - Keep the existing confirmation dialog as-is

5. **No backend changes** — purely frontend, no migrations, no new dependencies.

## Notes / trade-offs

- **Audio**: Both triggers are user-initiated clicks, so browsers will allow sound. The muted fallback is just a safety net.
- **Sign-out timing**: Sign out runs first (fast), then video plays. If you'd rather show the video *while* signing out in the background, I can do that too — let me know.
- **Skip button**: I'll include a subtle "Skip" in the top-right so users aren't trapped if they don't want to wait.

Once you upload the two videos, I'll implement everything in one pass.