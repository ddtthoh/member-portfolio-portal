## Goal

1. Create your admin account directly in the database so you can log in immediately as `ddtthoh@gmail.com`.
2. Build a proper signup page so future members can register through the portal (still invitation-gated via referral link).

---

## Part 1 — Provision your admin account (backend only)

- Insert an auth user for `ddtthoh@gmail.com` with a temporary password (you'll be asked to provide one, or I'll generate one and show it once).
- The existing `handle_new_user` trigger auto-creates the matching `profiles` and `wallets` rows.
- Insert a row into `user_roles` granting `admin` role to that user id.
- You can then sign in at `/login` and immediately access `/portal/admin/daily-rates`.

## Part 2 — Build the signup flow

### New route: `/signup`
- Public route (no auth guard).
- Reads optional `?ref=<memberId>` from URL — this is the sponsor's member id.
- Form fields: full name, email, password, confirm password, (referral code shown read-only if `?ref` present, editable input if not).
- Client-side validation with `zod` (email format, password ≥ 8 chars, passwords match).
- Calls `supabase.auth.signUp({ email, password, options: { data: { full_name, sponsor_member_id } }, emailRedirectTo: window.location.origin + '/portal' })`.
- On success: show "Check your email to confirm" message, then redirect to `/login`.

### Invitation gating
- Keep portal invitation-only: signup requires a valid referral code.
- If `?ref` is missing AND the manually entered code doesn't match any existing member, block submission with "Valid invitation code required".
- Lookup is a lightweight server function that returns only `{ valid: boolean, sponsor_name?: string }` — no PII leakage.

### Sponsor binding (lifetime, per your earlier requirement)
- Extend `handle_new_user` trigger to also write `sponsor_id` into `profiles` from `raw_user_meta_data->>'sponsor_member_id'` (resolved to the sponsor's user id).
- `profiles.sponsor_id` becomes immutable after first set (enforced via trigger).

### Fix broken invite links
- `/invite/$memberId` currently points to `/signup?ref=...` — that target will now exist.

### Login page touch-up
- Add "Don't have an account? Sign up with invitation" link → `/signup` (only useful if user has a ref code, but provides discoverability).

---

## Technical notes

- New file: `src/routes/signup.tsx`
- New server function: `src/lib/referrals.functions.ts` exporting `validateReferralCode({ code })` (public, no auth middleware, uses publishable-key server client with a narrow `TO anon` SELECT policy on a safe view exposing only `member_id` + `display_name`).
- New migration:
  - Add `sponsor_id uuid references auth.users` to `profiles` if not present.
  - Update `handle_new_user` to resolve and persist sponsor binding.
  - Add immutability trigger on `profiles.sponsor_id`.
  - Add narrow anon SELECT policy for referral lookups.
- Admin provisioning runs as a one-off SQL via the migration/insert tool — requires your temporary password choice.

---

## Open question before I implement

What password do you want for the initial admin login? Reply with either:
- a password you choose (min 8 chars), or
- "generate one" and I'll create a strong one and show it to you once.
