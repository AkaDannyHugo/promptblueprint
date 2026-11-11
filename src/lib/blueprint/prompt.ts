import { buildLeverageContract } from "./prompt.lev.ts";
import { buildSpotContract } from "./prompt.v5.ts";
import type { BlueprintConfig } from "./types.ts";

export interface BuiltContract {
  text: string;
  hash12: string;
  contractId: string;
  chars: number;
}

export function buildContract(config: BlueprintConfig): BuiltContract {
  const built =
    config.marketMode === "leverage" ? buildLeverageContract(config) : buildSpotContract(config);
  return { text: built.text, hash12: "", contractId: "", chars: built.chars };
}

export function buildPrompt(config: BlueprintConfig): string {
  return buildContract(config).text;
}
