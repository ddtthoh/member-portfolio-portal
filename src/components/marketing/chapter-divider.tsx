/**
 * Editorial hairline divider. Wave 4: removed CH.0X / mono labels for a calmer,
 * more magazine-like rhythm. Accepts label props but ignores them by default.
 */
export function ChapterDivider({ ch: _ch, label: _label }: { ch?: string; label?: string }) {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-10 lg:px-10">
      <span className="h-px w-full max-w-[160px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </div>
  );
}
