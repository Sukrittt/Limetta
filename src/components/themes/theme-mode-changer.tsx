"use client";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function ThemeModeChanger() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-7 w-7 border text-muted-foreground"
    >
      <Icons.sun
        className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        aria-hidden="true"
      />
      <Icons.moon
        className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        aria-hidden="true"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
