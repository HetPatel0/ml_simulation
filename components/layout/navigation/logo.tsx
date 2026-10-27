"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { notify } from "@/lib/toast";
import { EGG_IDS, markFound } from "@/lib/fun/eggs";
import { celebrateEggRain } from "@/lib/fun/celebrate";
import { playPop } from "@/lib/fun/sound";

export default function Logo() {
  const clicks = useRef<number[]>([]);

  const party = () => {
    const now = Date.now();
    clicks.current = [...clicks.current, now].filter((t) => now - t < 2000);
    if (clicks.current.length >= 5) {
      clicks.current = [];
      const isNew = markFound(EGG_IDS.logoParty);
      playPop();
      void celebrateEggRain();
      notify("success", isNew ? "Logo party! Egg found." : "Logo party again!", {
        description: isNew ? "Egg 2 of 3. One still hides." : undefined,
      });
    }
  };

  return (
    <Link
      href="/"
      scroll={true}
      aria-label="go home"
      onClick={party}
      className="flex items-center font-semibold tracking-tight select-none"
    >
      {/* Artwork carries ~27% internal padding — 48px box keeps the
          visible mark balanced with a 16px wordmark inside h-14 nav. */}
      <Image
        src="/logo.webp"
        alt="ML Simulation Logo"
        width={48}
        height={48}
        priority
        className="shrink-0"
      />

      <span className="text-base">
        ML<span className="font-normal">Simulation</span>
      </span>
    </Link>
  );
}
