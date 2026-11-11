import { useBlueprint } from "@/lib/blueprint/store";
import type { EntryOrder, FundingLeg } from "@/lib/blueprint/types";
import { Switch } from "@/components/ui/switch";
import { Card, SelectField, SliderField } from "./field";

export function RiskSection() {
  const config = useBlueprint((s) => s.config);
  const patch = useBlueprint((s) => s.patch);
  const leverage = config.marketMode === "leverage";

  return (
    <>
      <Card title="Size">
        <SliderField id="risk-pct" label="Risk per idea" value={config.riskPerTradePct} display={`${config.riskPerTradePct.toFixed(2)}%`} min={0.25} max={2} step={0.05} onChange={(riskPerTradePct) => patch({ riskPerTradePct })} />
        <SliderField id="heat" label="Heat cap" hint="Open risk may be this many times one idea." value={config.heatCapMultiple} display={`${config.heatCapMultiple.toFixed(1)}×`} min={1} max={6} step={0.5} onChange={(heatCapMultiple) => patch({ heatCapMultiple })} />
        {!leverage ? (
          <SliderField id="max-position" label="Max position" value={config.maxPositionPct} display={`${config.maxPositionPct.toFixed(0)}%`} min={5} max={50} step={1} onChange={(maxPositionPct) => patch({ maxPositionPct })} />
        ) : null}
        <SliderField id="equity" label="Fallback equity" hint="Used when no balance comes back, and always for Grok." value={config.equityUsd} display={`$${config.equityUsd.toLocaleString()}`} min={100} max={100000} step={100} onChange={(equityUsd) => patch({ equityUsd })} />
      </Card>
      {leverage ? (
        <Card title="Futures cost">
          <SliderField id="fut-maker" label="Fallback maker" hint="Percent. Live FUTURE fees replace this." value={config.futMakerPct} display={`${config.futMakerPct.toFixed(3)}%`} min={0} max={0.5} step={0.005} onChange={(futMakerPct) => patch({ futMakerPct })} />
          <SliderField id="fut-taker" label="Fallback taker" value={config.futTakerPct} display={`${config.futTakerPct.toFixed(3)}%`} min={0} max={0.5} step={0.005} onChange={(futTakerPct) => patch({ futTakerPct })} />
          <SliderField id="fut-pt" label="Pass-through" hint="Dollars per contract per side. US exchange fee is $0.10. The rest of $0.15 is unverified." value={config.futPassThroughUsd} display={`$${config.futPassThroughUsd.toFixed(2)}`} min={0} max={1} step={0.01} onChange={(futPassThroughUsd) => patch({ futPassThroughUsd })} />
          <SliderField id="max-lev" label="Max leverage" hint="Hard ceiling is 4x. Sizing uses overnight margin." value={config.maxLeverage} display={`${config.maxLeverage.toFixed(1)}x`} min={1} max={4} step={0.5} onChange={(maxLeverage) => patch({ maxLeverage })} />
          <SliderField id="liq-buffer" label="Liquidation buffer" hint="Stop must be inside 1 / this of the distance to the overnight margin line." value={config.liqBufferMultiple} display={`${config.liqBufferMultiple.toFixed(1)}×`} min={1.5} max={4} step={0.1} onChange={(liqBufferMultiple) => patch({ liqBufferMultiple })} />
          <SliderField id="funding-drag" label="Funding drag cap" value={config.fundingDragR} display={`${config.fundingDragR.toFixed(2)}R`} min={0.05} max={0.5} step={0.01} onChange={(fundingDragR) => patch({ fundingDragR })} />
          <div className="flex min-h-11 items-center justify-between gap-4">
            <div>
              <p className="text-sm text-fg">Show intraday margin</p>
              <p className="text-xs text-muted">Display only. The stop still uses overnight margin.</p>
            </div>
            <Switch checked={config.useIntradayMargin} onCheckedChange={(useIntradayMargin) => patch({ useIntradayMargin })} />
          </div>
        </Card>
      ) : (
        <Card title="Spot cost">
          <SelectField id="entry-order" label="Entry" hint="Exit is always taker." value={config.entryOrder} onChange={(entryOrder) => patch({ entryOrder: entryOrder as EntryOrder })}>
            <option value="maker">Maker (post-only)</option>
            <option value="taker">Taker</option>
          </SelectField>
          <SliderField id="rebate" label="Fee rebate" hint="Coinbase One Preferred is 25%, paid in USDC, cap $100 a month." value={config.rebatePct} display={`${config.rebatePct.toFixed(0)}%`} min={0} max={25} step={1} onChange={(rebatePct) => patch({ rebatePct })} />
          <SliderField id="rebate-cap" label="Rebate cap" value={config.rebateCapUsd} display={`$${config.rebateCapUsd.toFixed(0)}`} min={0} max={500} step={10} onChange={(rebateCapUsd) => patch({ rebateCapUsd })} />
          <SelectField id="funding-leg" label="Funding leg" value={config.fundingLeg} onChange={(fundingLeg) => patch({ fundingLeg: fundingLeg as FundingLeg })}>
            <option value="quote">Quote (2 legs)</option>
            <option value="btc">BTC (4 legs off a BTC book)</option>
          </SelectField>
          <SliderField id="fallback-taker" label="Fallback taker bps" hint="Used only if the live fee read fails." value={config.defaultFeeBps} display={`${config.defaultFeeBps} bps`} min={0} max={150} step={1} onChange={(defaultFeeBps) => patch({ defaultFeeBps })} />
          <SliderField id="fallback-maker" label="Fallback maker bps" value={config.fallbackMakerBps} display={`${config.fallbackMakerBps} bps`} min={0} max={100} step={1} onChange={(fallbackMakerBps) => patch({ fallbackMakerBps })} />
          <SliderField id="max-fees" label="Max fees R" value={config.maxFeesR} display={`${config.maxFeesR.toFixed(2)}R`} min={0.1} max={1} step={0.05} onChange={(maxFeesR) => patch({ maxFeesR })} />
        </Card>
      )}
    </>
  );
}
