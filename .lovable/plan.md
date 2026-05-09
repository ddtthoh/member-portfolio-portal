## Goal

Make the entire portal — every page, sub-page, tab, card, pill, button, table header, empty state, tooltip, sidebar item, command palette entry, mobile FAB, etc. — fully translated in all 14 languages, not just the page header.

## Best translation approach (your question)

For professional, non-Google-Translate quality without you writing them yourself, the best option is:

**Lovable AI with `google/gemini-3.1-pro-preview` (or `openai/gpt-5.2`), driven by a one-shot script that translates the whole `en.json` file at once with:**
1. A **domain glossary** locked in the system prompt (e.g. "Staking", "Par Rank", "Rewards Wallet", "USDT", "BEP20", "Promotion", "KYC", brand name, tier names like Diamond/Platinum) — these stay in English or use a fixed translation per language so terminology is consistent across pages.
2. A **tone instruction** ("formal financial-services portal, concise, professional, native-speaker phrasing — never literal").
3. **Whole-file context** (model sees all keys at once → understands "Submit" in deposit context vs. "Submit" in support context).
4. **JSON-mode output** so structure is preserved 1:1.

This is dramatically better than Google Translate because the model sees the surrounding keys + glossary + tone instruction. Quality is publication-grade for ~95% of strings; you can spot-edit any locale later by just editing its JSON file.

Cost is small — roughly 13 model calls of ~3–5K tokens each.

## Scope of extraction

I'll extract strings from:

**Routes (~30 files)**
`portal.index`, `portal.deposit`, `portal.withdrawal`, `portal.promotion` (+ `$promoId`), `portal.qna` (+ company / marketing / index), `portal.staking`, `portal.staking-plans`, `portal.holdings`, `portal.asset-analysis`, `portal.network`, `portal.referral`, `portal.transactions`, `portal.documents`, `portal.support`, `portal.profile`, `portal.qr-code`, `portal.wallet-edit`, `portal.statement.*` (5 files), `portal.reports.*` (6 files).

**Shared chrome / components**
`portal-shell` (sidebar, header, account menu), `command-palette`, `mobile-fab`, `total-assets-gauge`, `pl-calendar`, `network-constellation`, `ticker-tape`, `quiz-test`, `report-shell`, `count-up`/`count-value` labels, KPI tiles, empty-state strings, toast messages, form validation copy.

**What stays untranslated** (per your answer)
User data, currency amounts, transaction IDs, dates, names, hashes, promo codes, numbers.

## How I'll execute (one pass)

1. **Audit & extract** — Walk every portal file, replace hardcoded strings with `t("namespace.key")`, and build a fully-namespaced `en.json` (e.g. `pages.deposit.history.title`, `pages.deposit.table.date`, `shell.sidebar.signOut`, `common.empty.noResults`). Existing keys stay where they are; new keys get organized namespaces per page.

2. **Build glossary** — One-time `glossary.json` with locked brand + finance terms per language (e.g. zh: Staking → 质押, Rewards Wallet → 奖励钱包, Diamond → 钻石；ja: Staking → ステーキング, etc.). Used by the translation script and by you later for consistency.

3. **Run translation script** — `scripts/translate-locales.ts` using Lovable AI Gateway. For each of the 13 locales: send `en.json` + glossary + tone instruction to `google/gemini-3.1-pro-preview` in JSON mode, write result to `src/i18n/locales/{lang}.json`. Preserves keys exactly; only values change.

4. **RTL polish** — Verify `fa` and `ar` render correctly (we already set `dir="rtl"` on `<html>`). Spot-check icon directions in sidebar/breadcrumbs.

5. **Verification** — Build, then visually switch through 4 sample languages (zh, ja, ar, de) on Overview, Deposit, Reports, Promotion to confirm nothing leaked as raw English.

## Technical details

- Translation script runs server-side via `code--exec` using `LOVABLE_API_KEY`; output JSONs are committed to `src/i18n/locales/`. No runtime AI calls — all translation happens at build time, so app stays fast and works offline.
- Keys use dot-notation grouped by surface: `shell.*`, `pages.{routeName}.*`, `common.*`, `forms.*`, `tables.*`, `empty.*`, `actions.*`. Components reference `useTranslation()` and call `t("…")`.
- Plural/interpolation: any string with counts (e.g. "3 items") will use i18next's `{{count}}` interpolation so each language can pluralize correctly.
- Files I will NOT touch: `src/integrations/supabase/*`, `src/i18n/index.ts` (already correct), `routeTree.gen.ts`.

## Deliverable

After this pass, switching any language in the language picker translates every visible string everywhere in the portal — sidebar, page headers, tables, tabs, buttons, empty states, command palette, mobile FAB, the lot — in professional, finance-appropriate phrasing for all 13 non-English locales.

## Caveats

- ~500–700 strings is a large diff (~30 files touched + 14 JSON files rewritten). Big PR but low logic risk — text-only changes.
- After delivery you can edit any locale's JSON directly to refine wording; no code changes needed.
- If a translation feels off in one language, tell me the page + screenshot and I'll fix that specific key (or re-run the script with an updated glossary entry so it propagates everywhere).
