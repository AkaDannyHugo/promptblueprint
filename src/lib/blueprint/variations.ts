import { TIMEFRAMES } from "./constants.ts";
import { buildPrompt } from "./prompt.ts";
import type { BlueprintConfig, SignalBias, Timeframe } from "./types.ts";

export const VARIATION_KEYS = [
  "entryTf",
  "maxFeesR",
  "targetCapR",
  "riskPerTradePct",
  "signalBias",
  "maxLeverage",
] as const;

export type VariationKey = (typeof VARIATION_KEYS)[number];

export const VARIATION_LABELS: Record<VariationKey, string> = {
  entryTf: "Entry timeframe",
  maxFeesR: "Max fees R",
  targetCapR: "Target cap R",
  riskPerTradePct: "Risk %",
  signalBias: "Side",
  maxLeverage: "Max leverage",
};

const BIASES: SignalBias[] = ["both", "long", "short"];

export function parseVariationValues(key: VariationKey, raw: string): string[] {
  const parts = raw
    .split(/[\s,]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 4);
  const out: string[] = [];
  for (const part of parts) {
    if (key === "entryTf") {
      const tf = TIMEFRAMES.find((item) => item.toLowerCase() === part.toLowerCase());
      if (tf && !out.includes(tf)) out.push(tf);
      continue;
    }
    if (key === "signalBias") {
      const bias = BIASES.find((item) => item === part.toLowerCase());
      if (bias && !out.includes(bias)) out.push(bias);
      continue;
    }
    const n = Number(part);
    if (!Number.isFinite(n)) continue;
    if (key === "maxLeverage" && (n < 1 || n > 4)) continue;
    const text = String(n);
    if (!out.includes(text)) out.push(text);
  }
  return out.length >= 2 ? out : [];
}

function applyValue(config: BlueprintConfig, key: VariationKey, value: string): BlueprintConfig {
  if (key === "entryTf") {
    const entryTf = value as Timeframe;
    const order: Timeframe[] = ["15m", "1H", "4H", "1D", "1W"];
    const entryAt = order.indexOf(entryTf);
    const trendAt = order.indexOf(config.trendTf);
    const trendTf = trendAt >= entryAt ? config.trendTf : (order[Math.min(entryAt + 1, order.length - 1)] ?? entryTf);
    return { ...config, entryTf, trendTf, profile: "custom" };
  }
  if (key === "signalBias") return { ...config, signalBias: value as SignalBias, profile: "custom" };
  const n = Number(value);
  return { ...config, [key]: n, profile: "custom" };
}

export interface VariationRow {
  key: VariationKey;
  value: string;
  separator: string;
  text: string;
}

export function renderVariationValues(
  config: BlueprintConfig,
  key: VariationKey,
  values: string[],
): VariationRow[] {
  return values.slice(0, 4).map((value, index) => ({
    key,
    value,
    separator: `===== VARIANT ${index + 1}: ${key}=${value} =====`,
    text: buildPrompt(applyValue(config, key, value)),
  }));
}

export function joinVariationText(rows: VariationRow[]): string {
  return rows.map((row) => `${row.separator}\n${row.text.trim()}`).join("\n\n");
}
