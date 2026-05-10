## Change

In `src/routes/portal.index.tsx` (lines 182–200), update the card currently linking to `/portal/asset-analysis`:

- Change `<Link to="/portal/asset-analysis">` → `<Link to="/portal/holdings">`
- Replace the title `t("overview.assetAnalysis", "Asset Analysis")` → `"Portfolio Overview"` (with i18n key `overview.portfolioOverview` and English fallback)
- Remove the subtitle line `t("pages.overview.insightsTrends")` (or replace with a fitting subtitle — see question)

No other navigation entries (sidebar, command palette) are touched — only this card on the overview page.

## Question

Keep the small subtitle below the title, or remove it? If kept, suggested text: "Holdings & staking plans".