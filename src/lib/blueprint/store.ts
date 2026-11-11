import { create } from "zustand";
import { configFor, DEFAULT_CONFIG, TIMEFRAMES } from "./constants.ts";
import { clampWeights, normalizeWeights } from "./format.ts";
import type {
  BlueprintConfig,
  ConfigSection,
  EntryOrder,
  FundingLeg,
  MarketMode,
  PillarId,
  ProfileId,
  Quote,
  SignalBias,
  Timeframe,
} from "./types.ts";

export const LEGACY_STORAGE_KEY = "prompt-blueprint-v3";

const BIASES: SignalBias[] = ["both", "long", "short"];
const ORDERS: EntryOrder[] = ["maker", "taker"];
const LEGS: FundingLeg[] = ["quote", "btc"];
const MODES: MarketMode[] = ["spot", "leverage"];
const QUOTE_IDS: Quote[] = ["USD", "USDC", "BTC"];
const SIZES = [50, 100, 200, 500] as const;

const OLD_PROFILE: Record<string, ProfileId> = {
  conservative: "swingSpot",
  balanced: "swingSpot",
  dayTrade: "aggressiveSpot",
  momentum: "aggressiveSpot",
  meanReversion: "aggressiveSpot",
  agentDesk: "aggressiveSpot",
  btcAccumulation: "aggressiveSpot",
  aggressiveSpot: "aggressiveSpot",
  swingSpot: "swingSpot",
  perpsAggressive: "perpsAggressive",
};

export const CONFIG_KEYS = [
  "target",
  "profile",
  "marketMode",
  "contractRev",
  "contractVersion",
  "darkMode",
  "entryTf",
  "trendTf",
  "signalBias",
  "stopLookback",
  "swingLookback",
  "minStopPct",
  "minStopAtr",
  "maxStopAtr",
  "targetCapR",
  "breakoutTargetR",
  "minRrr",
  "minNetR",
  "maxFeesR",
  "entryOrder",
  "rebatePct",
  "rebateCapUsd",
  "defaultFeeBps",
  "fallbackMakerBps",
  "fundingLeg",
  "quotes",
  "maxSignalAgeMin",
  "maxDriftAtr",
  "universeSize",
  "minVolume",
  "maxSpreadBps",
  "passAMax",
  "passBMax",
  "coreUniverse",
  "watchlist",
  "denylist",
  "excludeStables",
  "excludeWrapped",
  "excludeNew",
  "riskPerTradePct",
  "maxPositionPct",
  "heatCapMultiple",
  "numOps",
  "confidence",
  "weights",
  "maxLeverage",
  "liqBufferMultiple",
  "useIntradayMargin",
  "fundingDragR",
  "maxHoldH",
  "futMakerPct",
  "futTakerPct",
  "futPassThroughUsd",
  "includeNonCrypto",
  "minOiContracts",
  "minVolContracts",
  "equityUsd",
] as const;

const KNOWN = new Set<string>(CONFIG_KEYS);

const TF_ORDER: Timeframe[] = ["15m", "1H", "4H", "1D", "1W"];

function withTrendGuard(config: BlueprintConfig): BlueprintConfig {
  const entry = TF_ORDER.indexOf(config.entryTf);
  const trend = TF_ORDER.indexOf(config.trendTf);
  if (trend >= entry) return config;
  const next = TF_ORDER[Math.min(entry + 1, TF_ORDER.length - 1)] ?? config.entryTf;
  return { ...config, trendTf: next };
}

