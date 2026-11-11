/** Reference math for contract rules D2, D3, D4, D12, D13, and the universe truncation test. Synthetic fixtures only. */

export interface Bar {
  start: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type SetupName = "BREAKOUT" | "CONTINUATION" | "SWEEP_RECLAIM" | "MEAN_REVERT";

const SETUP_MULT: Record<SetupName, number> = {
  BREAKOUT: 1,
  CONTINUATION: 1,
  SWEEP_RECLAIM: 0.85,
  MEAN_REVERT: 0.7,
};

export function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

export function trueRanges(bars: Bar[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < bars.length; i += 1) {
    const bar = bars[i]!;
    const prev = bars[i - 1]!.close;
    out.push(Math.max(bar.high - bar.low, Math.abs(bar.high - prev), Math.abs(bar.low - prev)));
  }
  return out;
}

/** Wilder ATR14. Seed is the mean of the first 14 true ranges. Needs 15 bars. */
export function atr14(bars: Bar[]): number | null {
  if (bars.length < 15) return null;
  const tr = trueRanges(bars);
  if (tr.length < 14) return null;
  let atr = tr.slice(0, 14).reduce((sum, n) => sum + n, 0) / 14;
  for (let i = 14; i < tr.length; i += 1) atr = (13 * atr + tr[i]!) / 14;
  return atr;
}

export function atrPercent(bars: Bar[]): number | null {
  const atr = atr14(bars);
  const close = bars[bars.length - 1]?.close;
  if (atr == null || !close) return null;
  return (atr / close) * 100;
}

export function sma(values: number[], length: number): number | null {
  if (values.length < length) return null;
  const slice = values.slice(values.length - length);
  return slice.reduce((sum, n) => sum + n, 0) / length;
}

/** Wilder RSI14. Seed is the mean of the first 14 changes. */
export function rsi14(closes: number[]): number | null {
  if (closes.length < 15) return null;
  const changes: number[] = [];
  for (let i = 1; i < closes.length; i += 1) changes.push(closes[i]! - closes[i - 1]!);
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 0; i < 14; i += 1) {
    const change = changes[i]!;
    if (change >= 0) avgGain += change;
    else avgLoss -= change;
  }
  avgGain /= 14;
  avgLoss /= 14;
  for (let i = 14; i < changes.length; i += 1) {
    const change = changes[i]!;
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    avgGain = (13 * avgGain + gain) / 14;
    avgLoss = (13 * avgLoss + loss) / 14;
  }
  if (avgLoss === 0) return 100;
  return 100 - 100 / (1 + avgGain / avgLoss);
}

export function targetAndR(input: {
  entry: number;
  stop: number;
  swingHigh: number;
  taker: number;
  legs: number;
  targetCapR: number;
  breakoutTargetR: number;
  setup: SetupName;
}): {
  target: number;
  grossR: number;
  feesR: number;
  netR: number;
  expR: number;
  measured: boolean;
} {
  const risk = input.entry - input.stop;
  let measured = false;
  let target: number;
  if (input.setup === "BREAKOUT" || input.swingHigh <= input.entry) {
    target = input.entry + input.breakoutTargetR * risk;
    measured = true;
  } else {
    target = input.swingHigh;
  }
  const capped = input.entry + input.targetCapR * risk;
  if (target > capped) target = capped;
  const grossR = (target - input.entry) / risk;
  const feesR = (input.legs * input.taker * input.entry) / risk;
  const netR = grossR - feesR;
  const expR = grossR * SETUP_MULT[input.setup] - feesR;
  return { target, grossR, feesR, netR, expR, measured };
}

/** The retired v4.4 spot rule: target is the nearer of the swing and the floor. */
export function legacyTargetNet(entry: number, stop: number, swingHigh: number, minGrossR: number, taker: number, legs: number) {
  const risk = entry - stop;
  const floorTarget = entry + minGrossR * risk;
  const target = Math.min(swingHigh, floorTarget);
  const grossR = (target - entry) / risk;
  const feesR = (legs * taker * entry) / risk;
  const netR = grossR - feesR;
  return { target, grossR, feesR, netR, qualifies: netR >= minGrossR };
}

