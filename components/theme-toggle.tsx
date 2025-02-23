"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="h-6 w-6" />
        ) : (
          <Sun className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
