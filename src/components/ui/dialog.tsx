import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  title,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { title: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-50 bg-bg/70" />
      <DialogPrimitive.Content
        className={cn(
          "dialog-panel fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[min(92vw,40rem)] overflow-y-auto rounded-3xl bg-surface p-4 text-fg shadow-[var(--shadow-border)] outline-none",
          className,
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-4 px-2 pt-2">
          <DialogPrimitive.Title className="font-display text-2xl leading-tight">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Close">
              <X className="size-4" />
            </Button>
          </DialogPrimitive.Close>
        </div>
        <div className="px-2 pt-4 pb-2">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
