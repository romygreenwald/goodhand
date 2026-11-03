import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-md border-2 border-surface-line bg-surface-raised px-3 text-base text-ink-900 placeholder:text-ink-300 focus-visible:border-ink-600 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-surface-sunk disabled:text-ink-400",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
