"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

function TooltipProvider({
  delayDuration = 200,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipPrimitive.Root data-slot="tooltip" {...props} />
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return (
    <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
  )
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "relative bg-primary text-primary-foreground text-xs px-2.5 py-1.5 rounded-md shadow-md z-50 max-w-xs",
          "after:absolute after:h-0 after:w-0 after:border-solid after:content-['']",
          "data-[side=bottom]:after:-top-[5px] data-[side=bottom]:after:left-1/2 data-[side=bottom]:after:-translate-x-1/2 data-[side=bottom]:after:border-x-[5px] data-[side=bottom]:after:border-x-transparent data-[side=bottom]:after:border-b-[5px] data-[side=bottom]:after:border-b-primary",
          "data-[side=top]:after:-bottom-[5px] data-[side=top]:after:left-1/2 data-[side=top]:after:-translate-x-1/2 data-[side=top]:after:border-x-[5px] data-[side=top]:after:border-x-transparent data-[side=top]:after:border-t-[5px] data-[side=top]:after:border-t-primary",
          "data-[side=left]:after:-right-[5px] data-[side=left]:after:top-1/2 data-[side=left]:after:-translate-y-1/2 data-[side=left]:after:border-y-[5px] data-[side=left]:after:border-y-transparent data-[side=left]:after:border-l-[5px] data-[side=left]:after:border-l-primary",
          "data-[side=right]:after:-left-[5px] data-[side=right]:after:top-1/2 data-[side=right]:after:-translate-y-1/2 data-[side=right]:after:border-y-[5px] data-[side=right]:after:border-y-transparent data-[side=right]:after:border-r-[5px] data-[side=right]:after:border-r-primary",
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
          className
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
