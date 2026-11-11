import { PILLARS } from "@/lib/blueprint/constants";
import type { PillarId } from "@/lib/blueprint/types";
import { cn } from "@/lib/utils";

const TONES: Record<PillarId, string> = {
  regime: "bg-accent",
  technical: "bg-accent/70",
  rr: "bg-accent/40",
};

export function WeightBar({ weights }: { weights: Record<PillarId, number> }) {
  return (
    <div className="grid gap-3">
      <div className="flex h-2 overflow-hidden rounded-full bg-elevated">
        {PILLARS.map((p) => (
          <div
            key={p.id}
            className={cn("weight-seg h-full", TONES[p.id])}
            style={{ width: `${Math.max(weights[p.id], 0)}%` }}
            title={`${p.short} ${weights[p.id]}%`}
          />
        ))}
      </div>
      <ul className="grid grid-cols-3 gap-x-3 gap-y-1.5">
        {PILLARS.map((p) => (
          <li key={p.id} className="flex items-center gap-2 text-xs text-muted">
            <span className={`size-2 rounded-full ${TONES[p.id]}`} />
            <span>{p.short}</span>
            <span className="ml-auto font-mono tabular-nums text-fg">{weights[p.id]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
