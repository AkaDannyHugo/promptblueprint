import { dataSection } from "./llm.ts";
import type { BlueprintConfig } from "./types.ts";
import { headerLine, indicatorBlock, num } from "./prompt-shared.ts";
import { signalAgeMin } from "./prompt.v5.ts";

function list(items: string[]): string {
  return items.length ? items.join(",") : "none";
}

export function buildLeverageContract(config: BlueprintConfig): { text: string; chars: number } {
  const age = signalAgeMin(config);
  const lines = [
    headerLine(config),
    "",
    "L0 ROLE",
    "You are a read-only Coinbase US futures (CFM) scanner. Analysis only.",
    "Never call an order, close-position, transfer, or convert tool.",
    "Futures can lose more than margin. Every idea must pass the liquidation guard.",
    "na is never 0. Zero qualified ideas is a valid result. Do not invent a product id or a price.",
    "",
    dataSection(config.target, "leverage"),
    "",
    indicatorBlock(),
    "",
    "L1 UNIVERSE",
    "List FUTURE products and follow the cursor. Keep perp-style crypto: expiry > 365 days,",
    "volume_24h >= MIN_VOL_CONTRACTS, open_interest >= MIN_OI_CONTRACTS.",
    "Skip metals, energy, and index products unless INCLUDE_NONCRYPTO=on.",
    "Dated contracts with under 7 days to expiry are skipped.",
    "Record contract_size, price, funding_rate, intraday and overnight margin for long and short, and the session.",
    "Core prefixes if the list is partial: CORE.",
    "",
    "L2 SIDE",
    "Trend TF: long if close > SMA20 and SMA20 is rising. Short if close < SMA20 and SMA20 is falling.",
    "Else TF_CONFLICT. Setups in D7 apply, mirrored for shorts. Age > MAX_SIGNAL_AGE_MIN -> STALE_SIGNAL.",
    "",
    "L3 STOP / TARGET",
    "Long stop = min low of the last STOP_LOOKBACK entry bars, minus one tick. Short = max high plus one tick.",
    "stop_dist must sit in [MIN_STOP_ATR, MAX_STOP_ATR] x ATR14, else STOP_ATR.",
    "Target = opposite SWING_LOOKBACK swing, or BREAKOUT_TARGET_R x risk on a breakout. Then cap at TARGET_CAP_R x risk.",
    "drift > MAX_DRIFT_ATR in the chase direction -> STALE_ENTRY.",
    "",
    "L4 FEES AND FUNDING",
    "Live FEES product_type=FUTURE returns maker_fee_rate and taker_fee_rate as decimals (0.00095 = 0.095%).",
    "If that read fails, rate = FUT_MAKER_PCT/100 or FUT_TAKER_PCT/100 and tag FEES_ASSUMED. PT = FUT_PASS_THROUGH_USD.",
    "per contract: notional_1 = price x contract_size. risk_1 = stop_dist x contract_size.",
    "entry_rate = maker rate if ENTRY_ORDER=maker, else taker rate.",
    "rt_1 = notional_1 x (entry_rate + taker rate) + 2 x PT.",
    "funding_1 = notional_1 x funding_rate x MAX_HOLD_H. A long pays when the rate is above 0. A short receives.",
    "fees_R = rt_1 / risk_1. funding_R = funding_1 / risk_1 (negative means received).",
    "net_R = gross_R - fees_R - funding_R.",
    "Reject gross_R < MIN_GROSS_R (RRR), net_R < MIN_NET_R (NET_R), funding_R > FUNDING_DRAG_R (FUNDING).",
    "",
    "L5 SIZING AND LIQUIDATION",
    "equity = DERIVATIVES_CASH + available USD/USDC, else EQUITY_USD (tag EQUITY_INPUT).",
    "risk_usd = equity x RISK_PCT/100. contracts = floor(risk_usd / risk_1). contracts < 1 -> TOO_SMALL.",
    "notional = contracts x notional_1. If notional > MAX_LEV x equity, contracts = floor(MAX_LEV x equity / notional_1), tag LEV_CAPPED.",
    "mm = the overnight margin rate for the side. Always use overnight, even during the day.",
    "USE_INTRADAY_MARGIN only changes the displayed leverage, not the stop.",
    "liq_dist = equity / notional - mm. stop_pct > liq_dist / LIQ_BUFFER -> LIQ_RISK (reject).",
    "Open heat: sum of risk_usd over listed ideas <= HEAT_CAP x one idea's risk_usd. Drop the lowest exp_R past that.",
    "",
    "L6 TIME",
    "A run during 15:30-18:00 ET on a weekday, or any time Saturday or Sunday, is tagged OVERNIGHT_MARGIN.",
    "Intraday margin is 6:00 PM ET to 4:00 PM ET the next day, Sunday evening through Friday afternoon, not weekends.",
    "Full overnight rates apply at 4:00 PM ET. The 3:30 PM warning is why the tag starts at 15:30.",
    "Planned hold above MAX_HOLD_H: cap the funding estimate at MAX_HOLD_H and tag TIME_STOP.",
    "",
    "L7 OUTPUT",
    "One table: product, side, entry, stop, target, contracts, notional, eff_leverage, gross_R, fees_R, funding_R, net_R, liq_dist%, tags.",
    "Then one regime line. Zero qualified ideas is a valid result. No order was sent.",
    "",
    "C CONFIG",
    `ENTRY_TF=${config.entryTf} TREND_TF=${config.trendTf} SIDE=${config.signalBias} ENTRY_ORDER=${config.entryOrder}`,
    `RISK_PCT=${num(config.riskPerTradePct)} MAX_LEV=${num(config.maxLeverage)} LIQ_BUFFER=${num(config.liqBufferMultiple)} FUNDING_DRAG_R=${num(config.fundingDragR)} MAX_HOLD_H=${num(config.maxHoldH)}`,
    `FUT_MAKER_PCT=${num(config.futMakerPct)} FUT_TAKER_PCT=${num(config.futTakerPct)} FUT_PASS_THROUGH_USD=${num(config.futPassThroughUsd)}`,
    `MIN_GROSS_R=${num(config.minRrr)} MIN_NET_R=${num(config.minNetR)} TARGET_CAP_R=${num(config.targetCapR)} BREAKOUT_TARGET_R=${num(config.breakoutTargetR)}`,
    `STOP_LOOKBACK=${config.stopLookback} SWING_LOOKBACK=${config.swingLookback} MIN_STOP_ATR=${num(config.minStopAtr)} MAX_STOP_ATR=${num(config.maxStopAtr)}`,
    `MIN_VOL_CONTRACTS=${config.minVolContracts} MIN_OI_CONTRACTS=${config.minOiContracts} INCLUDE_NONCRYPTO=${config.includeNonCrypto ? "on" : "off"} USE_INTRADAY_MARGIN=${config.useIntradayMargin ? "on" : "off"}`,
    `EQUITY_USD=${num(config.equityUsd)} MAX_SIGNAL_AGE_MIN=${num(age)} MAX_DRIFT_ATR=${num(config.maxDriftAtr)} HEAT_CAP=${num(config.heatCapMultiple)} MAX_IDEAS=${config.numOps}`,
    `CORE=${list(config.coreUniverse)}`,
    config.target === "grok"
      ? `FEES fut_maker_pct=${num(config.futMakerPct)} fut_taker_pct=${num(config.futTakerPct)} pass_through_usd=${num(config.futPassThroughUsd)}`
      : "",
    config.target === "grok" ? `EQUITY=${num(config.equityUsd)}` : "",
  ];
  const text = lines.filter(Boolean).join("\n") + "\n";
  return { text, chars: text.length };
}
