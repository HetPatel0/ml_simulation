"use client";

import { toast } from "sonner";

export type ToastKind =
  | "success"
  | "error"
  | "loading"
  | "info"
  | "warning"
  | "dismiss";

export type ToastOptions = {
  id?: string;
  description?: string;
  duration?: number;
};

/** Thin wrapper over Sonner so call sites do not care which import path. */
export function notify(
  kind: ToastKind,
  message: string,
  options?: ToastOptions,
) {
  if (kind === "dismiss") {
    toast.dismiss(message);
    return;
  }

  const fire = toast[kind] as (
    text: string,
    opts?: ToastOptions,
  ) => void;
  fire(message, options);
}
