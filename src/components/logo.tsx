import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-gold/60 bg-gradient-to-br from-gold/20 to-transparent">
        <span className="font-serif text-lg font-semibold text-gold">I</span>
      </div>
      <div className="leading-tight">
        <div className="font-serif text-base font-semibold tracking-wide">Ivory &amp; Vale</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Private Wealth</div>
      </div>
    </Link>
  );
}
