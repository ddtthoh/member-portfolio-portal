import { Link } from "@tanstack/react-router";
import logoMark from "@/assets/logo-mark.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img src={logoMark} alt="Ivory & Vale" className="h-9 w-9 object-contain" />
      <div className="leading-tight">
        <div className="font-serif text-base font-semibold tracking-wide">Ivory &amp; Vale</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Private Wealth</div>
      </div>
    </Link>
  );
}
