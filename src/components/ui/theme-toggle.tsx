"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Wait until mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        className="text-muted-foreground"
        disabled
        size="icon"
        variant="ghost"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all" />
      </Button>
    );
  }

  return (
    <Button
      className="text-muted-foreground"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="icon"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      variant="ghost"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-5 w-5 rotate-0 scale-100 transition-all" />
      )}
    </Button>
  );
}
