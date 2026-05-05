## Replace logo mark with uploaded PNG

Replace the gold "I" letter badge in `src/components/logo.tsx` with the uploaded N-shaped logo image.

### Steps

1. Copy the uploaded image into the project as `src/assets/logo-mark.png`.
2. Update `src/components/logo.tsx`:
   - Import the PNG: `import logoMark from "@/assets/logo-mark.png"`.
   - Replace the `<div>` containing the `<span>I</span>` (line 6–8) with an `<img>` element using `logoMark`, sized `h-9 w-9` with `object-contain`, keeping the existing `Link` wrapper and the "Ivory & Vale / Private Wealth" text alongside.
   - Drop the gold border / gradient background since the new mark is a full-color logo (cleaner on both light and dark themes).

### Notes

- The wordmark text ("Ivory & Vale / Private Wealth") stays as-is. If you'd like that renamed too, let me know.
- The image will appear everywhere `<Logo />` is used (sidebar, login, landing page).
