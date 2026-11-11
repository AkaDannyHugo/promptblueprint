import { useBlueprint } from "@/lib/blueprint/store";
import { Card, SliderField } from "./field";

export function OutputSection() {
  const config = useBlueprint((s) => s.config);
  const patch = useBlueprint((s) => s.patch);
  return (
    <Card title="Guards">
      <p className="text-sm text-muted">Nothing here is saved. Copy the prompt, or keep the link.</p>
      <SliderField
        id="ideas"
        label="Max ideas"
        value={config.numOps}
        display={String(config.numOps)}
        min={1}
        max={8}
        step={1}
        onChange={(numOps) => patch({ numOps })}
      />
      <SliderField
        id="drift"
        label="Max drift"
        hint="Chase beyond this many ATR is a stale entry."
        value={config.maxDriftAtr}
        display={`${config.maxDriftAtr.toFixed(1)} ATR`}
        min={0.1}
        max={2}
        step={0.1}
        onChange={(maxDriftAtr) => patch({ maxDriftAtr })}
      />
      <SliderField
        id="min-score"
        label="Min score"
        value={config.confidence}
        display={String(config.confidence)}
        min={0}
        max={90}
        step={5}
        onChange={(confidence) => patch({ confidence })}
      />
    </Card>
  );
}
