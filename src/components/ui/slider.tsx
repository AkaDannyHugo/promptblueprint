import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex h-11 w-full touch-none items-center select-none",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-elevated shadow-[var(--shadow-border)]">
        <SliderPrimitive.Range className="absolute h-full bg-accent" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-5 rounded-full bg-fg shadow-[var(--shadow-border)] transition-transform duration-[var(--motion-quick)] ease-[var(--ease-out)] outline-none hover:scale-110 focus-visible:scale-110 focus-visible:ring-2 focus-visible:ring-accent/50 active:scale-100" />
    </SliderPrimitive.Root>
  );
}
