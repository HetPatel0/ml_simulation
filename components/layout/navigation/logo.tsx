"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
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
      toast.success(isNew ? "Logo party! Egg found." : "Logo party again!", {
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
      <Image
        src="/logo.webp"
        alt="ML Simulation Logo"
        width={60}
        height={60}
        priority
        className="shrink-0"
      />

      <span className="text-lg">
        ML<span className="font-normal">Simulation</span>
      </span>
    </Link>
  );
}
