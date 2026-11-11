import { PILLARS, PROFILE_META, TARGET_OPTIONS } from "./constants.ts";
import type { BlueprintConfig, Target } from "./types.ts";

export function formatUsd(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1_000_000) {
    const m = value / 1e6;
    return Number.isInteger(m) ? `$${m}M` : `$${m.toFixed(1)}M`;
  }
  if (value >= 1_000) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value}`;
}

export function estimateTokens(text: string): number {
  return Math.max(1, Math.round(text.length / 4));
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function targetLabel(id: Target): string {
  return TARGET_OPTIONS.find((row) => row.id === id)?.label ?? "Grok Bot";
}

export function profileLabel(config: BlueprintConfig): string {
  if (config.profile === "custom") return "Custom";
  return PROFILE_META[config.profile]?.label ?? "Custom";
}

export function weightTotal(config: BlueprintConfig): number {
  return Object.values(config.weights).reduce((sum, n) => sum + n, 0);
}

export function normalizeTicker(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
}

export function parseTickerInput(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(/[\s,;]+/)) {
    const ticker = normalizeTicker(part);
    if (!ticker || seen.has(ticker)) continue;
    seen.add(ticker);
    out.push(ticker);
  }
  return out;
}

export function clampWeights(weights: BlueprintConfig["weights"]): BlueprintConfig["weights"] {
  const next = { ...weights };
  for (const pillar of PILLARS) {
    const value = Number(next[pillar.id]);
    next[pillar.id] = Number.isFinite(value) ? Math.min(pillar.max, Math.max(0, value)) : 0;
  }
  return next;
}

export function normalizeWeights(weights: BlueprintConfig["weights"]): BlueprintConfig["weights"] {
  const total = Object.values(weights).reduce((sum, n) => sum + n, 0);
  if (total === 100 || total === 0) return { ...weights };
  const ids = Object.keys(weights) as (keyof BlueprintConfig["weights"])[];
  const raw = ids.map((id) => (weights[id] / total) * 100);
  const rounded = raw.map((n) => Math.round(n / 5) * 5);
  let drift = 100 - rounded.reduce((s, n) => s + n, 0);
  const order = ids
    .map((id, i) => ({ id, frac: raw[i]! - rounded[i]! }))
    .sort((a, b) => (drift > 0 ? b.frac - a.frac : a.frac - b.frac));
  const next = { ...weights };
  ids.forEach((id, i) => {
    next[id] = rounded[i]!;
  });
  let i = 0;
  while (drift !== 0 && i < order.length * 4) {
    const id = order[i % order.length]!.id;
    const step = drift > 0 ? 5 : -5;
    const candidate = next[id] + step;
    const cap = PILLARS.find((pillar) => pillar.id === id)?.max ?? 100;
    if (candidate >= 0 && candidate <= cap) {
      next[id] = candidate;
      drift -= step;
    }
    i += 1;
  }
  return next;
}

export function downloadText(filename: string, contents: string, mime: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}
