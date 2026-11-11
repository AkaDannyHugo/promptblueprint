import { spotRoundTripPct } from "./math.ts";
import type { BlueprintConfig, Notice } from "./types.ts";

export function spotRtPct(config: BlueprintConfig): number {
  return spotRoundTripPct({
    makerPct: config.fallbackMakerBps / 100,
    takerPct: config.defaultFeeBps / 100,
    rebatePct: config.rebatePct,
    entryOrder: config.entryOrder,
  });
}

export function getNotices(config: BlueprintConfig): Notice[] {
  const notices: Notice[] = [];
  const leverage = config.marketMode === "leverage";

  if (config.targetCapR <= config.minRrr) {
    notices.push({
      level: "error",
      message: "Target cap has to sit above the min gross R, or every idea fails.",
    });
  }
  if (config.minNetR > config.targetCapR) {
    notices.push({
      level: "error",
      message: "Min net R is above the target cap, so nothing can qualify.",
    });
  }
  if (config.maxLeverage > 4) {
    notices.push({ level: "error", message: "Leverage is capped at 4x in this book." });
  }
  if (config.riskPerTradePct > 2) {
    notices.push({ level: "error", message: "Risk per idea is above 2%." });
  }
  if (leverage && config.liqBufferMultiple < 1.5) {
    notices.push({
      level: "error",
      message: "The liquidation buffer has to be at least 1.5x the stop.",
    });
  }

  if (!leverage) {
    const rt = spotRtPct(config);
    const feesR = rt / config.minStopPct;
    if (feesR > config.maxFeesR) {
      notices.push({
        level: "warn",
        message: `A stop at the minimum pays ${feesR.toFixed(2)}R in fees, above the ${config.maxFeesR}R cap.`,
      });
    }
    if (config.entryTf === "15m" || config.entryTf === "1H") {
      notices.push({
        level: "warn",
        message: "15m and 1H spot stops are usually fee-heavy at retail taker rates.",
      });
    }
    if (config.fundingLeg === "btc") {
      notices.push({
        level: "warn",
        message: "A BTC funding leg charges four fee legs on a USD or USDC pair.",
      });
    }
  }
  if (leverage && config.useIntradayMargin) {
    notices.push({
      level: "warn",
      message: "Intraday margin reprices to the overnight rate at 4:00 PM ET.",
    });
  }
  if (config.target === "grok" && config.universeSize > 10 && !leverage) {
    notices.push({
      level: "warn",
      message: "Without the connector, Grok only screens the core list, up to 10 names.",
    });
  }
  return notices;
}
