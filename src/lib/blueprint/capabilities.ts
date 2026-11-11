/** Capability names the contract asks for. Tool names are examples, not assumptions. */

export interface CapabilityRow {
  cap: string;
  required: "yes" | "no";
  grokBot: string;
  legacy: string;
}

export const CAPABILITIES: CapabilityRow[] = [
  {
    cap: "PORTFOLIOS",
    required: "no",
    grokBot: "coinbase_portfolios_list",
    legacy: "coinbase___portfolios_list",
  },
  {
    cap: "BALANCE",
    required: "no",
    grokBot: "coinbase_balance",
    legacy: "coinbase___balance, coinbase___coinbase_balance",
  },
  { cap: "FEES", required: "no", grokBot: "coinbase_fees", legacy: "coinbase___fees" },
  {
    cap: "PRODUCTS",
    required: "yes",
    grokBot: "coinbase_products_list (+_get)",
    legacy: "coinbase___products_list",
  },
  {
    cap: "QUOTES",
    required: "yes",
    grokBot: "coinbase_products_best_bid_ask",
    legacy: "coinbase___best_bid_ask",
  },
  {
    cap: "BOOK",
    required: "no",
    grokBot: "coinbase_products_book",
    legacy: "coinbase___product_book",
  },
  {
    cap: "CANDLES",
    required: "yes",
    grokBot: "coinbase_products_candles",
    legacy: "coinbase___candles",
  },
];

export function capabilityTable(): string {
  const rows = CAPABILITIES.map((row) => {
    const cap = row.cap.padEnd(10, " ");
    const required = row.required.padEnd(9, " ");
    const name = row.grokBot.padEnd(33, " ");
    return `${cap} ${required} ${name} ${row.legacy}`;
  });
  return [
    "CAP        REQUIRED  GROK BOT NAME                     LEGACY NAMES",
    ...rows,
    "FORBIDDEN: any orders, preview, convert, transfer, portfolio create/edit/delete, or payment tool.",
  ].join("\n");
}
