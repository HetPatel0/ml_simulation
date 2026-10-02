"use client";

import { catchError, type ErrorInfo } from "next/error";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
};

// Next.js 16.3 custom error boundary: unlike legacy React boundaries it
// leaves notFound()/redirect() alone, and retry() refetches Server
// Components instead of only resetting client state.
function ServerRetryFallback({ title }: Props, { error, retry }: ErrorInfo) {
  const message =
    error instanceof Error ? error.message : "Something went wrong.";

  return (
    <div
      role="alert"
      className="mx-auto my-10 flex max-w-md flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
    >
      <AlertTriangle className="h-7 w-7 text-destructive" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{message}</p>
      <Button variant="secondary" size="sm" onClick={() => retry()}>
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}

export const ServerRetryBoundary = catchError(ServerRetryFallback);
