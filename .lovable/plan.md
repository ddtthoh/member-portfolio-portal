## Goal

Build a new **/portal/kyc** page where members upload their **passport** and a **selfie holding their passport**. Block uploads until the member's profile is fully filled (full name, DOB, national ID, phone, full address). Show submission status as a 3-dot progress bar: **Submitted → Pending → Approved**. Match the existing portal's premium/serif "liquid glass" design.

## User flow

1. Member clicks "KYC" in the account menu (already wired in `portal-shell.tsx`).
2. Page checks profile completeness:
   - **Incomplete** → show a "Complete your profile first" notice with a CTA button that navigates to `/portal/profile`. Upload form is disabled.
   - **Complete** → upload form is enabled.
3. Member uploads two images (passport + selfie-with-passport), submits.
4. Status row appears: dot 1 (Submitted) lit, dots 2 & 3 dim. Connecting bar animates.
5. Admin manually advances the row in DB → page reflects `pending` then `approved` (re-fetched on mount; live update via Supabase realtime is a nice-to-have).
6. Once `approved`, form is locked and a success state is shown.

## Backend (one migration)

**1. Extend `profiles` with the fields needed for the gate.**
Add columns: `national_id text`, `dob date`, `country text`, `region text`, `city text`, `address text`. All nullable (existing rows keep working). The KYC page treats all of them + `full_name` + `phone` as required.

**2. New `kyc_submissions` table.**
- `id uuid pk`, `user_id uuid not null` (one row per user — unique index)
- `passport_url text not null`, `selfie_url text not null`
- `status text not null default 'submitted'` with a CHECK in (`submitted`,`pending`,`approved`,`rejected`)
- `reviewer_note text null`, `submitted_at timestamptz default now()`, `updated_at timestamptz default now()`
- RLS: user can `SELECT` and `INSERT` their own row; **no UPDATE/DELETE for users** (admin updates status directly via DB, per chosen flow).
- `updated_at` trigger.

**3. Storage bucket `kyc-documents` (private).**
- RLS on `storage.objects`: user can INSERT/SELECT/DELETE only inside the folder `auth.uid()/...`.
- Bucket is **not public**; the UI reads files via signed URLs.

**4. Persist all profile fields.**
Update `portal.profile.tsx` save handler to write the new columns so the gate actually works (currently only `full_name` + `phone` persist).

## Frontend

**New file: `src/routes/portal.kyc.tsx`**
- Uses `PageHeader`, `SectionCard`, `SectionHeader`, `SectionBody`, `FieldLabel` from existing portal UI primitives — keeps fonts (Cormorant Garamond serif headings, Inter body), gold accents, and liquid-glass card styling identical to other portal pages.
- Loads `profiles` row + latest `kyc_submissions` row in parallel on mount.
- **Gate component**: if any required profile field is empty, render a `SectionCard` with an inline notice + primary "Complete profile" button → `navigate({ to: "/portal/profile" })`. Lists the missing fields so the user knows what to fill.
- **Upload form** (only enabled if profile is complete and no existing approved/pending submission):
  - Two upload tiles (passport, selfie-with-passport) with drag-drop + file picker, image preview, 5 MB limit, accept `image/jpeg,image/png,image/webp`.
  - Submit uploads files to `kyc-documents/{user_id}/passport-{ts}.jpg` and `…/selfie-{ts}.jpg`, then inserts `kyc_submissions` row with both paths and `status='submitted'`.
- **Status bar** (3 dots + connecting line) — see ASCII below — placed at top of the card after submission exists. Steps map: `submitted` → step 1 active, `pending` → steps 1+2 active, `approved` → all 3 active. `rejected` shown as a separate red banner with `reviewer_note`.
- All copy uses existing `useTranslation` keys plus a new `pages.kyc.*` namespace; English strings shipped, then auto-translated to the other 13 locales by the existing translation script convention.

```text
  ●━━━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━○
Submitted             Pending             Approved
```

- Active dot uses `bg-gold ring-pulse`, inactive uses `bg-muted-foreground/40` (matches `StatusDot` in `portal-ui.tsx`). Bar segments use `bg-gradient-to-r from-gold to-gold/40` for completed, `bg-border/40` for upcoming. Smooth width transition on status change.

**Nav entry**
The dropdown item already exists in `portal-shell.tsx:366` (`navigate({ to: "/portal/kyc" as any })`) — once the route file exists, drop the `as any` cast. No change to the sidebar nav (keeping it under the account dropdown as today).

**i18n**
Add `pages.kyc` section to `en.json` with: title, eyebrow, gate notice, missing-fields label, upload labels, submit button, status step labels, success/rejected messages. Mirror the same keys into the other 13 locale files (placeholder copies — translations follow the project's existing pattern).

## Out of scope (will not build now)

- Admin approval UI (status changes happen via DB per chosen flow).
- OCR / liveness / automated verification.
- Document re-submission flow after `approved` (locked once approved). Rejected submissions can be re-submitted (delete row → insert new).

## Files touched

- **New**: `src/routes/portal.kyc.tsx`
- **Edit**: `src/routes/portal.profile.tsx` (persist new fields), `src/components/portal-shell.tsx` (drop `as any`), `src/i18n/locales/*.json` (×14)
- **Auto-generated**: `src/routeTree.gen.ts`
- **Migration**: profiles columns, `kyc_submissions` table + RLS + trigger, `kyc-documents` storage bucket + RLS
