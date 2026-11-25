import { FUSIONS } from "../constants/resonance";
import type { Discovery } from "../types/unlock";
import { findSkill } from "./skills";

export function discoveryName(d: Discovery): string {
  if (d.type === "fusion") return FUSIONS.find((f) => f.id === d.id)?.name ?? "";
  if (d.type === "job") return d.job.name;
  return findSkill(d.skill)?.evolution.name ?? "";
}

export const DISCOVERY_LABEL: Readonly<Record<Discovery["type"], { toast: string; list: string }>> = {
  fusion: { toast: "Fusion found", list: "Fusion" },
  recipe: { toast: "Recipe learned", list: "Recipe" },
  job: { toast: "New job", list: "New job" },
};
