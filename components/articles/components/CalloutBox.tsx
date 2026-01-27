"use client";

import {
  Lightbulb,
  AlertTriangle,
  Info,
  BookOpen,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "tip" | "warning" | "note" | "info" | "example";

interface CalloutBoxProps {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const calloutConfig: Record<
  CalloutType,
  {
    icon: LucideIcon;
    defaultTitle: string;
    containerClass: string;
    iconClass: string;
    titleClass: string;
  }
> = {
  tip: {
    icon: Lightbulb,
    defaultTitle: "Pro Tip",
    containerClass: "bg-emerald-500/5 border-emerald-500/50 dark:bg-emerald-500/10 dark:border-emerald-500/30",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    titleClass: "text-emerald-700 dark:text-emerald-300",
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: "Watch Out",
    containerClass: "bg-amber-500/5 border-amber-500/50 dark:bg-amber-500/10 dark:border-amber-500/30",
    iconClass: "text-amber-600 dark:text-amber-400",
    titleClass: "text-amber-700 dark:text-amber-300",
  },
  note: {
    icon: Info,
    defaultTitle: "Did You Know?",
    containerClass: "bg-sky-500/5 border-sky-500/50 dark:bg-sky-500/10 dark:border-sky-500/30",
    iconClass: "text-sky-600 dark:text-sky-400",
    titleClass: "text-sky-700 dark:text-sky-300",
  },
  info: {
    icon: Info,
    defaultTitle: "Info",
    containerClass: "bg-muted/50 border-border dark:bg-muted/30",
    iconClass: "text-muted-foreground",
    titleClass: "text-foreground",
  },
  example: {
    icon: BookOpen,
    defaultTitle: "Real Talk",
    containerClass: "bg-violet-500/5 border-violet-500/50 dark:bg-violet-500/10 dark:border-violet-500/30",
    iconClass: "text-violet-600 dark:text-violet-400",
    titleClass: "text-violet-700 dark:text-violet-300",
  },
};

export function CalloutBox({
  type,
  title,
  children,
  className,
}: CalloutBoxProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <div
      className={cn(
        "my-6 p-4 rounded-xl border-l-4 border",
        config.containerClass,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
          type === "tip" && "bg-emerald-500/10",
          type === "warning" && "bg-amber-500/10",
          type === "note" && "bg-sky-500/10",
          type === "info" && "bg-muted",
          type === "example" && "bg-violet-500/10",
        )}>
          <Icon className={cn("h-4 w-4", config.iconClass)} />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className={cn("font-semibold text-sm mb-1.5", config.titleClass)}>
            {displayTitle}
          </p>
          <div className="text-sm text-foreground/80 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mt-2 [&>ul]:space-y-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Fun variant for "aha moments"
export function AhaBox({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "my-6 p-4 rounded-xl border-l-4 border bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-indigo-500/5 border-pink-500/50 dark:from-pink-500/10 dark:via-purple-500/10 dark:to-indigo-500/10 dark:border-pink-500/30",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20">
          <Sparkles className="h-4 w-4 text-pink-600 dark:text-pink-400" />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="font-semibold text-sm mb-1.5 text-pink-700 dark:text-pink-300">
            Aha! Here&apos;s the cool part...
          </p>
          <div className="text-sm text-foreground/80 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
