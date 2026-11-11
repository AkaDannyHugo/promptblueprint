/** Canonical fee and sizing math. Percents are percentage points (1.05 = 1.05%). */

export function effectivePct(ratePct: number, rebatePct: number): number {
  return ratePct * (1 - rebatePct / 100);
}

/** Round-trip cost in percentage points. Maker entry + taker exit unless entry is taker. */
export function spotRoundTripPct(input: {
  makerPct: number;
  takerPct: number;
  rebatePct: number;
  entryOrder: "maker" | "taker";
}): number {
  const makerEff = effectivePct(input.makerPct, input.rebatePct);
  const takerEff = effectivePct(input.takerPct, input.rebatePct);
  const entry = input.entryOrder === "maker" ? makerEff : takerEff;
  return entry + takerEff;
}

/** fees_R = rt_pct × legs/2 / stop_pct. stop_pct is percentage points. */
export function spotFeesR(rtPct: number, legs: number, stopPct: number): number {
  return (rtPct * (legs / 2)) / stopPct;
}

export function spotLegs(fundingLeg: "quote" | "btc", quoteIsBtc: boolean): number {
  return fundingLeg === "btc" && !quoteIsBtc ? 4 : 2;
}

export function spotTarget(input: {
  entry: number;
  stop: number;
  swing: number;
  targetCapR: number;
  breakoutTargetR: number;
  breakout: boolean;
}): { target: number; risk: number; grossR: number } {
  const risk = Math.abs(input.entry - input.stop);
  const measured = input.entry + input.breakoutTargetR * risk;
  const structural = input.breakout || input.swing <= input.entry ? measured : input.swing;
  const cap = input.entry + input.targetCapR * risk;
  const target = Math.min(structural, cap);
  return { target, risk, grossR: (target - input.entry) / risk };
}

export function staleSignal(ageMin: number, limitMin: number): boolean {
  return ageMin > limitMin;
}

export interface FuturesSizing {
  contracts: number;
  notional: number;
  notional1: number;
  risk1: number;
  riskUsd: number;
  rtUsd: number;
  feesR: number;
  fundingUsd: number;
  fundingR: number;
  target: number;
  grossR: number;
  netR: number;
  levCapped: boolean;
  tooSmall: boolean;
}

export function futuresIdea(input: {
  price: number;
  contractSize: number;
  equity: number;
  riskPct: number;
  stopPct: number;
  side: "long" | "short";
  makerRate: number;
  takerRate: number;
  passThroughUsd: number;
  entryOrder: "maker" | "taker";
  fundingRatePerHour: number;
  holdH: number;
  targetR: number;
  maxLev: number;
}): FuturesSizing {
  const stopDist = input.price * input.stopPct;
  const notional1 = input.price * input.contractSize;
  const risk1 = stopDist * input.contractSize;
  const riskBudget = input.equity * (input.riskPct / 100);
  let contracts = risk1 > 0 ? Math.floor(riskBudget / risk1) : 0;
  let levCapped = false;
  const capContracts = notional1 > 0 ? Math.floor((input.maxLev * input.equity) / notional1) : 0;
  if (contracts * notional1 > input.maxLev * input.equity + 1e-9) {
    contracts = Math.max(0, capContracts);
    levCapped = true;
  }
  const notional = contracts * notional1;
  const entryRate = input.entryOrder === "maker" ? input.makerRate : input.takerRate;
  const rtUsd = notional * (entryRate + input.takerRate) + 2 * input.passThroughUsd * contracts;
  const riskUsd = contracts * risk1;
  const feesR = riskUsd > 0 ? rtUsd / riskUsd : Infinity;
  const signed = input.side === "short" ? -1 : 1;
  const fundingUsd = notional * input.fundingRatePerHour * input.holdH * signed;
  const fundingR = riskUsd > 0 ? fundingUsd / riskUsd : 0;
  const direction = input.side === "short" ? -1 : 1;
  const target = input.price + direction * input.targetR * stopDist;
  const grossR = input.targetR;
  const netR = grossR - feesR - fundingR;
  return {
    contracts,
    notional,
    notional1,
    risk1,
    riskUsd,
    rtUsd,
    feesR,
    fundingUsd,
    fundingR,
    target,
    grossR,
    netR,
    levCapped,
    tooSmall: contracts < 1,
  };
}

/** Notional cap used when the stop is a percent of price and contract size is not needed. */
export function capNotional(equity: number, riskPct: number, stopPct: number, maxLev: number): {
  notional: number;
  capped: boolean;
} {
  const raw = (equity * (riskPct / 100)) / stopPct;
  const cap = maxLev * equity;
  if (raw > cap + 1e-9) return { notional: cap, capped: true };
  return { notional: raw, capped: false };
}

export function liqDistPct(equity: number, notional: number, mmRate: number): number {
  return equity / notional - mmRate;
}

/** stopPct and liqDist are decimals (0.04 = 4%). */
export function liqRisk(stopPct: number, liqDist: number, buffer: number): boolean {
  return stopPct > liqDist / buffer;
}