export function rRejects(input: {
  grossR: number;
  netR: number;
  feesR: number;
  minGrossR: number;
  maxFeesR: number;
}): string[] {
  const codes: string[] = [];
  if (input.grossR < input.minGrossR) codes.push("RRR");
  if (input.netR <= 0) codes.push("NET_R");
  if (input.feesR > input.maxFeesR) codes.push("FEE_HEAVY");
  return codes;
}

export function driftAtr(entry: number, signalClose: number, atr: number, side: "long" | "short" = "long"): number {
  return side === "long" ? (entry - signalClose) / atr : (signalClose - entry) / atr;
}

export function eventHits(input: {
  nowMs: number;
  signalCloseMs: number;
  events: { utc: string }[];
  preH: number;
  postH: number;
}): string[] {
  const codes = new Set<string>();
  for (const event of input.events) {
    const t = Date.parse(event.utc);
    if (!Number.isFinite(t)) continue;
    if (t >= input.nowMs - input.postH * 3_600_000 && t <= input.nowMs + input.preH * 3_600_000) {
      codes.add("EVENT_WINDOW");
    }
    if (t > input.signalCloseMs && t <= input.nowMs) codes.add("SIGNAL_PRE_EVENT");
  }
  return [...codes];
}

/** ISO weeks starting Monday 00:00 UTC. A week with fewer than 7 daily bars is dropped. */
export function weeklyBars(days: Bar[]): Bar[] {
  const groups = new Map<string, Bar[]>();
  for (const bar of days) {
    const key = isoMonday(bar.start);
    const list = groups.get(key);
    if (list) list.push(bar);
    else groups.set(key, [bar]);
  }
  const weeks: Bar[] = [];
  for (const [key, bars] of groups) {
    if (bars.length < 7) continue;
    const ordered = [...bars].sort((a, b) => a.start.localeCompare(b.start));
    weeks.push({
      start: `${key}T00:00:00.000Z`,
      open: ordered[0]!.open,
      high: Math.max(...ordered.map((bar) => bar.high)),
      low: Math.min(...ordered.map((bar) => bar.low)),
      close: ordered[ordered.length - 1]!.close,
      volume: ordered.reduce((sum, bar) => sum + bar.volume, 0),
    });
  }
  return weeks;
}

function isoMonday(iso: string): string {
  const date = new Date(iso);
  const day = date.getUTCDay();
  const delta = day === 0 ? 6 : day - 1;
  const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - delta));
  return monday.toISOString().slice(0, 10);
}

export interface ProductsPage {
  rows: number;
  numProducts?: number | null;
  cursor?: string | null;
  limit?: number | null;
  cut?: boolean;
}

/** U2 plus the U4 fallback. A truncated page is never treated as the whole universe. */
export function universeMethod(page: ProductsPage): {
  partial: boolean;
  method: "FULL" | "PAGED" | "BATCHED_IDS";
} {
  const partial =
    page.cut === true ||
    (page.numProducts != null && page.numProducts > page.rows) ||
    (page.limit != null && page.rows === page.limit && !page.cursor);
  if (partial) return { partial: true, method: "BATCHED_IDS" };
  if (page.cursor) return { partial: false, method: "PAGED" };
  return { partial: false, method: "FULL" };
}

export const F1_CLOSES = [
  100, 101, 102, 101, 103, 104, 103, 105, 106, 105, 107, 108, 107, 109, 110, 109, 111, 112, 111, 113,
];

export function f1Bars(): Bar[] {
  return F1_CLOSES.map((close, index) => {
    const open = index === 0 ? 100 : F1_CLOSES[index - 1]!;
    return {
      start: new Date(Date.UTC(2026, 0, index + 1)).toISOString(),
      open,
      high: Math.max(open, close) + 1,
      low: Math.min(open, close) - 1,
      close,
      volume: 1,
    };
  });
}
