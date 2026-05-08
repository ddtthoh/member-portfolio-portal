## Problem

After signing in successfully, the portal page stays stuck on "Loading portal…". Auth logs confirm sign-in succeeds (200), then a `POST /token?grant_type=refresh_token` returns 400 `refresh_token_not_found`. The session replay shows the URL bouncing back to `/login?`.

Root cause is in `src/hooks/use-auth.tsx`:

- `setLoading(false)` only runs inside `supabase.auth.getSession().then(...)`. If that promise rejects (e.g. when the stored refresh token is invalid and Supabase throws during session restore), `loading` stays `true` forever, so `PortalShell` renders the spinner indefinitely.
- The `onAuthStateChange` listener never updates `loading` and never reacts to `SIGNED_OUT`/`TOKEN_REFRESHED` failures, so the UI can't recover.
- Subscription order also matters: per Supabase guidance, register the listener first, then call `getSession()` — and never `await` inside the listener (we don't, good).

## Fix

### 1. `src/hooks/use-auth.tsx` — make auth resolution bulletproof

- Always resolve `loading` to `false` whether `getSession()` succeeds OR throws (use `.finally` or try/catch).
- In the `onAuthStateChange` callback, also flip `loading` to `false` so the UI recovers as soon as Supabase emits any event (`INITIAL_SESSION`, `SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED`).
- If a token refresh fails (no session on `INITIAL_SESSION` / `SIGNED_OUT`), proactively call `supabase.auth.signOut()` to clear the broken stored token so future visits start clean.
- Keep `setUser`/`setSession` synchronous inside the listener — no awaits — to avoid the well-known Supabase deadlock.

### 2. `src/components/portal-shell.tsx` — slightly safer redirect

- The current `useEffect` redirect is fine, but split the spinner condition: show spinner only while `loading === true`; if `!loading && !user`, render `null` (the effect will navigate to `/login` on the next tick). This avoids a flash and guarantees no stuck "Loading portal…" state if the hook ever reports `loading=false, user=null`.

### 3. No schema, RLS, or route-tree changes needed.

## Technical details

```tsx
// src/hooks/use-auth.tsx (sketch)
useEffect(() => {
  const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
    setSession(sess);
    setUser(sess?.user ?? null);
    setLoading(false);
  });

  supabase.auth.getSession()
    .then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
    })
    .catch(() => {
      // stored refresh token was invalid; clear it so next load is clean
      supabase.auth.signOut().catch(() => {});
    })
    .finally(() => setLoading(false));

  return () => sub.subscription.unsubscribe();
}, []);
```

```tsx
// src/components/portal-shell.tsx (sketch)
if (loading) {
  return <SpinnerScreen />;
}
if (!user) {
  return null; // useEffect already navigates to /login
}
```

## Out of scope

- No changes to login page, route guards, or Supabase config.
- Hydration `dir="ltr"` warning in console logs is unrelated to this bug.
