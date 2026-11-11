import { useMemo, useState } from "react";
import { toast } from "sonner";
import { copyText } from "@/lib/blueprint/format";
import { useBlueprint } from "@/lib/blueprint/store";
import {
  VARIATION_KEYS,
  VARIATION_LABELS,
  joinVariationText,
  parseVariationValues,
  renderVariationValues,
  type VariationKey,
} from "@/lib/blueprint/variations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function VariationsPanel() {
  const config = useBlueprint((s) => s.config);
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState<VariationKey>("entryTf");
  const [raw, setRaw] = useState("1H, 4H");

  const values = useMemo(() => parseVariationValues(key, raw), [key, raw]);
  const rows = useMemo(
    () => (open && values.length ? renderVariationValues(config, key, values) : []),
    [open, config, key, values],
  );

  async function onCopyAll() {
    if (rows.length < 2) {
      toast.error("Enter 2 to 4 values");
      return;
    }
    const ok = await copyText(joinVariationText(rows));
    if (ok) toast.success(`Copied ${rows.length} variations`);
    else toast.error("Could not copy");
  }

  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="pressable h-11 rounded-full bg-elevated px-3 text-xs font-medium"
        >
          Variations
        </button>
        <p className="text-xs text-muted">One setting, two to four values. Nothing is saved.</p>
      </div>
      {open ? (
        <div className="mt-3 grid gap-3">
          <div className="flex flex-wrap gap-1.5">
            {VARIATION_KEYS.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={key === id}
                onClick={() => {
                  setKey(id);
                  setRaw(id === "entryTf" ? "1H, 4H" : id === "signalBias" ? "long, short" : id === "maxLeverage" ? "2, 3" : "2.5, 3, 3.5");
                }}
                className={cn(
                  "pressable h-11 rounded-full px-3 text-xs font-medium",
                  key === id ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
                )}
              >
                {VARIATION_LABELS[id]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              aria-label="Variation values"
              value={raw}
              onChange={(event) => setRaw(event.target.value)}
              className="max-w-xs"
            />
            <Button size="sm" onClick={() => void onCopyAll()} disabled={rows.length < 2}>
              Copy all
            </Button>
          </div>
          {rows.length ? (
            <ul className="grid gap-1">
              {rows.map((row) => (
                <li key={row.separator} className="truncate font-mono text-xs text-muted">
                  {row.separator} · {row.text.length.toLocaleString()} chars
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted">Need 2 to 4 values.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
