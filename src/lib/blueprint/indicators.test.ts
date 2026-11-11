import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PROFILE_PATCHES } from "./constants.ts";
import {
  atr14,
  atrPercent,
  driftAtr,
  eventHits,
  f1Bars,
  legacyTargetNet,
  rRejects,
  round4,
  rsi14,
  sma,
  targetAndR,
  universeMethod,
  weeklyBars,
  type Bar,
} from "./indicators.ts";
import { sha256Hex } from "./sha256.ts";

describe("sha256", () => {
  it("matches the empty-string and abc vectors", () => {
    assert.equal(
      sha256Hex(""),
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
    assert.equal(
      sha256Hex("abc"),
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });
});

describe("F1 indicators", () => {
  const bars = f1Bars();
  const closes = bars.map((bar) => bar.close);

  it("matches ATR, ATR%, RSI, and SMA20", () => {
    assert.equal(round4(atr14(bars) ?? NaN), 3.3259);
    assert.equal(round4(atrPercent(bars) ?? NaN), 2.9432);
    assert.equal(round4(rsi14(closes) ?? NaN), 76.1154);
    assert.equal(round4(sma(closes, 20) ?? NaN), 106.35);
  });
});

describe("F2 target", () => {
  const base = {
    entry: 100,
    stop: 98,
    swingHigh: 108,
    taker: 0.009,
    targetCapR: 3,
    breakoutTargetR: 2,
    setup: "CONTINUATION" as const,
  };

  it("caps a structural target and still clears the gross floor", () => {
    const row = targetAndR({ ...base, legs: 2 });
    assert.equal(row.target, 106);
    assert.equal(round4(row.grossR), 3);
    assert.equal(round4(row.feesR), 0.9);
    assert.equal(round4(row.netR), 2.1);
    assert.equal(round4(row.expR), 2.1);
    assert.deepEqual(rRejects({ grossR: row.grossR, netR: row.netR, feesR: row.feesR, minGrossR: 1.5, maxFeesR: 0.5 }), [
      "FEE_HEAVY",
    ]);
    const four = targetAndR({ ...base, legs: 4 });
    assert.equal(round4(four.feesR), 1.8);
    assert.equal(round4(four.expR), 1.2);
  });

  it("shows the old rule cannot qualify", () => {
    const old = legacyTargetNet(100, 98, 108, 1.5, 0.009, 2);
    assert.equal(old.target, 103);
    assert.equal(round4(old.grossR), 1.5);
    assert.equal(round4(old.netR), 0.6);
    assert.equal(old.qualifies, false);
  });
});

describe("F3 drift", () => {
  it("rejects 0.6 ATR and keeps 0.4 ATR", () => {
    assert.equal(driftAtr(101.2, 100, 2) > 0.5, true);
    assert.equal(driftAtr(100.8, 100, 2) > 0.5, false);
  });
});

describe("F4 events", () => {
  it("flags the window and a pre-signal event", () => {
    const now = Date.parse("2026-10-15T16:00:00Z");
    const signal = now - 4 * 3_600_000;
    const hits = eventHits({
      nowMs: now,
      signalCloseMs: signal,
      preH: 2,
      postH: 24,
      events: [{ utc: new Date(now - 3_600_000).toISOString() }],
    });
    assert.ok(hits.includes("EVENT_WINDOW"));
    assert.ok(hits.includes("SIGNAL_PRE_EVENT"));
  });
});

describe("F5 weeks", () => {
  it("keeps three full ISO weeks and drops the partial fourth", () => {
    const days: Bar[] = [];
    for (let i = 0; i < 24; i += 1) {
      const start = new Date(Date.UTC(2026, 0, 5 + i)).toISOString();
      days.push({ start, open: 1, high: 2, low: 0.5, close: 1 + i, volume: 1 });
    }
    const weeks = weeklyBars(days);
    assert.equal(weeks.length, 3);
    assert.equal(weeks[0]?.start.slice(0, 10), "2026-01-05");
    assert.equal(weeks[2]?.close, 1 + 20);
  });
});

describe("F6 universe", () => {
  it("treats a cut page as partial and falls back to id batches", () => {
    const next = universeMethod({ rows: 53, numProducts: 281, cursor: null });
    assert.equal(next.partial, true);
    assert.equal(next.method, "BATCHED_IDS");
  });
});

describe("profile targets", () => {
  it("keeps the cap above the floor and can qualify", () => {
    for (const [id, patch] of Object.entries(PROFILE_PATCHES)) {
      assert.ok(patch.targetCapR! > patch.minRrr!, id);
      const row = targetAndR({
        entry: 100,
        stop: 90,
        swingHigh: 140,
        taker: 0.009,
        legs: 4,
        targetCapR: patch.targetCapR!,
        breakoutTargetR: patch.breakoutTargetR!,
        setup: "CONTINUATION",
      });
      const codes = rRejects({
        grossR: row.grossR,
        netR: row.netR,
        feesR: row.feesR,
        minGrossR: patch.minRrr!,
        maxFeesR: 0.5,
      });
      assert.deepEqual(codes, [], id);
    }
  });
});
