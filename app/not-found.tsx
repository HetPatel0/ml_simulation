"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home } from "lucide-react";
import { notify } from "@/lib/toast";
import { EGG_IDS, markFound } from "@/lib/fun/eggs";
import { playBoo } from "@/lib/fun/sound";

function FloatingGhost() {
  const boo = () => {
    playBoo();
    const isNew = markFound(EGG_IDS.ghostBoo);
    if (isNew) {
      notify("success", "Boo! Ghost egg found.", {
        description: "Egg 3 of 3. Did you find the keyboard one?",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={boo}
      aria-label="Boo the ghost (easter egg)"
      title="psst… click me"
      className="ghost-float relative cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <svg
        viewBox="0 0 100 120"
        className="w-28 h-34 sm:w-32 sm:h-38 md:w-40 md:h-48 lg:w-48 lg:h-58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ghost body */}
        <path
          d="M50 10 C25 10 10 35 10 60 L10 100 L20 90 L30 100 L40 90 L50 100 L60 90 L70 100 L80 90 L90 100 L90 60 C90 35 75 10 50 10Z"
          pathLength={1}
          className="ghost-path fill-primary/20 stroke-primary"
          strokeWidth="2"
        />
        {/* Left eye */}
        <circle
          cx="35"
          cy="50"
          r="8"
          className="ghost-pop fill-primary"
          style={{ animationDelay: "0.8s" }}
        />
        {/* Right eye */}
        <circle
          cx="65"
          cy="50"
          r="8"
          className="ghost-pop fill-primary"
          style={{ animationDelay: "0.9s" }}
        />
        {/* Mouth (surprised O) */}
        <ellipse
          cx="50"
          cy="72"
          rx="6"
          ry="8"
          className="ghost-pop fill-primary"
          style={{ animationDelay: "1s" }}
        />
      </svg>

      {/* Glow effect */}
      <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full -z-10" />
    </button>
  );
}

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="grid min-h-[calc(100dvh-3.5rem)] place-items-center px-4 py-8">
      <div className="nf-rise flex flex-col items-center text-center">
        <FloatingGhost />

        <div className="mt-6 sm:mt-8 lg:mt-10 space-y-2 sm:space-y-3 lg:space-y-4">
          <h1
            className="nf-fade text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter text-primary/80"
            style={{ animationDelay: "0.3s" }}
          >
            404
          </h1>
          <h2
            className="nf-fade text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight"
            style={{ animationDelay: "0.4s" }}
          >
            Page Not Found
          </h2>
          <p
            className="nf-fade text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl max-w-md lg:max-w-lg"
            style={{ animationDelay: "0.5s" }}
          >
            This page has ghosted you. It either never existed or has moved
            somewhere else.
          </p>
        </div>

        <div
          className="nf-rise mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3"
          style={{ animationDelay: "0.6s" }}
        >
          <Button
            size="lg"
            onClick={handleGoBack}
            className="rounded-full px-6 lg:px-8 gap-2 group cursor-pointer"
          >
            <MoveLeft className="size-4 lg:size-5 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/")}
            className="rounded-full px-6 lg:px-8 gap-2 group cursor-pointer"
          >
            <Home className="size-4 lg:size-5" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
