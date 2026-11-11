import { useRef, useState } from "react";
import { BookOpen, Moon, RotateCcw, Sun, Upload } from "lucide-react";
import { toast } from "sonner";
import { PROFILE_META, TARGET_OPTIONS } from "@/lib/blueprint/constants";
import { profileLabel } from "@/lib/blueprint/format";
import { ignoredImportKeys, parseImportedConfig, useBlueprint } from "@/lib/blueprint/store";
import type { BlueprintConfig, MarketMode, ProfileId, Target } from "@/lib/blueprint/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GuideBody } from "./guide-dialog";
import { IconSwap } from "./states";
import { cn } from "@/lib/utils";

const PROFILES = Object.keys(PROFILE_META) as ProfileId[];

function subtitle(config: BlueprintConfig): string {
  const desk = profileLabel(config);
  const book = config.marketMode === "leverage" ? "US futures" : "spot";
  const who = config.target === "grok" ? "Grok" : "Grok Bot";
  return `${desk} · ${book} · ${who}`;
}

export function AppHeader() {
  const config = useBlueprint((s) => s.config);
  const patch = useBlueprint((s) => s.patch);
  const applyProfile = useBlueprint((s) => s.applyProfile);
  const reset = useBlueprint((s) => s.reset);
  const importConfig = useBlueprint((s) => s.importConfig);
  const fileRef = useRef<HTMLInputElement>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  function onImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(String(reader.result));
        const parsed = parseImportedConfig(raw);
        if (!parsed) throw new Error("bad");
        importConfig(parsed);
        const ignored = ignoredImportKeys(raw);
        toast.success(ignored.length ? `Imported. Ignored: ${ignored.slice(0, 6).join(", ")}` : "Config imported");
      } catch {
        toast.error("That file is not a blueprint config");
      }
    };
    reader.readAsText(file);
  }

  return (
    <header className="shrink-0 border-b border-border bg-bg/80 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 lg:px-6">
        <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:gap-3">
          <Mark />
          <div className="min-w-0 flex-1 sm:flex-none">
            <h1 className="truncate font-display text-lg font-semibold leading-none tracking-tight sm:text-xl">
              Prompt Blueprint
            </h1>
            <p className="mt-1 truncate font-mono text-xs text-muted">{subtitle(config)}</p>
          </div>
        </div>

        <div className="flex h-11 shrink-0 overflow-hidden rounded-full bg-elevated shadow-[var(--shadow-border)]" role="group" aria-label="Target">
          {TARGET_OPTIONS.map((option) => {
            const on = config.target === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={on}
                onClick={() => patch({ target: option.id as Target })}
                className={cn(
                  "pressable h-11 rounded-full px-3 text-sm font-medium select-none",
                  on ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex h-11 shrink-0 overflow-hidden rounded-full bg-elevated shadow-[var(--shadow-border)]" role="group" aria-label="Market">
          {(
            [
              ["spot", "Spot"],
              ["leverage", "Leverage"],
            ] as const
          ).map(([id, label]) => {
            const on = config.marketMode === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => patch({ marketMode: id as MarketMode })}
                className={cn(
                  "pressable h-11 rounded-full px-4 text-sm font-medium select-none",
                  on ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={config.darkMode ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => {
              const next = !config.darkMode;
              patch({ darkMode: next });
              document.documentElement.classList.toggle("dark", next);
              document.documentElement.classList.toggle("light", !next);
            }}
          >
            <IconSwap show={config.darkMode} alt={<Moon className="size-4" />}>
              <Sun className="size-4" />
            </IconSwap>
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Guide" onClick={() => setGuideOpen(true)}>
            <BookOpen className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Import settings" onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" />
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onImportFile(file);
              event.target.value = "";
            }}
          />
          <Button variant="ghost" size="icon-sm" aria-label="Reset to defaults" onClick={() => setResetOpen(true)}>
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>

      <div className="no-scrollbar flex gap-1 overflow-x-auto px-4 pb-3 lg:px-6">
        {PROFILES.map((id) => {
          const on = config.profile === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              onClick={() => applyProfile(id)}
              className={cn(
                "pressable h-11 shrink-0 rounded-full px-3 text-xs font-medium select-none",
                on ? "bg-accent text-accent-fg" : "text-muted hover:bg-elevated hover:text-fg",
              )}
            >
              {PROFILE_META[id].label}
            </button>
          );
        })}
        {config.profile === "custom" ? (
          <span className="inline-flex h-11 items-center rounded-full px-3 text-xs text-accent">Custom</span>
        ) : null}
      </div>

      <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
        <DialogContent title="How to use this">
          <GuideBody />
        </DialogContent>
      </Dialog>
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent title="Reset this book?">
          <p className="text-sm text-muted">Every control returns to Aggressive Spot. The link updates. Nothing is stored.</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                reset();
                setResetOpen(false);
                toast.success("Back to Aggressive Spot");
              }}
            >
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function Mark() {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className="size-8 shrink-0">
      <rect width="32" height="32" rx="8" className="fill-accent" />
      <path d="M8 22V10h4.2l3.8 7.2L19.8 10H24v12h-3.2v-7.1L17.2 22h-2.4l-3.6-7.1V22H8Z" className="fill-accent-fg" />
    </svg>
  );
}
