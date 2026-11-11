import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { APP_VERSION } from "@/lib/blueprint/constants";
import { buildContract } from "@/lib/blueprint/prompt";
import { copyText, downloadText, estimateTokens, formatCount, weightTotal } from "@/lib/blueprint/format";
import { useBlueprint } from "@/lib/blueprint/store";
import { getNotices } from "@/lib/blueprint/warnings";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconSwap } from "./states";
import { VariationsPanel } from "./variations-panel";

type CopyPhase = "idle" | "copied" | "failed";

export function PromptPane() {
  const config = useBlueprint((s) => s.config);
  const mobilePane = useBlueprint((s) => s.mobilePane);
  const [prompt, setPrompt] = useState(() => buildContract(config).text);
  const [contractId, setContractId] = useState(() => buildContract(config).contractId);
  const [copyPhase, setCopyPhase] = useState<CopyPhase>("idle");
  const copyTimer = useRef<number | null>(null);
  const copyRef = useRef<() => void>(() => {});
  const blocked = getNotices(config).some((notice) => notice.level === "error");

  function currentContract() {
    return buildContract(config);
  }

  useEffect(() => {
    const next = currentContract();
    setPrompt(next.text);
    setContractId(next.contractId);
    // The stamp is refreshed again at copy and export.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  copyRef.current = () => {
    void onCopy();
  };

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "c") return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (window.getSelection()?.toString()) return;
      const narrow = window.matchMedia("(max-width: 1023px)").matches;
      if (narrow && mobilePane !== "contract") return;
      if (blocked) return;
      event.preventDefault();
      copyRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobilePane, blocked]);

  function onExport() {
    const next = currentContract();
    setPrompt(next.text);
    setContractId(next.contractId);
    downloadText("prompt-blueprint.txt", next.text, "text/plain;charset=utf-8");
    toast.success("Exported as text");
  }

  async function onCopy() {
    if (blocked) return;
    const next = currentContract();
    setPrompt(next.text);
    setContractId(next.contractId);
    const ok = await copyText(next.text);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    if (ok) {
      setCopyPhase("copied");
      toast.success("Contract copied");
      copyTimer.current = window.setTimeout(() => setCopyPhase("idle"), 1400);
    } else {
      setCopyPhase("failed");
      toast.error("Could not copy. Select the contract and copy it manually.");
      copyTimer.current = window.setTimeout(() => setCopyPhase("idle"), 2000);
    }
  }

  const tokens = estimateTokens(prompt);
  const weightSum = weightTotal(config);
  const lev = config.marketMode === "leverage";
  const badge = !lev ? "SPOT" : "LEV · US";
  const hot = lev && config.maxLeverage > 3;
  const withinLimit = prompt.length <= 9000;

  return (
    <>
      <h2 id="contract-heading" className="sr-only">
        Contract
      </h2>
      <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <div className="mr-auto flex items-center gap-2 font-mono text-xs tabular-nums text-muted">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium tracking-wide",
              hot ? "bg-warn/15 text-warn" : "bg-elevated text-fg",
            )}
          >
            {badge}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              withinLimit ? "bg-elevated text-fg" : "bg-warn/15 text-warn",
            )}
          >
            {withinLimit ? "Under 9k" : "Over 9k"}
          </span>
          <span className="max-w-full break-all">
            v{APP_VERSION} · {formatCount(prompt.length)} chars · ~{formatCount(tokens)} tok
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={onCopy} disabled={blocked}>
          <IconSwap show={copyPhase === "copied"} alt={<Copy className="size-3.5" />}>
            <Check className="size-3.5" />
          </IconSwap>
          {blocked ? "Copy blocked" : copyPhase === "copied" ? "Copied" : copyPhase === "failed" ? "Copy failed" : "Copy"}
        </Button>
        <Button variant="secondary" size="sm" onClick={onExport}>
          <Download className="size-3.5" />
          Export
        </Button>
        <span className="sr-only" aria-live="polite">
          {copyPhase === "copied" ? "Contract copied" : copyPhase === "failed" ? "Copy failed" : ""}
        </span>
        {weightSum !== 100 ? (
          <span className="rounded-full bg-warn/15 px-2.5 py-1 text-xs font-medium text-warn">
            Weights {weightSum}
          </span>
        ) : null}
      </div>
      <VariationsPanel />
      <pre
        className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words px-5 py-5 font-mono text-xs leading-relaxed text-fg"
        aria-label="Generated prompt"
      >
        {prompt}
      </pre>
    </div>
    </>
  );
}
