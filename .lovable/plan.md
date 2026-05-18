The sign-out video is black because the app calls `signOut()` before showing the overlay. Once auth state becomes empty, `PortalShell` returns `null`, so the overlay is unmounted and only the black background remains.

Plan:
1. Update `PortalShell` sign-out flow so `setShowSignOutIntro(true)` happens before `signOut()` removes the user state, and keep the overlay mounted even after `user` becomes `null`.
2. Move the actual `signOut()` call into the overlay completion path, then navigate to `/login` after the video finishes.
3. Keep the sign-in video untouched.
4. Add a small safety path so if the sign-out video fails/stalls, it still signs out and redirects instead of leaving a black page.