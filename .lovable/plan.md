## Goal

Convert the **Q&A** entry in the left sidebar from a single link into an expandable group (like Reports / Statement) that shows two sub-items:
- Company → `/portal/qna/company`
- Marketing plan → `/portal/qna/marketing`

## Change

In `src/components/portal-shell.tsx`, inside the `support` section's items, replace the current Q&A leaf:

```tsx
{ to: "/portal/qna", labelKey: "nav.qna", icon: MessageCircleQuestion },
```

with a `NavBranch` so it renders through the existing `NavGroup` (chevron + animated expand) used by Reports and Statement:

```tsx
{
  labelKey: "nav.qna",
  icon: MessageCircleQuestion,
  basePath: "/portal/qna",
  children: [
    { to: "/portal/qna/company", labelKey: "nav.qnaCompany", icon: BookOpen },
    { to: "/portal/qna/marketing", labelKey: "nav.qnaMarketing", icon: FileBarChart },
  ],
},
```

Add the two label strings to `src/i18n/locales/en.json` (keys `nav.qnaCompany` = "Company", `nav.qnaMarketing` = "Marketing plan"). Other locales fall back to English keys, so no other locale files need to change.

## Behavior

- Clicking Q&A in the sidebar expands/collapses just like Reports.
- Auto-expanded when on any `/portal/qna/*` route.
- Sub-items navigate to the existing tabs we built last turn (no route changes needed).
- The horizontal Company / Marketing plan tabs at the top of the page stay as-is so users can switch from either place.