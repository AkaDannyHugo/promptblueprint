import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function IconSwap({
  show,
  children,
  alt,
}: {
  show: boolean;
  children: ReactNode;
  alt: ReactNode;
}) {
  return (
    <span className="relative grid size-4 place-items-center">
      <span
        data-show={show ? "true" : "false"}
        className="icon-swap col-start-1 row-start-1"
      >
        {children}
      </span>
      <span
        data-show={show ? "false" : "true"}
        className="icon-swap col-start-1 row-start-1"
      >
        {alt}
      </span>
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="notice-in grid justify-items-center gap-2 rounded-2xl bg-elevated px-4 py-8 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-surface text-accent shadow-[var(--shadow-border)]">
        <Icon className="size-4" strokeWidth={1.75} />
      </span>
      <p className="text-sm font-medium text-fg">{title}</p>
      <p className="max-w-sm text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

export function QuietEmpty({ children }: { children: ReactNode }) {
  return (
    <p className="notice-in rounded-lg bg-elevated px-3 py-3 text-sm leading-relaxed text-muted shadow-[var(--shadow-border)]">
      {children}
    </p>
  );
}
