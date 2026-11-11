import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { configFor, DEFAULT_CONFIG, PROFILE_META } from "./constants.ts";
import {
  capNotional,
  futuresIdea,
  liqDistPct,
  liqRisk,
  spotFeesR,
  spotRoundTripPct,
  spotTarget,
  staleSignal,
} from "./math.ts";
import { buildPrompt } from "./prompt.ts";
import {
  configFromSearch,
  forgetSavedHistory,
  ignoredImportKeys,
  LEGACY_STORAGE_KEY,
  parseImportedConfig,
  searchFor,
} from "./store.ts";
import type { BlueprintConfig, ProfileId, Target } from "./types.ts";
import { getNotices } from "./warnings.ts";

const FORBIDDEN = [
  "pb.run",
  "END_PB_RECORD",
  "Snapshot",
  "orders_create",
  "preview",
  "ChatGPT",
  "Claude",
  "Gemini",
  "VIX",
  "five daily closes",
  "global_perps",
  "ALT_MIN_EXP_R",
];

function book(id: ProfileId, target: Target): BlueprintConfig {
  return { ...configFor(id), target };
}

describe("T1 spot fee math", () => {
  it("rebates a maker entry to 1.05%", () => {
    const rt = spotRoundTripPct({ makerPct: 0.5, takerPct: 0.9, rebatePct: 25, entryOrder: "maker" });
    assert.equal(rt, 1.05);
  });
});

describe("T2 E1", () => {
  it("caps at the swing and clears net R", () => {
    const row = spotTarget({ entry: 100, stop: 96, swing: 112, targetCapR: 3, breakoutTargetR: 2.5, breakout: false });
    assert.equal(row.grossR, 3);
    assert.equal(row.target, 112);
    const fees = spotFeesR(1.05, 2, 4);
    assert.equal(fees, 0.2625);
    assert.equal(row.grossR - fees, 2.7375);
  });
});

describe("T3 E2", () => {
  it("rejects a 2.5% stop as fee heavy", () => {
    const fees = spotFeesR(1.05, 2, 2.5);
    assert.ok(Math.abs(fees - 0.42) < 1e-9);
    assert.ok(fees > 0.35);
  });
});

describe("T4 E3", () => {
  it("charges four legs on a BTC funding leg", () => {
    const fees = spotFeesR(1.05, 4, 4);
    assert.equal(fees, 0.525);
    assert.ok(fees > 0.35);
    assert.equal(spotFeesR(1.05, 2, 4), 0.2625);
  });
});

describe("T5 E4 futures", () => {
  it("sizes the BIP long", () => {
    const row = futuresIdea({
      price: 82290,
      contractSize: 0.01,
      equity: 10000,
      riskPct: 1,
      stopPct: 0.015,
      side: "long",
      makerRate: 0.00095,
      takerRate: 0.001,
      passThroughUsd: 0.15,
      entryOrder: "maker",
      fundingRatePerHour: 0.000014,
      holdH: 24,
      targetR: 3,
      maxLev: 3,
    });
    assert.equal(row.contracts, 8);
    assert.ok(Math.abs(row.notional - 6583.2) < 0.01);
    assert.ok(Math.abs(row.rtUsd - 15.24) < 0.01);
    assert.ok(Math.abs(row.feesR - 0.154) < 0.001);
    assert.ok(Math.abs(row.fundingR - 0.022) < 0.001);
    assert.ok(Math.abs(row.target - 85993.05) < 0.01);
  });
});

describe("T6 E5 short", () => {
  it("receives funding", () => {
    const row = futuresIdea({
      price: 82290,
      contractSize: 0.01,
      equity: 10000,
      riskPct: 1,
      stopPct: 0.015,
      side: "short",
      makerRate: 0.00095,
      takerRate: 0.001,
      passThroughUsd: 0.15,
      entryOrder: "maker",
      fundingRatePerHour: 0.000014,
      holdH: 24,
      targetR: 3,
      maxLev: 3,
    });
    assert.ok(Math.abs(row.fundingR - -0.022) < 0.001);
  });
});

describe("T7 liquidation", () => {
  it("rejects a 4% stop and keeps 3.8%", () => {
    const dist = liqDistPct(10000, 30000, 0.25663);
    assert.ok(Math.abs(dist - 0.0767) < 0.0001);
    assert.equal(liqRisk(0.04, dist, 2), true);
    assert.equal(liqRisk(0.038, dist, 2), false);
  });
});

