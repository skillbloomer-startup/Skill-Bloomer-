"use client"

import * as React from "react"
import {
  Dialog as BaseDialog,
  DialogContent as BaseDialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/src/lib/utils"
import type { GlassCustomization } from "@/src/lib/glass-utils"
import { hoverEffects, type HoverEffect } from "@/src/lib/hover-effects"

export interface DialogContentProps extends Omit<React.ComponentProps<typeof BaseDialogContent>, "glass"> {
  variant?: "default" | "glass" | "glassSubtle" | "frosted" | "fluted" | "crystal"
  animated?: boolean
  hover?: HoverEffect
  glass?: GlassCustomization
}

/**
 * Glass UI Dialog - Enhanced dialog with glassy effects and animations
 * 
 * @example
 * ```tsx
 * <DialogContent 
 *   glass={{
 *     color: "rgba(139, 92, 246, 0.15)",
 *     blur: 40,
 *     outline: "rgba(139, 92, 246, 0.3)"
 *   }}
 * >
 *   Dialog content
 * </DialogContent>
 * ```
 */
export const GlassDialogContent = React.forwardRef<
  React.ElementRef<typeof BaseDialogContent>,
  DialogContentProps
>(({ className, variant = "glass", animated = true, hover = "none", glass, children, ...props }, ref) => {
  return (
    <BaseDialogContent
      ref={ref}
      variant={variant}
      glass={glass}
      className={cn(
        "relative overflow-hidden",
        animated && "backdrop-blur-[var(--blur-lg)]",
        hoverEffects({ hover }),
        className
      )}
      {...props}
    >
      {children}
    </BaseDialogContent>
  )
})
GlassDialogContent.displayName = "GlassDialogContent"

export {
  BaseDialog as GlassDialog,
  DialogTrigger as GlassDialogTrigger,
  DialogHeader as GlassDialogHeader,
  DialogFooter as GlassDialogFooter,
  DialogTitle as GlassDialogTitle,
  DialogDescription as GlassDialogDescription,
}

