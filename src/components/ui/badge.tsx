import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-semibold leading-5",
  {
    variants: {
      variant: {
        neutral: "border-surface-line bg-surface-sunk text-ink-600",
        ink: "border-ink-800 bg-ink-800 text-white",
        safety: "border-safety/30 bg-safety-soft text-safety-dark",
        ok: "border-ok/25 bg-ok-soft text-ok",
        warn: "border-warn/25 bg-warn-soft text-warn",
        bad: "border-bad/25 bg-bad-soft text-bad",
        outline: "border-ink-300 bg-transparent text-ink-600",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
