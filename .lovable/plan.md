## Problem
You pick a PDF in the Monthly Report uploader but nothing happens — no toast, no upload, no new row.

## Likely causes
1. The current code requires you to type a **Report title** *before* picking a file. If the title is empty, the handler returns early. The toast may have been dismissed too fast to notice.
2. Even when it does upload, the file input isn't reset on early returns, so picking the **same file again** silently does nothing (browser doesn't fire `onChange` for the same value).
3. There is no console logging in the upload path, so silent failures (e.g. CORS, RLS, network) are invisible.

## Fix plan

1. **Remove the "title required before pick" trap** in `src/routes/portal.wallet-edit.tsx` → `MonthlyReportUploadSection`:
   - If the title field is empty, auto-fill it from the filename (without extension) instead of bailing out.
   - Always reset `pdfRef.current.value = ""` at the very start of `onPick`'s `finally`, so picking the same file twice still triggers `onChange`.

2. **Add diagnostic logs** around the upload so we can see exactly where it stops:
   - `console.log("[monthly-report] picked", file.name, file.size, file.type)`
   - `console.log("[monthly-report] storage upload result", upErr)`
   - `console.log("[monthly-report] insert result", error)`
   These show up in the preview console and in the next message's logs.

3. **Surface every error visibly** with `toast.error` plus the raw message, so silent failures become loud.

4. **Verify after the fix**: upload a small PDF, confirm it appears in the list below, and confirm it's also visible at `/portal/monthly-report`.

## Files touched
- `src/routes/portal.wallet-edit.tsx` (only the `MonthlyReportUploadSection` component)

No database or storage changes are needed — bucket `monthly-reports` and table `monthly_reports` are already correctly configured (verified policies + bucket settings).