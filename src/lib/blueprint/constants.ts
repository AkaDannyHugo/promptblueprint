import type { BlueprintConfig, PillarId, ProfileId, Quote, Target, Timeframe } from "./types.ts";

export const APP_NAME = "Prompt Blueprint";
export const APP_VERSION = "5.1";
export const CONTRACT_REV = 51;
export const LENGTH_BUDGET = 9000;

export const PILLARS: { id: PillarId; label: string; short: string; max: number }[] = [
  { id: "regime", label: "Regime", short: "Regime", max: 100 },
  { id: "technical", label: "Technical", short: "Technical", max: 100 },
  { id: "rr", label: "R / R", short: "R/R", max: 100 },
];

export const TARGET_OPTIONS: { id: Target; label: string }[] = [
  { id: "grok_bot", label: "Grok Bot" },
  { id: "grok", label: "Grok" },
];

export const TIMEFRAMES: Timeframe[] = ["15m", "1H", "4H", "1D", "1W"];

export const TIMEFRAME_MINUTES: Record<Timeframe, number> = {
  "15m": 15,
  "1H": 60,
  "4H": 240,
  "1D": 1440,
  "1W": 10080,
};

export const QUOTES: Quote[] = ["USD", "USDC", "BTC"];

export const CORE_UNIVERSE_SPOT = [
  "BTC-USD",
  "ETH-USD",
  "SOL-USD",
  "XRP-USD",
  "DOGE-USD",
  "ADA-USD",
  "AVAX-USD",
  "LINK-USD",
  "SUI-USD",
  "LTC-USD",
];

export const CORE_UNIVERSE_PERP = ["BIP", "ETP", "SLP", "XPP"];

export const PROFILE_META: Record<ProfileId, { label: string; blurb: string }> = {
  aggressiveSpot: {
    label: "Aggressive",
    blurb: "4H entries, daily trend. Maker in, taker out, after the Coinbase One rebate.",
  },
  swingSpot: {
    label: "Swing",
    blurb: "Daily entries, weekly trend. Wider stops, tighter fee cap.",
  },
  perpsAggressive: {
    label: "Perps",
    blurb: "US perp-style futures. 1H entries, 4H trend. Overnight margin sizes the stop.",
  },
};

const WEIGHTS: BlueprintConfig["weights"] = { regime: 15, technical: 55, rr: 30 };

function shared(): Omit<BlueprintConfig, "profile" | "marketMode" | "darkMode"> {
  return {
    target: "grok_bot",
    contractRev: CONTRACT_REV,
    contractVersion: "5.1",
    entryTf: "4H",
    trendTf: "1D",
    signalBias: "long",
    stopLookback: 6,
    swingLookback: 20,
    minStopPct: 3,
    minStopAtr: 1,
    maxStopAtr: 2.5,
    targetCapR: 3,
    breakoutTargetR: 2.5,
    minRrr: 2,
    minNetR: 1.5,
    maxFeesR: 0.35,
    entryOrder: "maker",
    rebatePct: 25,
    rebateCapUsd: 100,
    defaultFeeBps: 90,
    fallbackMakerBps: 50,
    fundingLeg: "quote",
    quotes: ["USD", "USDC", "BTC"],
    maxSignalAgeMin: null,
    maxDriftAtr: 0.5,
    universeSize: 50,
    minVolume: 5_000_000,
    maxSpreadBps: 15,
    passAMax: 40,
    passBMax: 12,
    coreUniverse: [...CORE_UNIVERSE_SPOT],
    watchlist: [],
    denylist: [],
    excludeStables: true,
    excludeWrapped: true,
    excludeNew: true,
    riskPerTradePct: 1,
    maxPositionPct: 25,
    heatCapMultiple: 3,
    numOps: 3,
    confidence: 60,
    weights: { ...WEIGHTS },
    maxLeverage: 3,
    liqBufferMultiple: 2,
    useIntradayMargin: false,
    fundingDragR: 0.15,
    maxHoldH: 48,
    futMakerPct: 0.095,
    futTakerPct: 0.1,
    futPassThroughUsd: 0.15,
    includeNonCrypto: false,
    minOiContracts: 10_000,
    minVolContracts: 20_000,
    equityUsd: 10_000,
  };
}

export function configFor(id: ProfileId, darkMode = true): BlueprintConfig {
  const base = shared();
  if (id === "swingSpot") {
    return {
      ...base,
      profile: "swingSpot",
      marketMode: "spot",
      darkMode,
      entryTf: "1D",
      trendTf: "1W",
      minStopPct: 5,
      maxFeesR: 0.25,
      maxSignalAgeMin: 1440,
    };
  }
  if (id === "perpsAggressive") {
    return {
      ...base,
      profile: "perpsAggressive",
      marketMode: "leverage",
      darkMode,
      entryTf: "1H",
      trendTf: "4H",
      signalBias: "both",
      maxStopAtr: 2,
      coreUniverse: [...CORE_UNIVERSE_PERP],
    };
  }
  return { ...base, profile: "aggressiveSpot", marketMode: "spot", darkMode };
}

export const PROFILE_PATCHES: Record<
  ProfileId,
  Pick<BlueprintConfig, "targetCapR" | "minRrr" | "breakoutTargetR" | "maxFeesR">
> = {
  aggressiveSpot: { targetCapR: 3, minRrr: 2, breakoutTargetR: 2.5, maxFeesR: 0.35 },
  swingSpot: { targetCapR: 3, minRrr: 2, breakoutTargetR: 2.5, maxFeesR: 0.25 },
  perpsAggressive: { targetCapR: 3, minRrr: 2, breakoutTargetR: 2.5, maxFeesR: 0.35 },
};

export const DEFAULT_CONFIG: BlueprintConfig = configFor("aggressiveSpot");
