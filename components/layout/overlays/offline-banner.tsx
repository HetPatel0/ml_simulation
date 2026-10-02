"use client";

import * as React from "react";
import { WifiOff } from "lucide-react";
import { useOffline } from "next/offline";

export function OfflineBanner() {
  // Next.js 16.3 network resilience: with experimental.useOffline enabled,
  // soft navs/fetches stay pending offline and retry on reconnect.
  // useOffline() surfaces that framework-level state.
  const isOffline = useOffline();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[60] flex items-center justify-center gap-2 bg-destructive px-4 py-1.5 text-xs font-medium text-white"
    >
      <WifiOff className="h-3.5 w-3.5" />
      You are offline. Retrying when you reconnect.
    </div>
  );
}
