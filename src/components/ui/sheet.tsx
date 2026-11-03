import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetTitle = DialogPrimitive.Title;
const SheetDescription = DialogPrimitive.Description;

/**
 * Full screen on a phone, right hand drawer from the large breakpoint up.
 */
const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: "right" | "bottom";
  }
>(({ className, children, side = "right", ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink-900/60 data-[state=open]:animate-fade-in" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col bg-surface shadow-lift focus:outline-none",
        side === "right"
          ? "inset-0 data-[state=open]:animate-slide-in-bottom lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[30rem] lg:border-l lg:border-surface-line lg:data-[state=open]:animate-slide-in-right"
          : "inset-x-0 bottom-0 max-h-[85vh] rounded-t-xl border-t border-surface-line data-[state=open]:animate-slide-in-bottom",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-md bg-surface-raised/90 text-ink-600 shadow-card hover:text-ink-900 focus:outline-none">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };
