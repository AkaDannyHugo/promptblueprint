import { TARGET_OPTIONS } from "./constants.ts";
import { profileLabel } from "./format.ts";
import type { BlueprintConfig } from "./types.ts";

export function num(value: number): string {
  if (!Number.isFinite(value)) return "na";
  const rounded = Math.round(value * 1000) / 1000;
  return String(rounded);
}

export function profileTitle(config: BlueprintConfig): string {
  if (config.profile === "custom") return "Custom";
  return profileLabel(config);
}

export function targetTitle(config: BlueprintConfig): string {
  return TARGET_OPTIONS.find((row) => row.id === config.target)?.label ?? "Grok Bot";
}

export function headerLine(config: BlueprintConfig): string {
  const mode = config.marketMode === "leverage" ? "Leverage" : "Spot";
  return `PROMPT BLUEPRINT v5.1 | ${profileTitle(config)} | ${targetTitle(config)} | ${mode}`;
}

export function indicatorBlock(): string {
  return [
    "D DEFINITIONS",
    "Closed bars only. Compute in code.",
    "D1 Drop a candle whose start plus its granularity is after now. Sort ascending. Dedupe by start.",
    "D2 ATR14 Wilder. TR = max(h-l, abs(h-prev close), abs(l-prev close)). Seed = mean of the first 14 TR, then (13 x prior + TR)/14. ATR% = ATR/last close x 100. Fewer than 15 bars -> na.",
    "D3 1W = ISO weeks from closed 1d candles (Monday 00:00 UTC). Open first, high max, low min, close last, volume sum. Drop the partial week.",
    "D4 RSI14 Wilder. Seed avgGain and avgLoss on the first 14 changes, then (13 x prev + x)/14. RSI = 100 - 100/(1+avgGain/avgLoss). avgLoss 0 -> 100.",
    "D5 SMA20 of closes. UP if close > SMA20 and SMA20 > SMA20 of five bars earlier. DOWN if both reverse. Else FLAT. Fewer than 25 bars -> na.",
    "D6 EMA20, only if a step cites it: alpha = 2/21, seed = SMA20. Do not invent an EMA use.",
    "D7 BREAKOUT = close > max high of the prior SWING_LOOKBACK bars. CONTINUATION = entry trend equals the side and the last-10 min low is above the prior-10 min low. SWEEP_RECLAIM = one of the last 3 bars takes the 20-bar extreme and the last close reclaims it.",
    "D8 VWAP = sum(typical price x volume) / sum(volume). 15m and 1H from 00:00 UTC. 4H last 42 bars. 1D last 20. Zero volume -> na.",
    "D9 Regime = BTC-USD trend on TREND_TF. Long: UP 1, FLAT 0.5, DOWN 0. Short mirrors. The BTC idea itself is na.",
  ].join("\n");
}
