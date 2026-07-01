"use client";

import { forwardRef } from "react";
import { cn } from "../lib/cn";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[96px] w-full rounded-2xl border border-input bg-surface px-4 py-3 text-sm text-foreground",
        "placeholder:text-muted-foreground/70 transition-colors outline-none resize-y",
        "focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
