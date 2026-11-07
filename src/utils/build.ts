import { CHARM_STEP, CHARMS } from "../constants/charms";
import { FLOW, PICK_TOOLS, SKILL_MAX_LEVEL, SKILL_SLOTS } from "../constants/growth";
import type { Build, BuildStats, CharmId, PickToolKey } from "../types/build";
import type { CharacterDef } from "../types/character";

/** a build with nothing in it, and the run's pick tools with what the shop adds */
export function freshBuild(extra: Partial<Record<PickToolKey, number>> = {}): Build {
  return {
    skills: {},
    charms: {},
    evolved: [],
    banished: [],
    rerolls: PICK_TOOLS.rerolls + (extra.rerolls ?? 0),
    skips: PICK_TOOLS.skips + (extra.skips ?? 0),
    banishes: PICK_TOOLS.banishes + (extra.banishes ?? 0),
    flow: 0,
    flowIdle: 0,
    chest: [],
  };
}

/** the multipliers a build's charms give every source */
export function buildStats(b: Build): BuildStats {
  const lv = (id: keyof Build["charms"]): number => b.charms[id] ?? 0;
  return {
    might: 1 + CHARM_STEP.might * lv("might"),
    cooldown: 1 - CHARM_STEP.haste * lv("haste"),
    amount: CHARM_STEP.multitude * lv("multitude"),
    area: 1 + CHARM_STEP.reach * lv("reach"),
    duration: 1 + CHARM_STEP.persistence * lv("persistence"),
    speed: 1 + CHARM_STEP.swiftness * lv("swiftness"),
    luck: 1 + CHARM_STEP.fortune * lv("fortune"),
    growth: 1 + CHARM_STEP.insight * lv("insight"),
    vigor: CHARM_STEP.vigor ** lv("vigor"),
    regen: CHARM_STEP.vigorRegen * lv("vigor"),
    crit: CHARM_STEP.fortuneCrit * lv("fortune"),
    move: 1 + CHARM_STEP.swiftnessMove * lv("swiftness"),
    flowCap: Math.round(FLOW.cap * (1 + CHARM_STEP.resonance * lv("resonance"))),
  };
}

/** the charm stats a skill's own numbers take: Multitude adds to amounts, the others multiply */
export type CharmedStat = "amount" | "area" | "duration" | "speed" | "cooldown";

/** a skill's number with the build's charms applied: `amount` adds Multitude, the rest multiply */
export function charmed(stat: CharmedStat, value: number, s: BuildStats): number {
  if (stat === "amount") return value + s.amount;
  return value * s[stat];
}

/** Flow's damage multiplier at this many stacks */
export const flowMultiplier = (stacks: number): number => 1 + FLOW.perStack * stacks;

/** the skills, charms and evolutions a build starts with */
export type StartBuild = Pick<Build, "skills" | "charms" | "evolved">;

const isCharm = (id: string): id is CharmId => id in CHARMS;

/** a build written as `<skill id>:8,evolve:<skill id>,might:5`: the hero's skills and charms at their levels (kept
 *  inside each one's range, at most `SKILL_SLOTS` skills), and skills taken at their top level in their evolved form;
 *  unknown names are skipped */
export function parseStartBuild(text: string, c: CharacterDef): StartBuild {
  const out: StartBuild = { skills: {}, charms: {}, evolved: [] };
  const isSkill = (id: string): boolean => c.skills.some((s) => s.id === id);
  const room = (id: string): boolean => id in out.skills || Object.keys(out.skills).length < SKILL_SLOTS;
  for (const part of text.split(",")) {
    const [id, value = ""] = part.trim().split(":");
    const level = Math.max(1, Math.floor(Number(value)) || 1);
    if (id === "evolve" && isSkill(value) && room(value)) {
      out.skills[value] = SKILL_MAX_LEVEL;
      if (!out.evolved.includes(value)) out.evolved.push(value);
    } else if (isSkill(id) && room(id)) out.skills[id] = Math.min(SKILL_MAX_LEVEL, level);
    else if (isCharm(id)) out.charms[id] = Math.min(CHARMS[id].maxLevel, level);
  }
  return out;
}
