export type Target = "grok_bot" | "grok";
export type ProfileId = "aggressiveSpot" | "swingSpot" | "perpsAggressive";
export type Timeframe = "15m" | "1H" | "4H" | "1D" | "1W";
export type SignalBias = "both" | "long" | "short";
export type MarketMode = "spot" | "leverage";
export type FundingLeg = "quote" | "btc";
export type EntryOrder = "maker" | "taker";
export type Quote = "USD" | "USDC" | "BTC";
export type PillarId = "regime" | "technical" | "rr";
export type ConfigSection = "universe" | "strategy" | "risk" | "scoring" | "output";

export interface BlueprintConfig {
  target: Target;
  profile: ProfileId | "custom";
  marketMode: MarketMode;
  contractRev: number;
  contractVersion: "5.1";
  /** UI only. Not written to the link. */
  darkMode: boolean;

  entryTf: Timeframe;
  trendTf: Timeframe;
  signalBias: SignalBias;
  stopLookback: number;
  swingLookback: number;
  /** Percent. Spot rejects a tighter stop. */
  minStopPct: number;
  minStopAtr: number;
  maxStopAtr: number;
  targetCapR: number;
  breakoutTargetR: number;
  /** Min gross R. */
  minRrr: number;
  minNetR: number;
  maxFeesR: number;
  entryOrder: EntryOrder;
  rebatePct: number;
  rebateCapUsd: number;
  /** Fallback taker, basis points, used only when the live fee read fails. */
  defaultFeeBps: number;
  fallbackMakerBps: number;
  fundingLeg: FundingLeg;
  quotes: Quote[];
  /** null = one full entry bar. */
  maxSignalAgeMin: number | null;
  maxDriftAtr: number;

  universeSize: 50 | 100 | 200 | 500;
  minVolume: number;
  maxSpreadBps: number;
  passAMax: number;
  passBMax: number;
  coreUniverse: string[];
  watchlist: string[];
  denylist: string[];
  excludeStables: boolean;
  excludeWrapped: boolean;
  excludeNew: boolean;

  riskPerTradePct: number;
  maxPositionPct: number;
  heatCapMultiple: number;
  numOps: number;
  confidence: number;
  weights: Record<PillarId, number>;

  maxLeverage: number;
  liqBufferMultiple: number;
  useIntradayMargin: boolean;
  fundingDragR: number;
  maxHoldH: number;
  /** Percents. 0.095 means 0.095%, not 9.5%. */
  futMakerPct: number;
  futTakerPct: number;
  futPassThroughUsd: number;
  includeNonCrypto: boolean;
  minOiContracts: number;
  minVolContracts: number;
  equityUsd: number;
}

export interface Notice {
  level: "error" | "warn" | "info";
  message: string;
}
