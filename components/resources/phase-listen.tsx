"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, RotateCw, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PhaseListen({ src, title }: { src: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => () => audioRef.current?.pause(), []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (audio.ended) audio.currentTime = 0;
      setFailed(false);
      void audio.play().catch(() => setFailed(true));
    } else {
      audio.pause();
    }
  };

  const skipBy = (delta: number) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(audio.duration)) return;
    audio.currentTime = Math.min(
      Math.max(audio.currentTime + delta, 0),
      Math.max(audio.duration - 0.1, 0),
    );
    if (audio.paused) void audio.play().catch(() => setFailed(true));
  };

  return (
    <div className="inline-flex">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setFailed(true);
        }}
      />
      <div className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => skipBy(-15)}
          aria-label="Rewind 15 seconds"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs transition-colors hover:border-primary/50 hover:text-primary"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause ${title}` : `Listen to ${title}`}
          title={failed ? "Audio could not load — retry" : playing ? "Pause" : "Listen"}
          className={cn(
            "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm font-medium shadow-xs transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            playing
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary",
            failed && "border-destructive/50 text-destructive",
          )}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-primary" />}
          {playing ? "Pause" : failed ? "Retry audio" : "Listen"}
          {!playing && <Play className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={() => skipBy(15)}
          aria-label="Forward 15 seconds"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs transition-colors hover:border-primary/50 hover:text-primary"
        >
          <RotateCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
