"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSoundEnabled, setSoundEnabled } from "@/lib/fun/sound";
import { cn } from "@/lib/utils";

export function SoundToggle({ className }: { className?: string }) {
  // Mirrors QuizBlock's localStorage initializer pattern — SSR-safe via
  // getSoundEnabled() window guard, no post-mount sync effect needed.
  const [on, setOn] = useState<boolean>(() => getSoundEnabled());

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-pressed={on}
      aria-label={on ? "Mute quiz sounds" : "Unmute quiz sounds"}
      title={on ? "Mute sounds" : "Unmute sounds"}
      onClick={() => {
        const next = !on;
        setOn(next);
        setSoundEnabled(next);
      }}
      className={cn("h-8 gap-1.5 px-2 text-xs", className)}
    >
      {on ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      <span className="hidden sm:inline">{on ? "Sound on" : "Muted"}</span>
    </Button>
  );
}
