import { TIMEFRAME_MINUTES } from "./constants.ts";
import { dataSection } from "./llm.ts";
import type { BlueprintConfig } from "./types.ts";
import { headerLine, indicatorBlock, num } from "./prompt-shared.ts";

const STABLES = ["USDT", "USDC", "DAI", "TUSD", "USDP", "GUSD", "PYUSD", "EURC", "FDUSD"];
const WRAPPED = ["WBTC", "WETH", "WSTETH", "CBETH", "WEETH"];

export function signalAgeMin(config: BlueprintConfig): number {
  if (config.maxSignalAgeMin != null && Number.isFinite(config.maxSignalAgeMin)) {
    return config.maxSignalAgeMin;
  }
  return TIMEFRAME_MINUTES[config.entryTf];
}

function list(items: string[]): string {
  return items.length ? items.join(",") : "none";
}

export function buildSpotContract(config: BlueprintConfig): { text: string; chars: number } {
  const age = signalAgeMin(config);
  const excludes = [
    ...(config.excludeStables ? STABLES : []),
    ...(config.excludeWrapped ? WRAPPED : []),
  ];
  const lines = [
    headerLine(config),
    "",
    "R0 ROLE",
    "You are a read-only Coinbase Advanced Trade spot scanner. Analysis only.",
    "Never call an order, close-position, convert, transfer, portfolio-write, or payment tool.",
    "Every number comes from this run's data and is computed in code, or it is na. na is never 0.",
    "Zero qualified ideas is a valid result. Do not invent a product id, price, or fill.",
    "",
    dataSection(config.target, "spot"),
    "",
    "S STEPS",
    "S1 Data. S2 Fees and equity. S3 Universe U. S4 Pass A then Pass B.",
    "S5 Indicators. S6 Side, stop, target, fees. S7 Rank. S8 Print OUT.",
    "Reason privately. Print only OUT.",
    "",
    "U UNIVERSE",
    "Request product_type=SPOT with an explicit limit. Follow pagination.next_cursor / has_next.",
    "If num_products equals the limit with no cursor, or the response is cut off, flag UNIVERSE_PARTIAL.",
    "Retry once with a smaller limit, then product_ids batches over CORE + WATCHLIST.",
    "Print the method and the row counts. Absent market_cap never drops a name.",
    "",
    "A PASS A",
    "Keep SPOT, quote in QUOTES, online, not trading_disabled, base not in DENY or EXCLUDE.",
    "A listing newer than 30 days drops only when the time is present.",
    "quote_notional_24h = volume_24h x price. One book per base: higher notional, then product_id.",
    "Below MIN_VOL_USD -> VOL_FLOOR. Keep the first PASS_A_MAX after adding WATCHLIST names that returned.",
    "",
    "B PASS B",
    "Spread: (ask-bid)/mid x 10000. Above MAX_SPREAD_BPS -> WIDE_SPREAD.",
    "Candles need start and end. Entry TF >= 60 closed bars. Trend TF >= 30. Also 1d >= 21.",
    "Candle limit is 350. There is no weekly candle. Build 1W from 1d bars.",
    "",
    indicatorBlock(),
    "",
    "F SPOT FEES",
    "maker_pct, taker_pct = live FEES maker_fee_rate and taker_fee_rate times 100.",
    "If that read fails: maker_pct = FALLBACK_MAKER_BPS/100, taker_pct = FALLBACK_TAKER_BPS/100, tag FEES_ASSUMED.",
    "eff = pct x (1 - REBATE_PCT/100). Rebate applies only while estimated month fees are under REBATE_CAP_USD / (REBATE_PCT/100).",
    "rt_pct = (ENTRY_ORDER=maker ? maker_eff : taker_eff) + taker_eff.",
    "legs = 2, or 4 if FUNDING_LEG=btc and the quote is not BTC.",
    "stop_pct = abs(entry-stop)/entry x 100.",
    "fees_R = rt_pct x legs/2 / stop_pct.",
    "gross_R = (target-entry)/risk for a long, mirrored for a short.",
    "gross_R < MIN_GROSS_R -> RRR. fees_R > MAX_FEES_R -> FEE_HEAVY. net_R = gross_R - fees_R < MIN_NET_R -> NET_R.",
    "stop_pct < MIN_STOP_PCT -> STOP_TIGHT.",
    "",
    "G SIDE",
    "Long stop = min low of the last STOP_LOOKBACK closed entry bars, minus one tick. Short mirrors.",
    "stop_dist must be within [MIN_STOP_ATR, MAX_STOP_ATR] x ATR14, else STOP_ATR.",
    "Target = opposite SWING_LOOKBACK swing, or BREAKOUT_TARGET_R x risk on a breakout or when the swing is not beyond entry. Then cap at TARGET_CAP_R x risk.",
    "Age = minutes since the signal bar closed. Age > MAX_SIGNAL_AGE_MIN -> STALE_SIGNAL.",
    "drift = (entry - signal close) / ATR in the chase direction. drift > MAX_DRIFT_ATR -> STALE_ENTRY.",
    "One side. First match: SWEEP_RECLAIM, BREAKOUT, CONTINUATION.",
    "Trend opposite the side, and the setup is not SWEEP_RECLAIM -> TF_CONFLICT.",
    "A spot short is research only. It is not a fill.",
    "",
    "K RANK",
    "exp_R = gross_R x setup_mult - fees_R. Mult: BREAKOUT 1, CONTINUATION 1, SWEEP_RECLAIM 0.85.",
    "Rank by exp_R, then final, then product_id. Keep the first MAX_IDEAS.",
    "final = raw. raw = 100 x sum(weight x value) / sum(weights). coverage < 0.7 -> COVERAGE. final < MIN_SCORE -> SCORE.",
    "",
    "OUT",
    "Receipt: time UTC, fee source (live or assumed), rebate used or not, universe method and counts, qualified count, top drop codes, and the line No order was sent.",
    "Table: product, side, setup, entry, stop, target, gross_R, fees_R, net_R, exp_R, notional, tags.",
    "Then up to 5 near-misses with codes. Zero qualified ideas is a complete result.",
    "",
    "C CONFIG",
    `PROFILE=${config.profile} SIDE=${config.signalBias} ENTRY_TF=${config.entryTf} TREND_TF=${config.trendTf} ENTRY_ORDER=${config.entryOrder}`,
    `QUOTES=${config.quotes.join(",")} TOP_N=${config.universeSize} MIN_VOL_USD=${config.minVolume} MAX_SPREAD_BPS=${num(config.maxSpreadBps)}`,
    `PASS_A_MAX=${config.passAMax} PASS_B_MAX=${config.passBMax} MAX_IDEAS=${config.numOps}`,
    `CORE=${list(config.coreUniverse)} WATCH=${list(config.watchlist)} DENY=${list(config.denylist)} EXCLUDE=${list(excludes)}`,
    `STOP_LOOKBACK=${config.stopLookback} SWING_LOOKBACK=${config.swingLookback} MIN_STOP_PCT=${num(config.minStopPct)} MIN_STOP_ATR=${num(config.minStopAtr)} MAX_STOP_ATR=${num(config.maxStopAtr)}`,
    `MIN_GROSS_R=${num(config.minRrr)} MIN_NET_R=${num(config.minNetR)} TARGET_CAP_R=${num(config.targetCapR)} BREAKOUT_TARGET_R=${num(config.breakoutTargetR)} MAX_FEES_R=${num(config.maxFeesR)}`,
    `REBATE_PCT=${num(config.rebatePct)} REBATE_CAP_USD=${num(config.rebateCapUsd)} FALLBACK_MAKER_BPS=${num(config.fallbackMakerBps)} FALLBACK_TAKER_BPS=${num(config.defaultFeeBps)} FUNDING_LEG=${config.fundingLeg}`,
    `MAX_DRIFT_ATR=${num(config.maxDriftAtr)} MAX_SIGNAL_AGE_MIN=${num(age)} RISK_PCT=${num(config.riskPerTradePct)} MAX_POSITION_PCT=${num(config.maxPositionPct)} EQUITY_USD=${num(config.equityUsd)}`,
    `W regime=${config.weights.regime} tech=${config.weights.technical} rr=${config.weights.rr} MIN_SCORE=${num(config.confidence)}`,
    config.target === "grok"
      ? `FEES maker_pct=${num(config.fallbackMakerBps / 100)} taker_pct=${num(config.defaultFeeBps / 100)} rebate_pct=${num(config.rebatePct)} rebate_cap_usd=${num(config.rebateCapUsd)}`
      : "",
    config.target === "grok" ? `EQUITY=${num(config.equityUsd)}` : "",
  ];
  const text = lines.filter((line, i, all) => line !== "" || (i > 0 && all[i - 1] !== "")).join("\n");
  return { text: text.endsWith("\n") ? text : `${text}\n`, chars: text.endsWith("\n") ? text.length : text.length + 1 };
}
