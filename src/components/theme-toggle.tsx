import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-full border border-gold/60 shadow-[0_0_0_1px_color-mix(in_oklab,var(--gold)_30%,transparent),0_0_12px_-2px_color-mix(in_oklab,var(--gold)_45%,transparent)] hover:border-gold hover:shadow-[0_0_0_1px_var(--gold),0_0_16px_-2px_color-mix(in_oklab,var(--gold)_70%,transparent)] transition-all"
    >
      {theme === "dark" ? <Sun className="h-4 w-4 text-gold" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
