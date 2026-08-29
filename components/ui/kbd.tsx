import * as React from "react";

import { cn } from "@/lib/utils";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-black/10 bg-black/[0.06] px-1.5 font-sans text-[11px] font-medium text-foreground shadow-[inset_0_-1px_0_rgba(0,0,0,0.12)] dark:border-white/15 dark:bg-white/10 dark:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