describe("T8 leverage cap", () => {
  it("caps a 0.2% stop at 3x", () => {
    const row = capNotional(1000, 1, 0.002, 3);
    assert.equal(row.capped, true);
    assert.ok(row.notional <= 3000);
  });
});

describe("T9 signal age", () => {
  it("keeps a 1D signal at 09:30 ET", () => {
    assert.equal(staleSignal(810, 1440), false);
  });
});

describe("T10 strings", () => {
  it("keeps forbidden phrases out of every book", () => {
    for (const id of Object.keys(PROFILE_META) as ProfileId[]) {
      for (const target of ["grok_bot", "grok"] as const) {
        const text = buildPrompt(book(id, target));
        for (const phrase of FORBIDDEN) {
          assert.equal(text.includes(phrase), false, `${id} ${target} ${phrase}`);
        }
      }
    }
  });
});

describe("T11 T12 target switch", () => {
  it("sends Grok to public data and Grok Bot to the connector", () => {
    const grok = buildPrompt(book("aggressiveSpot", "grok"));
    assert.equal(grok.includes("coinbase_"), false);
    assert.ok(grok.includes("api.exchange.coinbase.com"));
    assert.ok(grok.includes("USER DATA"));
    const bot = buildPrompt(book("aggressiveSpot", "grok_bot"));
    assert.ok(bot.includes("user-Coinbase-xai"));
    assert.equal(bot.includes("api.exchange"), false);
    const lev = buildPrompt(book("perpsAggressive", "grok"));
    assert.ok(lev.includes("USER DATA"));
    assert.ok(lev.includes("NO_DATA"));
  });
});

describe("T13 length", () => {
  it("stays under 9,000 characters", () => {
    for (const id of Object.keys(PROFILE_META) as ProfileId[]) {
      for (const target of ["grok_bot", "grok"] as const) {
        const text = buildPrompt(book(id, target));
        assert.ok(text.length <= 9000, `${id} ${target} ${text.length}`);
      }
    }
  });
});

describe("T14 copy block", () => {
  it("blocks copy when the cap is not above the floor", () => {
    const notices = getNotices({ ...DEFAULT_CONFIG, targetCapR: 2, minRrr: 2 });
    assert.ok(notices.some((notice) => notice.level === "error"));
  });
});

describe("T15 link instead of storage", () => {
  it("drops the old key and puts the edit in the query", () => {
    const memory = new Map<string, string>();
    const storage = {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memory.set(key, value);
      },
      removeItem: (key: string) => {
        memory.delete(key);
      },
    };
    const prior = globalThis.localStorage;
    Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });
    localStorage.setItem(LEGACY_STORAGE_KEY, "{}");
    forgetSavedHistory();
    assert.equal(localStorage.getItem(LEGACY_STORAGE_KEY), null);
    if (prior) Object.defineProperty(globalThis, "localStorage", { value: prior, configurable: true });
    else delete (globalThis as { localStorage?: Storage }).localStorage;
    const edited = { ...DEFAULT_CONFIG, minStopPct: 4, profile: "aggressiveSpot" as const };
    assert.match(searchFor(edited), /minStopPct=4/);
    const round = configFromSearch("?minStopPct=4");
    assert.equal(round?.minStopPct, 4);
  });
});

describe("import", () => {
  it("maps an old conservative file onto swing and lists unknown keys", () => {
    const next = parseImportedConfig({
      profile: "conservative",
      marketMode: "spot",
      takerFeePct: 0.6,
      executionMode: "preview_confirm",
    });
    assert.ok(next);
    assert.equal(next?.entryTf, "1D");
    assert.equal(next?.trendTf, "1W");
    assert.deepEqual(ignoredImportKeys({ profile: "conservative", takerFeePct: 0.6 }), ["takerFeePct"]);
  });
});

describe("defaults", () => {
  it("opens on aggressive spot", () => {
    assert.equal(DEFAULT_CONFIG.profile, "aggressiveSpot");
    assert.equal(DEFAULT_CONFIG.entryTf, "4H");
    assert.equal(DEFAULT_CONFIG.trendTf, "1D");
    assert.equal(DEFAULT_CONFIG.entryOrder, "maker");
    assert.equal(DEFAULT_CONFIG.fundingLeg, "quote");
    assert.equal(DEFAULT_CONFIG.maxFeesR, 0.35);
    assert.equal(DEFAULT_CONFIG.marketMode, "spot");
    assert.equal(DEFAULT_CONFIG.target, "grok_bot");
  });
});