function finite(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function flag(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (value === "1" || value === "true") return true;
  if (value === "0" || value === "false") return false;
  return fallback;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function stringList(value: unknown, fallback: string[]): string[] {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : null;
  if (!source) return fallback;
  const out: string[] = [];
  for (const item of source) {
    const text = String(item).trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (text && !out.includes(text)) out.push(text);
  }
  return out.slice(0, 40);
}

function quotesOf(value: unknown, fallback: Quote[]): Quote[] {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : null;
  if (!source) return fallback;
  const out: Quote[] = [];
  for (const item of source) {
    const text = String(item).trim().toUpperCase();
    if ((QUOTE_IDS as string[]).includes(text) && !out.includes(text as Quote)) out.push(text as Quote);
  }
  return out.length ? out : fallback;
}

function weightsOf(value: unknown, fallback: BlueprintConfig["weights"]): BlueprintConfig["weights"] {
  if (!value || typeof value !== "object") {
    if (typeof value === "string") {
      const parts = value.split(",").map((part) => Number(part.trim()));
      if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
        return clampWeights({ regime: parts[0]!, technical: parts[1]!, rr: parts[2]! });
      }
    }
    return fallback;
  }
  const raw = value as Record<string, unknown>;
  return clampWeights({
    regime: finite(raw.regime, fallback.regime, 0, 100),
    technical: finite(raw.technical, fallback.technical, 0, 100),
    rr: finite(raw.rr, fallback.rr, 0, 100),
  });
}

function unwrap(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const obj = value as Record<string, unknown>;
  if (obj.config && typeof obj.config === "object") return obj.config as Record<string, unknown>;
  if (obj.state && typeof obj.state === "object") {
    const state = obj.state as Record<string, unknown>;
    if (state.config && typeof state.config === "object") return state.config as Record<string, unknown>;
  }
  return obj;
}

function overlay(base: BlueprintConfig, raw: Record<string, unknown>): BlueprintConfig {
  const size = finite(raw.universeSize, base.universeSize, 50, 500);
  const universeSize = (SIZES as readonly number[]).includes(size) ? (size as BlueprintConfig["universeSize"]) : base.universeSize;
  const ageRaw = raw.maxSignalAgeMin;
  const maxSignalAgeMin =
    ageRaw == null || ageRaw === "" || ageRaw === "null"
      ? base.maxSignalAgeMin
      : finite(ageRaw, base.maxSignalAgeMin ?? 0, 1, 20000);
  return withTrendGuard({
    ...base,
    target:
      raw.target === "grok" || raw.target === "grok_bot"
        ? raw.target
        : raw.targetLlm === "grok"
          ? "grok"
          : base.target,
    marketMode: oneOf(raw.marketMode, MODES, base.marketMode),
    entryTf: oneOf(raw.entryTf, TIMEFRAMES, base.entryTf),
    trendTf: oneOf(raw.trendTf, TIMEFRAMES, base.trendTf),
    signalBias: oneOf(raw.signalBias, BIASES, base.signalBias),
    stopLookback: Math.round(finite(raw.stopLookback, base.stopLookback, 2, 30)),
    swingLookback: Math.round(finite(raw.swingLookback, base.swingLookback, 5, 60)),
    minStopPct: finite(raw.minStopPct, base.minStopPct, 0.2, 20),
    minStopAtr: finite(raw.minStopAtr, base.minStopAtr, 0.2, 6),
    maxStopAtr: finite(raw.maxStopAtr, base.maxStopAtr, 0.5, 8),
    targetCapR: finite(raw.targetCapR, base.targetCapR, 1.2, 8),
    breakoutTargetR: finite(raw.breakoutTargetR, base.breakoutTargetR, 0.5, 6),
    minRrr: finite(raw.minRrr, base.minRrr, 1, 5),
    minNetR: finite(raw.minNetR, base.minNetR, 0, 6),
    maxFeesR: finite(raw.maxFeesR, base.maxFeesR, 0.05, 2),
    entryOrder: oneOf(raw.entryOrder, ORDERS, base.entryOrder),
    rebatePct: finite(raw.rebatePct, base.rebatePct, 0, 50),
    rebateCapUsd: finite(raw.rebateCapUsd, base.rebateCapUsd, 0, 100000),
    defaultFeeBps: finite(raw.defaultFeeBps, base.defaultFeeBps, 0, 200),
    fallbackMakerBps: finite(raw.fallbackMakerBps, base.fallbackMakerBps, 0, 200),
    fundingLeg: oneOf(raw.fundingLeg, LEGS, base.fundingLeg),
    quotes: quotesOf(raw.quotes, base.quotes),
    maxSignalAgeMin,
    maxDriftAtr: finite(raw.maxDriftAtr, base.maxDriftAtr, 0.1, 3),
    universeSize,
    minVolume: finite(raw.minVolume, base.minVolume, 0, 500_000_000),
    maxSpreadBps: finite(raw.maxSpreadBps, base.maxSpreadBps, 1, 100),
    passAMax: Math.round(finite(raw.passAMax, base.passAMax, 5, 100)),
    passBMax: Math.round(finite(raw.passBMax, base.passBMax, 1, 40)),
    coreUniverse: stringList(raw.coreUniverse, base.coreUniverse),
    watchlist: stringList(raw.watchlist, base.watchlist),
    denylist: stringList(raw.denylist, base.denylist),
    excludeStables: flag(raw.excludeStables, base.excludeStables),
    excludeWrapped: flag(raw.excludeWrapped, base.excludeWrapped),
    excludeNew: flag(raw.excludeNew, base.excludeNew),
    riskPerTradePct: finite(raw.riskPerTradePct, base.riskPerTradePct, 0.1, 5),
    maxPositionPct: finite(raw.maxPositionPct, base.maxPositionPct, 1, 100),
    heatCapMultiple: finite(raw.heatCapMultiple, base.heatCapMultiple, 1, 8),
    numOps: Math.round(finite(raw.numOps, base.numOps, 1, 10)),
    confidence: finite(raw.confidence, base.confidence, 0, 95),
    weights: weightsOf(raw.weights, base.weights),
    maxLeverage: finite(raw.maxLeverage, base.maxLeverage, 1, 8),
    liqBufferMultiple: finite(raw.liqBufferMultiple, base.liqBufferMultiple, 1, 6),
    useIntradayMargin: flag(raw.useIntradayMargin, base.useIntradayMargin),
    fundingDragR: finite(raw.fundingDragR, base.fundingDragR, 0, 1),
    maxHoldH: finite(raw.maxHoldH, base.maxHoldH, 1, 240),
    futMakerPct: finite(raw.futMakerPct, base.futMakerPct, 0, 2),
    futTakerPct: finite(raw.futTakerPct, base.futTakerPct, 0, 2),
    futPassThroughUsd: finite(raw.futPassThroughUsd, base.futPassThroughUsd, 0, 5),
    includeNonCrypto: flag(raw.includeNonCrypto, base.includeNonCrypto),
    minOiContracts: finite(raw.minOiContracts, base.minOiContracts, 0, 1_000_000),
    minVolContracts: finite(raw.minVolContracts, base.minVolContracts, 0, 5_000_000),
    equityUsd: finite(raw.equityUsd, base.equityUsd, 0, 100_000_000),
    darkMode: flag(raw.darkMode, base.darkMode),
  });
}

export function ignoredImportKeys(value: unknown): string[] {
  const raw = unwrap(value);
  if (!raw) return [];
  return Object.keys(raw).filter((key) => !KNOWN.has(key));
}

export function parseImportedConfig(value: unknown): BlueprintConfig | null {
  const raw = unwrap(value);
  if (!raw) return null;
  const named =
    raw.marketMode === "leverage"
      ? "perpsAggressive"
      : typeof raw.profile === "string" && OLD_PROFILE[raw.profile]
        ? OLD_PROFILE[raw.profile]
        : "aggressiveSpot";
  const next = overlay(configFor(named), raw);
  const drifted = searchFor({ ...next, profile: named }) !== (named === "aggressiveSpot" ? "" : `profile=${named}`);
  return { ...next, profile: drifted ? "custom" : named };
}

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function encodeValue(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(",");
  if (typeof value === "object" && value && "regime" in value) {
    const weights = value as BlueprintConfig["weights"];
    return `${weights.regime},${weights.technical},${weights.rr}`;
  }
  return null;
}

const SKIP_URL = new Set(["darkMode", "contractRev", "contractVersion", "profile"]);

export function searchFor(config: BlueprintConfig): string {
  const baseId: ProfileId =
    config.profile === "swingSpot" || config.profile === "perpsAggressive" ? config.profile : "aggressiveSpot";
  const base = { ...configFor(baseId, config.darkMode), target: configFor(baseId).target };
  const params = new URLSearchParams();
  if (config.profile !== "aggressiveSpot") params.set("profile", config.profile);
  for (const key of CONFIG_KEYS) {
    if (SKIP_URL.has(key)) continue;
    const value = config[key];
    const other = base[key];
    if (same(value, other)) continue;
    const encoded = encodeValue(value);
    if (encoded == null) continue;
    params.set(key, encoded);
  }
  return params.toString();
}

export function configFromSearch(search: string, darkMode = true): BlueprintConfig | null {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  if ([...params.keys()].length === 0) return null;
  const profileParam = params.get("profile");
  const named: ProfileId =
    profileParam === "swingSpot" || profileParam === "perpsAggressive" || profileParam === "aggressiveSpot"
      ? profileParam
      : profileParam && OLD_PROFILE[profileParam]
        ? OLD_PROFILE[profileParam]
        : "aggressiveSpot";
  const raw: Record<string, unknown> = {};
  for (const [key, value] of params.entries()) {
    if (key === "profile") continue;
    raw[key] = value;
  }
  const next = overlay(configFor(named, darkMode), raw);
  const profile: BlueprintConfig["profile"] =
    profileParam === "custom" || (profileParam == null && searchFor({ ...next, profile: "aggressiveSpot" }) !== "")
      ? "custom"
      : named;
  return { ...next, profile, darkMode };
}

export function forgetSavedHistory(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

if (typeof window !== "undefined") forgetSavedHistory();

interface BlueprintState {
  config: BlueprintConfig;
  section: ConfigSection;
  mobilePane: "configure" | "contract";
  hydrated: boolean;
  patch: (partial: Partial<BlueprintConfig>, markCustom?: boolean) => void;
  setWeight: (id: PillarId, value: number) => void;
  normalize: () => void;
  applyProfile: (id: ProfileId) => void;
  reset: () => void;
  importConfig: (config: BlueprintConfig) => void;
  setSection: (section: ConfigSection) => void;
  setMobilePane: (pane: "configure" | "contract") => void;
  markHydrated: () => void;
  replaceConfig: (config: BlueprintConfig) => void;
}

export const useBlueprint = create<BlueprintState>()((set) => ({
  config: DEFAULT_CONFIG,
  section: "universe",
  mobilePane: "configure",
  hydrated: false,
  patch: (partial) => {
    set((state) => ({
      config: withTrendGuard({
        ...state.config,
        ...partial,
        profile: partial.profile ?? state.config.profile,
        weights: partial.weights ? clampWeights(partial.weights) : state.config.weights,
      }),
    }));
  },
  setWeight: (id, value) => {
    set((state) => ({
      config: {
        ...state.config,
        profile: "custom",
        weights: clampWeights({ ...state.config.weights, [id]: value }),
      },
    }));
  },
  normalize: () => {
    set((state) => ({
      config: {
        ...state.config,
        profile: "custom",
        weights: clampWeights(normalizeWeights(state.config.weights)),
      },
    }));
  },
  applyProfile: (id) => {
    set((state) => ({
      config: withTrendGuard({
        ...configFor(id, state.config.darkMode),
        target: state.config.target,
      }),
    }));
  },
  reset: () => {
    set((state) => ({
      config: { ...configFor("aggressiveSpot", state.config.darkMode), target: "grok_bot" },
      section: "universe",
    }));
  },
  importConfig: (config) => set({ config: withTrendGuard(config) }),
  setSection: (section) => set({ section }),
  setMobilePane: (mobilePane) => set({ mobilePane }),
  markHydrated: () => set({ hydrated: true }),
  replaceConfig: (config) => set({ config: withTrendGuard(config), hydrated: true }),
}));
