"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { EGG_IDS, markFound, useKonamiCode } from "@/lib/fun/eggs";
import { celebrateEggRain } from "@/lib/fun/celebrate";
import { playPerfect } from "@/lib/fun/sound";

/** Global Konami listener — mounted once in root layout. */
export function EggListener() {
  const fire = useCallback(() => {
    const isNew = markFound(EGG_IDS.konami);
    playPerfect();
    void celebrateEggRain();
    toast.success(
      isNew ? "Konami found! Confetti rain unlocked." : "Konami again? Classic.",
      { description: isNew ? "Egg 1 of 3. Others hide in plain sight." : undefined },
    );
  }, []);

  useKonamiCode(fire);
  return null;
}
