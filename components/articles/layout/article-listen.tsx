"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { articleAudio, articleSubtitles } from "@/lib/article-audio";

type Cue = { start: number; end: number; text: string };

function toSec(t: string): number {
  const parts = t.trim().split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
}

/** Minimal WEBVTT parse: header + blank-line-separated cues. */
function parseVtt(src: string): Cue[] {
  const cues: Cue[] = [];
  for (const block of src.split(/\r?\n\r?\n/)) {
    const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2 || lines[0] === "WEBVTT") continue;
    const m = lines[0].match(/(.+?)\s*-->\s*(.+)/);
    if (!m) continue;
    const text = lines.slice(1).join(" ");
    if (!text) continue;
    cues.push({ start: toSec(m[1]), end: toSec(m[2]), text });
  }
  return cues;
}

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type ArticleListenProps = {
  title: string;
  className?: string;
};

/**
 * Compact inline TTS controls (OpenAI-style): a Listen pill that expands
 * into play/pause + back/forward 15s + speed cycler. No timeline. Plays a
 * pre-generated file from `public/audio/articles/<slug>.mp3` (see
 * `lib/article-audio.ts` + `scripts/generate-article-audio.mjs`). Renders
 * nothing when the article has no audio file yet.
 */
const SPEEDS = [1, 1.25, 1.5, 1.75, 2];

export function ArticleListen({ title, className }: ArticleListenProps) {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : null;
  const src = slug ? (articleAudio[slug] ?? null) : null;
  const vttSrc = slug ? (articleSubtitles[slug] ?? null) : null;

  const [expanded, setExpanded] = useState(false);
  // Ref (not state): avoids set-state-in-effect, no extra render.
  const autoPlayRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [cues, setCues] = useState<Cue[]>([]);
  const [ccOn, setCcOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      setFailed(true);
      setIsPlaying(false);
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [expanded, src]);

  useEffect(() => () => audioRef.current?.pause(), []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[speedIndex];
  }, [speedIndex, expanded, src]);

  // Captions load lazily with the player; tiny text file, cached by headers.
  useEffect(() => {
    if (!expanded || !vttSrc) return;
    let dead = false;
    fetch(vttSrc)
      .then((r) => (r.ok ? r.text() : ""))
      .then((t) => {
        if (!dead && t) setCues(parseVtt(t));
      })
      .catch(() => {});
    return () => {
      dead = true;
    };
  }, [expanded, vttSrc]);

  // Tapping Listen expands AND starts playback — the tap is a user gesture,
  // so autoplay is allowed. Runs after the <audio> element mounts.
  useEffect(() => {
    if (expanded && autoPlayRef.current) {
      autoPlayRef.current = false;
      const audio = audioRef.current;
      if (audio) {
        if (audio.ended) audio.currentTime = 0;
        void audio.play().catch(() => setFailed(true));
      }
    }
  }, [expanded]);

  if (!src) return null;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      if (audio.ended) audio.currentTime = 0;
      void audio.play().catch(() => setFailed(true));
    }
  };

  const skipBy = (delta: number) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(audio.duration)) return;
    audio.currentTime = Math.min(
      Math.max(audio.currentTime + delta, 0),
      Math.max(audio.duration - 0.1, 0),
    );
    // Tapping skip starts playback, like native podcast players.
    if (audio.paused) void audio.play().catch(() => setFailed(true));
  };

  const cycleSpeed = () => {
    const next = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(next);
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[next];
  };

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => {
          setFailed(false);
          autoPlayRef.current = true;
          setExpanded(true);
        }}
        aria-label={`Listen to ${title}`}
        title="Listen to this article"
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground shadow-xs transition-colors",
          "hover:border-primary/50 hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
        )}
      >
        <Volume2 className="h-4 w-4 text-primary" />
        Listen
      </button>
    );
  }

  const pill =
    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  const activeCue =
    ccOn && isPlaying
      ? cues.find((c) => currentTime >= c.start && currentTime < c.end)
      : undefined;

  return (
    <div className={cn("inline-flex max-w-full flex-col gap-1.5", className)}>
    <div
      className={cn(
        "inline-flex h-9 items-center gap-0.5 rounded-full border border-border bg-card pr-1 pl-1 shadow-xs",
        failed && "border-destructive/50",
      )}
      role="group"
      aria-label={`Audio player: ${title}`}
    >
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        title={failed ? "Audio failed to load — retry" : isPlaying ? "Pause" : "Play"}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        )}
      </button>
      <button
        type="button"
        onClick={() => skipBy(-15)}
        aria-label="Back 15 seconds"
        className={cn(pill, "relative")}
      >
        <RotateCcw className="h-4 w-4" />
        <span className="absolute text-[7px] font-bold">15</span>
      </button>
      <button
        type="button"
        onClick={() => skipBy(15)}
        aria-label="Forward 15 seconds"
        className={cn(pill, "relative")}
      >
        <RotateCw className="h-4 w-4" />
        <span className="absolute text-[7px] font-bold">15</span>
      </button>
      <span className="px-1.5 text-xs tabular-nums text-muted-foreground">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
      <button
        type="button"
        onClick={cycleSpeed}
        aria-label={`Playback speed: ${SPEEDS[speedIndex]}x. Activate to change.`}
        title="Playback speed"
        className="flex h-9 cursor-pointer items-center rounded-full px-2 text-xs font-semibold tabular-nums text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {SPEEDS[speedIndex]}x
      </button>
      <button
        type="button"
        onClick={() => vttSrc && setCcOn((v) => !v)}
        disabled={!vttSrc}
        aria-pressed={ccOn}
        aria-label={vttSrc ? "Toggle captions" : "No captions yet for this article"}
        title={vttSrc ? "Toggle captions" : "Captions appear after audio is regenerated"}
        className={cn(
          "flex h-9 cursor-pointer items-center rounded-full px-2 text-xs font-bold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:opacity-40",
          ccOn
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
        )}
      >
        CC
      </button>
      {failed && (
        <span className="px-2 text-xs text-destructive">Audio unavailable</span>
      )}
    </div>
    {activeCue && (
      <p
        aria-live="polite"
        className="max-w-80 rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs leading-relaxed text-foreground"
      >
        {activeCue.text}
      </p>
    )}
    </div>
  );
}
