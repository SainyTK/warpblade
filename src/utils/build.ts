import { FLOW, PICK_TOOLS, SKILL_MAX_LEVEL, SKILL_SLOTS } from "../constants/growth";
import { ARTS } from "../stages/arts";
import type { Build, BuildStats, PickToolKey } from "../types/build";
import type { ArtId } from "../types/campaign";
import type { CharacterDef } from "../types/character";
import { resonanceRanks, resonanceStats } from "./resonance";

/** a build with nothing in it, and the run's pick tools with what the Armory adds */
export function freshBuild(extra: Partial<Record<PickToolKey, number>> = {}): Build {
  return {
    skills: {},
    arts: {},
    evolved: [],
    mastery: {},
    chargeRank: 0,
    attunement: {},
    honing: {},
    banished: [],
    rerolls: PICK_TOOLS.rerolls + (extra.rerolls ?? 0),
    skips: PICK_TOOLS.skips + (extra.skips ?? 0),
    banishes: PICK_TOOLS.banishes + (extra.banishes ?? 0),
    flow: 0,
    flowIdle: 0,
    chest: [],
  };
}

const ART_LEVELS = 5;

export const buildStats = (b: Build, c: CharacterDef): BuildStats => resonanceStats(resonanceRanks(b, c, ARTS));

export type BuildStat = "amount" | "area" | "duration" | "speed" | "cooldown";

export function scaledByBuild(stat: BuildStat, value: number, s: BuildStats): number {
  if (stat === "amount") return value + s.amount;
  return value * s[stat];
}

/** Flow's damage multiplier at this many stacks */
export const flowMultiplier = (stacks: number): number => 1 + FLOW.perStack * stacks;

/** the skills, charms and evolutions a build starts with */
export type StartBuild = Pick<Build, "skills" | "arts" | "evolved">;

const isArt = (id: string): id is ArtId => id in ARTS;

/** a build written as `<skill id>:8,evolve:<skill id>,might:5`: the hero's skills and charms at their levels (kept
 *  inside each one's range, at most `SKILL_SLOTS` skills), and skills taken at their top level in their evolved form;
 *  unknown names are skipped */
export function parseStartBuild(text: string, c: CharacterDef): StartBuild {
  const out: StartBuild = { skills: {}, arts: {}, evolved: [] };
  const isSkill = (id: string): boolean => c.skills.some((s) => s.id === id);
  const room = (id: string): boolean => id in out.skills || Object.keys(out.skills).length < SKILL_SLOTS;
  for (const part of text.split(",")) {
    const [id, value = ""] = part.trim().split(":");
    const level = Math.max(1, Math.floor(Number(value)) || 1);
    if (id === "evolve" && isSkill(value) && room(value)) {
      out.skills[value] = SKILL_MAX_LEVEL;
      if (!out.evolved.includes(value)) out.evolved.push(value);
    } else if (isSkill(id) && room(id)) out.skills[id] = Math.min(SKILL_MAX_LEVEL, level);
    else if (isArt(id)) out.arts[id] = Math.min(ART_LEVELS, level);
  }
  return out;
}
