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
      className="rounded-full border border-border/60"
    >
      {theme === "dark" ? <Sun className="h-4 w-4 text-gold" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
