import { useState } from "react";
import { X } from "lucide-react";
import { QUOTES } from "@/lib/blueprint/constants";
import { formatUsd, parseTickerInput } from "@/lib/blueprint/format";
import { useBlueprint } from "@/lib/blueprint/store";
import type { Quote } from "@/lib/blueprint/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, SelectField, SliderField } from "./field";
import { cn } from "@/lib/utils";

export function UniverseSection() {
  const config = useBlueprint((s) => s.config);
  const patch = useBlueprint((s) => s.patch);
  const leverage = config.marketMode === "leverage";

  function toggleQuote(quote: Quote) {
    const has = config.quotes.includes(quote);
    const next = has ? config.quotes.filter((item) => item !== quote) : [...config.quotes, quote];
    if (!next.length) return;
    patch({ quotes: next });
  }

  return (
    <>
      {leverage ? (
        <Card title="Futures universe">
          <SliderField
            id="min-vol-contracts"
            label="Min 24h volume"
            hint="Contracts, not dollars. Thin books are skipped."
            value={config.minVolContracts}
            display={config.minVolContracts.toLocaleString()}
            min={0}
            max={100000}
            step={1000}
            onChange={(minVolContracts) => patch({ minVolContracts })}
          />
          <SliderField
            id="min-oi"
            label="Min open interest"
            hint="Contracts. A name under this is skipped."
            value={config.minOiContracts}
            display={config.minOiContracts.toLocaleString()}
            min={0}
            max={100000}
            step={1000}
            onChange={(minOiContracts) => patch({ minOiContracts })}
          />
          <div className="flex min-h-11 items-center justify-between gap-4">
            <div>
              <p className="text-sm text-fg">Include metals, energy, and indexes</p>
              <p className="text-xs text-muted">Off keeps crypto perp-style contracts only.</p>
            </div>
            <Switch
              checked={config.includeNonCrypto}
              onCheckedChange={(includeNonCrypto) => patch({ includeNonCrypto })}
            />
          </div>
        </Card>
      ) : (
        <Card title="Spot universe">
          <SelectField
            id="universe-size"
            label="Universe size"
            hint="How many names survive the volume rank before the candle pass."
            value={String(config.universeSize)}
            onChange={(value) => patch({ universeSize: Number(value) as 50 | 100 | 200 | 500 })}
          >
            <option value="50">Top 50</option>
            <option value="100">Top 100</option>
            <option value="200">Top 200</option>
            <option value="500">Top 500</option>
          </SelectField>
          <SliderField
            id="min-volume"
            label="Min 24h volume"
            hint="Quote notional. BTC-quoted books must clear the same floor."
            value={config.minVolume}
            display={formatUsd(config.minVolume)}
            min={1000000}
            max={50000000}
            step={1000000}
            onChange={(minVolume) => patch({ minVolume })}
          />
          <SliderField
            id="max-spread"
            label="Max spread"
            value={config.maxSpreadBps}
            display={`${config.maxSpreadBps} bps`}
            min={1}
            max={50}
            step={1}
            onChange={(maxSpreadBps) => patch({ maxSpreadBps })}
          />
          <div className="flex flex-wrap gap-1.5">
            {QUOTES.map((quote) => {
              const on = config.quotes.includes(quote);
              return (
                <button
                  key={quote}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleQuote(quote)}
                  className={cn(
                    "pressable h-11 rounded-full px-3 text-xs font-medium",
                    on ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
                  )}
                >
                  {quote}
                </button>
              );
            })}
          </div>
          <fieldset className="grid gap-3">
            <legend className="text-xs font-medium uppercase tracking-widest text-muted">Exclusions</legend>
            <Exclusion id="exclude-stables" label="Exclude stablecoins" checked={config.excludeStables} onChange={(excludeStables) => patch({ excludeStables })} />
            <Exclusion id="exclude-wrapped" label="Exclude wrapped assets" checked={config.excludeWrapped} onChange={(excludeWrapped) => patch({ excludeWrapped })} />
            <Exclusion id="exclude-new" label="Exclude new listings (<30d)" checked={config.excludeNew} onChange={(excludeNew) => patch({ excludeNew })} />
          </fieldset>
        </Card>
      )}
      <TickerListCard title="Core list" hint="Used when the product list comes back short." values={config.coreUniverse} onChange={(coreUniverse) => patch({ coreUniverse })} placeholder={leverage ? "BIP, ETP" : "BTC-USD, ETH-USD"} />
      <TickerListCard title="Watchlist" hint="Always added when the product is returned." values={config.watchlist} onChange={(watchlist) => patch({ watchlist })} placeholder="ETH-USD" />
      <TickerListCard title="Denylist" hint="Base or full product id." values={config.denylist} onChange={(denylist) => patch({ denylist })} placeholder="DOGE-USD" />
    </>
  );
}

function Exclusion({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex min-h-11 items-center justify-between gap-3 text-sm">
      {label}
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} />
    </label>
  );
}

function TickerListCard({
  title,
  hint,
  values,
  onChange,
  placeholder,
}: {
  title: string;
  hint: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  function add() {
    const incoming = parseTickerInput(draft);
    if (!incoming.length) return;
    const next = [...values];
    for (const ticker of incoming) {
      if (!next.includes(ticker) && next.length < 40) next.push(ticker);
    }
    onChange(next);
    setDraft("");
  }
  return (
    <Card title={title}>
      <p className="text-xs text-muted">{hint}</p>
      <div className="flex gap-2">
        <Input value={draft} placeholder={placeholder} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <Button type="button" variant="secondary" onClick={add} disabled={!draft.trim()}>Add</Button>
      </div>
      {values.length ? (
        <ul className="flex flex-wrap gap-1.5">
          {values.map((ticker) => (
            <li key={ticker}>
              <button
                type="button"
                className="pressable inline-flex h-9 items-center gap-1 rounded-full bg-elevated px-2.5 font-mono text-xs"
                onClick={() => onChange(values.filter((item) => item !== ticker))}
              >
                {ticker}
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted">None yet.</p>
      )}
    </Card>
  );
}
