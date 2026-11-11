export function GuideBody() {
  return (
    <div className="grid gap-4 text-sm leading-relaxed text-muted">
      <p>
        This builds one paste-ready Coinbase scan. It does not trade, and it does not keep a history. The link is the setting.
      </p>
      <p>
        <span className="text-fg">Grok Bot</span> uses the Coinbase connector and computes every number in code. Read-only tools only.
      </p>
      <p>
        <span className="text-fg">Grok</span> has no account tools. Paste a USER DATA block, or it may read the public candle and ticker URLs. Futures candles are not on that public API, so a leverage run needs the paste.
      </p>
      <p>
        <span className="text-fg">Aggressive</span> is the default: 4 hour entries, daily trend, maker entry, taker exit, after a 25% Coinbase One rebate capped at $100 a month.
      </p>
      <p>
        <span className="text-fg">Perps</span> is US futures only. Stops are checked against overnight margin. Losses can exceed margin.
      </p>
    </div>
  );
}
