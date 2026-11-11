import { PILLARS } from "@/lib/blueprint/constants";
import { weightTotal } from "@/lib/blueprint/format";
import { useBlueprint } from "@/lib/blueprint/store";
import { Button } from "@/components/ui/button";
import { Card, SliderField } from "./field";
import { WeightBar } from "./weight-bar";
import { cn } from "@/lib/utils";

export function ScoringSection() {
  const config = useBlueprint((s) => s.config);
  const setWeight = useBlueprint((s) => s.setWeight);
  const patch = useBlueprint((s) => s.patch);
  const normalize = useBlueprint((s) => s.normalize);
  const total = weightTotal(config);

  return (
    <Card title="Score">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">Regime, technical, and R. Missing data is dropped, not scored as zero.</p>
        <span className={cn("font-mono text-sm tabular-nums", total === 100 ? "text-accent" : "text-warn")}>{total}%</span>
      </div>
      <WeightBar weights={config.weights} />
      {total !== 100 ? (
        <Button variant="secondary" size="sm" onClick={normalize}>
          Normalize to 100%
        </Button>
      ) : null}
      {PILLARS.map((pillar) => (
        <SliderField
          key={pillar.id}
          id={`w-${pillar.id}`}
          label={pillar.label}
          value={config.weights[pillar.id]}
          display={`${config.weights[pillar.id]}`}
          min={0}
          max={100}
          step={5}
          onChange={(value) => setWeight(pillar.id, value)}
        />
      ))}
      <SliderField id="min-gross" label="Min gross R" value={config.minRrr} display={config.minRrr.toFixed(1)} min={1} max={4} step={0.1} onChange={(minRrr) => patch({ minRrr })} />
      <SliderField id="target-cap" label="Target cap R" value={config.targetCapR} display={config.targetCapR.toFixed(1)} min={1.5} max={6} step={0.1} onChange={(targetCapR) => patch({ targetCapR })} />
      <SliderField id="breakout-r" label="Breakout target R" value={config.breakoutTargetR} display={config.breakoutTargetR.toFixed(1)} min={1} max={5} step={0.1} onChange={(breakoutTargetR) => patch({ breakoutTargetR })} />
      <SliderField id="min-net" label="Min net R" value={config.minNetR} display={config.minNetR.toFixed(1)} min={0} max={4} step={0.1} onChange={(minNetR) => patch({ minNetR })} />
    </Card>
  );
}
