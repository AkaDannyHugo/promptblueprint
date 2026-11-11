import { useEffect, useState } from "react";
import { FileText, SlidersHorizontal } from "lucide-react";
import { configFromSearch, forgetSavedHistory, searchFor, useBlueprint } from "@/lib/blueprint/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfigPanel } from "./config-panel";
import { AppHeader } from "./header";
import { PromptPane } from "./prompt-pane";
import { cn } from "@/lib/utils";

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const apply = () => setNarrow(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return narrow;
}

export function BlueprintApp() {
  const mobilePane = useBlueprint((s) => s.mobilePane);
  const setMobilePane = useBlueprint((s) => s.setMobilePane);
  const darkMode = useBlueprint((s) => s.config.darkMode);
  const config = useBlueprint((s) => s.config);
  const hydrated = useBlueprint((s) => s.hydrated);
  const replaceConfig = useBlueprint((s) => s.replaceConfig);
  const markHydrated = useBlueprint((s) => s.markHydrated);
  const narrow = useNarrow();

  useEffect(() => {
    forgetSavedHistory();
    const next = configFromSearch(window.location.search, useBlueprint.getState().config.darkMode);
    if (next) replaceConfig(next);
    else markHydrated();
  }, [markHydrated, replaceConfig]);

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => {
      const qs = searchFor(config);
      const path = window.location.pathname;
      const next = qs ? `${path}?${qs}` : path;
      const current = `${path}${window.location.search}`;
      if (next !== current) window.history.replaceState(null, "", next);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [config, hydrated]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  return (
    <TooltipProvider>
      <div className="blueprint-grid flex h-dvh min-h-dvh flex-col bg-bg text-fg">
        <AppHeader />
        <div className="relative min-h-0 flex-1 overflow-hidden lg:flex">
          <aside
            inert={narrow && mobilePane !== "configure" ? true : undefined}
            className={cn(
              "pane-slide absolute inset-0 z-10 flex min-h-0 flex-col bg-bg lg:static lg:z-auto lg:w-[28rem] lg:shrink-0 lg:translate-x-0 lg:border-r lg:border-border lg:bg-transparent lg:transition-none",
              mobilePane === "contract" ? "-translate-x-full" : "translate-x-0",
            )}
          >
            <ConfigPanel />
          </aside>
          <section
            aria-labelledby="contract-heading"
            inert={narrow && mobilePane !== "contract" ? true : undefined}
            className={cn(
              "pane-slide absolute inset-0 z-10 flex min-h-0 flex-col bg-surface lg:static lg:z-auto lg:min-w-0 lg:flex-1 lg:translate-x-0 lg:transition-none",
              mobilePane === "configure" ? "translate-x-full" : "translate-x-0",
            )}
          >
            <PromptPane />
          </section>
        </div>
        <nav className="border-t border-border pb-[env(safe-area-inset-bottom)] lg:hidden">
          <div className="relative grid h-14 grid-cols-2">
            <span
              aria-hidden
              data-pane={mobilePane}
              className="pane-pill pointer-events-none absolute top-2 bottom-2 left-2 rounded-full bg-elevated shadow-[var(--shadow-border)]"
            />
            <button
              type="button"
              aria-pressed={mobilePane === "configure"}
              onClick={() => setMobilePane("configure")}
              className={cn(
                "pressable relative z-10 flex flex-col items-center justify-center gap-0.5 text-xs font-medium uppercase tracking-widest",
                mobilePane === "configure" ? "text-accent" : "text-muted",
              )}
            >
              <SlidersHorizontal className="size-4" />
              Configure
            </button>
            <button
              type="button"
              aria-pressed={mobilePane === "contract"}
              onClick={() => setMobilePane("contract")}
              className={cn(
                "pressable relative z-10 flex flex-col items-center justify-center gap-0.5 text-xs font-medium uppercase tracking-widest",
                mobilePane === "contract" ? "text-accent" : "text-muted",
              )}
            >
              <FileText className="size-4" />
              Contract
            </button>
          </div>
        </nav>
      </div>
    </TooltipProvider>
  );
}