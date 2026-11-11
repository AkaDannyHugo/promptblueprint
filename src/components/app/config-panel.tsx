import { useEffect, useRef } from "react";
import { Globe, Activity, Shield, SlidersHorizontal, FileOutput } from "lucide-react";
import { useBlueprint } from "@/lib/blueprint/store";
import type { ConfigSection } from "@/lib/blueprint/types";
import { getNotices } from "@/lib/blueprint/warnings";
import { cn } from "@/lib/utils";
import { OutputSection } from "./section-output";
import { RiskSection } from "./section-risk";
import { ScoringSection } from "./section-scoring";
import { StrategySection } from "./section-strategy";
import { UniverseSection } from "./section-universe";

const TABS: { id: ConfigSection; label: string; icon: typeof Globe }[] = [
  { id: "universe", label: "Universe", icon: Globe },
  { id: "strategy", label: "Strategy", icon: Activity },
  { id: "risk", label: "Risk", icon: Shield },
  { id: "scoring", label: "Scoring", icon: SlidersHorizontal },
  { id: "output", label: "Output", icon: FileOutput },
];

export function ConfigPanel() {
  const section = useBlueprint((s) => s.section);
  const setSection = useBlueprint((s) => s.setSection);
  const config = useBlueprint((s) => s.config);
  const notices = getNotices(config);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [section]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="no-scrollbar flex gap-1 overflow-x-auto px-4 pt-3 pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const on = section === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSection(tab.id)}
              className={cn(
                "pressable inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-3 text-xs font-medium select-none",
                on
                  ? "bg-accent text-accent-fg"
                  : "text-muted hover:bg-elevated hover:text-fg",
              )}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>
      {notices.length > 0 ? (
        <ul className="grid gap-2 px-4 pb-2">
          {notices.map((n) => (
            <li
              key={n.message}
              className={cn(
                "notice-in rounded-lg px-3 py-2 text-xs leading-relaxed shadow-[var(--shadow-border)]",
                n.level === "error"
                  ? "bg-warn/15 text-warn"
                  : n.level === "warn"
                    ? "text-warn"
                    : "text-accent",
              )}
            >
              {n.message}
            </li>
          ))}
        </ul>
      ) : null}
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        <div key={section} className="stagger-in grid gap-4">
          {section === "universe" && <UniverseSection />}
          {section === "strategy" && <StrategySection />}
          {section === "risk" && <RiskSection />}
          {section === "scoring" && <ScoringSection />}
          {section === "output" && <OutputSection />}
        </div>
      </div>
    </div>
  );
}