"use client";

import { useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

interface ThemeSwitchProps {
  className?: string;
  variant?:
    | "outline"
    | "link"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

export function ModeToggle({
  className,
  variant = "outline",
}: ThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          aria-label="Toggle theme (press D)"
          onClick={toggleTheme}
          className={cn("relative cursor-pointer rounded-full ", className)}
        >
          <Sun
            className={cn(
              "h-[1.2rem] w-[1.2rem] transition-[transform,opacity]",
              "scale-100 rotate-0",
              "dark:scale-0 dark:-rotate-90",
            )}
          />

          <Moon
            className={cn(
              "absolute h-[1.2rem] w-[1.2rem] transition-[transform,opacity]",
              "scale-0 rotate-90",
              "dark:scale-100 dark:rotate-0",
            )}
          />

          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        Toggle theme
        <Kbd className="ml-1 bg-white/15 text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.3)]">
          D
        </Kbd>
      </TooltipContent>
    </Tooltip>
  );
}
