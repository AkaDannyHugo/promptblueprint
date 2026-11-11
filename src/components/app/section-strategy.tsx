import { TIMEFRAMES } from "@/lib/blueprint/constants";
import { useBlueprint } from "@/lib/blueprint/store";
import type { SignalBias, Timeframe } from "@/lib/blueprint/types";
import { Card, SelectField, SliderField } from "./field";

export function StrategySection() {
  const config = useBlueprint((s) => s.config);
  const patch = useBlueprint((s) => s.patch);
  const leverage = config.marketMode === "leverage";

  return (
    <Card title={leverage ? "Futures setup" : "Spot setup"}>
      <SelectField id="entry-tf" label="Entry timeframe" value={config.entryTf} onChange={(entryTf) => patch({ entryTf: entryTf as Timeframe })}>
        {TIMEFRAMES.map((tf) => (
          <option key={tf} value={tf}>{tf}</option>
        ))}
      </SelectField>
      <SelectField id="trend-tf" label="Trend timeframe" value={config.trendTf} onChange={(trendTf) => patch({ trendTf: trendTf as Timeframe })}>
        {TIMEFRAMES.map((tf) => (
          <option key={tf} value={tf}>{tf}</option>
        ))}
      </SelectField>
      <SelectField id="side" label="Side" value={config.signalBias} onChange={(signalBias) => patch({ signalBias: signalBias as SignalBias })}>
        <option value="long">Long</option>
        <option value="short">Short</option>
        <option value="both">Both</option>
      </SelectField>
      <SliderField id="stop-lookback" label="Stop lookback" hint="Closed entry bars." value={config.stopLookback} display={String(config.stopLookback)} min={2} max={20} step={1} onChange={(stopLookback) => patch({ stopLookback })} />
      <SliderField id="swing-lookback" label="Swing lookback" value={config.swingLookback} display={String(config.swingLookback)} min={5} max={40} step={1} onChange={(swingLookback) => patch({ swingLookback })} />
      <SliderField id="min-stop-atr" label="Min stop" hint="Times ATR. Tighter than this is rejected." value={config.minStopAtr} display={`${config.minStopAtr.toFixed(1)} ATR`} min={0.5} max={3} step={0.1} onChange={(minStopAtr) => patch({ minStopAtr })} />
      <SliderField id="max-stop-atr" label="Max stop" value={config.maxStopAtr} display={`${config.maxStopAtr.toFixed(1)} ATR`} min={1} max={4} step={0.1} onChange={(maxStopAtr) => patch({ maxStopAtr })} />
      {!leverage ? (
        <SliderField id="min-stop-pct" label="Min stop %" hint="A tighter spot stop is STOP_TIGHT." value={config.minStopPct} display={`${config.minStopPct.toFixed(1)}%`} min={0.5} max={10} step={0.1} onChange={(minStopPct) => patch({ minStopPct })} />
      ) : (
        <SliderField id="max-hold" label="Max hold" hint="Funding is estimated only this far." value={config.maxHoldH} display={`${config.maxHoldH}h`} min={1} max={168} step={1} onChange={(maxHoldH) => patch({ maxHoldH })} />
      )}
    </Card>
  );
}
