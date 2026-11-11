import type { MarketMode, Target } from "./types.ts";

/** Public exchange candles do not serve CFM futures ids (checked 15 Oct 2026). */
export const FUTURES_PUBLIC_CANDLES = false;

export function dataSection(target: Target, mode: MarketMode): string {
  if (target === "grok") {
    const futures =
      mode === "leverage"
        ? "CFM futures ids are not on the public exchange candle API (BIP-20DEC30-CDE returned NotFound on 15 Oct 2026). Leverage candles, margin, and funding must be in USER DATA or the run is NO_DATA."
        : "";
    return [
      "T DATA (Grok)",
      "You have no Coinbase account tools. Data sources, in order:",
      "1) USER DATA block below, if filled. 2) Public endpoints:",
      "https://api.exchange.coinbase.com/products/{ID}/candles?granularity={60|300|900|3600|21600|86400}",
      "https://api.coinbase.com/api/v3/brokerage/market/products/{ID}/ticker?limit=1",
      "Never use prices from news, aggregators or memory. If neither source works -> NO_DATA, list what to paste, stop.",
      "Fees: use the FEES block. Equity: use EQUITY. Compute with code if available, else show the arithmetic.",
      "Universe limited to the CORE list (max 10).",
      futures,
      "USER DATA:",
      "<paste here>",
    ]
      .filter(Boolean)
      .join("\n");
  }
  return [
    "T DATA (Grok Bot)",
    "Use the Coinbase connector (namespace user-Coinbase-xai). Read-only tools only:",
    "coinbase_fees (SPOT, and FUTURE in Leverage mode), coinbase_products_list (paginate cursor; FUTURE in Leverage),",
    "coinbase_products_get, coinbase_products_candles, coinbase_products_best_bid_ask, coinbase_products_book,",
    "coinbase_products_ticker, coinbase_portfolios_list, coinbase_portfolios_get, coinbase_balance.",
    "FORBIDDEN: any orders_*, close_position, convert_*, transfer, portfolios_create/edit/delete, x402_*.",
    "Compute every indicator and number in code (shell), never by eye. Missing a required tool -> MISSING_TOOLS, print why, stop.",
    "1W bars: aggregate 1d candles into ISO weeks in code (the tool has no 1w granularity).",
    "There is no futures positions or margin-ratio tool. Equity = DERIVATIVES_CASH plus available USD/USDC, else EQUITY_USD (tag EQUITY_INPUT). Assume no open futures positions unless USER DATA lists them.",
  ].join("\n");
}
