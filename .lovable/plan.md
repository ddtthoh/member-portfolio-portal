## Goal

Fill in your profile so the KYC upload form unlocks.

## What I'll do

Write demo values directly into your profile row in the database (so you don't have to type each field). All KYC-required fields will be filled:

| Field | Value |
|---|---|
| Full name | Demo User |
| Date of birth | 1990-05-15 |
| National ID / Passport no. | A12345678 |
| Mobile number | +60123456789 |
| Country | Singapore |
| Region / State | Central |
| City | Singapore |
| Address | 1 Marina Boulevard, #20-01 |

After this, refreshing `/portal/kyc` will hide the "Complete your profile" gate and show the Passport / Identity Card upload form.

## How

A single UPDATE on the `profiles` table for the only existing user (`84db098a-…`).

## Note

These are placeholder values — replace them in **My Profile** anytime with your real details.
