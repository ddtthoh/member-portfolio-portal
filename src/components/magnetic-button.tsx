import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  strength?: number;
};

/**
 * Button that gently follows the cursor when nearby on fine pointers.
 * On touch devices, falls back to a press-scale + haptic tap.
 */
export function MagneticButton({ children, className, strength = 0.35, onClick, ...props }: Props) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const isFine = () =>
    typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isFine()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  };
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick?.(e);
  };

  return (
    <button
      {...props}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={handleClick}
      className={cn(
        "transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] will-change-transform active:scale-[0.97] [touch-action:manipulation]",
        className,
      )}
    >
      {children}
    </button>
  );
}
