export function ChapterDivider({ ch, label }: { ch: string; label: string }) {
  return (
    <div className="mx-auto flex max-w-7xl items-center gap-5 px-6 py-10 lg:px-10">
      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold/80">{ch}</span>
      <span className="lg-divider flex-1" />
      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/45">{label}</span>
    </div>
  );
}
