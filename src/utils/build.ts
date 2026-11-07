import { CHARM_STEP, CHARMS } from "../constants/charms";
import { FLOW, PICK_TOOLS, RELIC_MAX_LEVEL } from "../constants/growth";
import { RELICS } from "../constants/relics";
import type { Build, BuildStats, CharmId, RelicId, RelicLevel } from "../types/build";

/** a build with nothing in it, and the run's pick tools */
export function freshBuild(): Build {
  return {
    relics: {},
    charms: {},
    evolved: [],
    banished: [],
    rerolls: PICK_TOOLS.rerolls,
    skips: PICK_TOOLS.skips,
    banishes: PICK_TOOLS.banishes,
    flow: 0,
    flowIdle: 0,
    heroHits: 0,
    memory: {},
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

/** a relic's numbers at a level (or evolved), with the build's charms applied; damage stays raw, since Might applies to every hit */
export function relicStats(
  id: RelicId,
  level: number,
  evolved: boolean,
  s: BuildStats,
): Required<Omit<RelicLevel, "text">> {
  const def = RELICS[id];
  const row = evolved ? def.evolution.stats : def.levels[Math.max(0, Math.min(def.levels.length, level) - 1)];
  return {
    damage: row.damage,
    cooldown: (row.cooldown ?? 0) * s.cooldown,
    amount: (row.amount ?? 1) + s.amount,
    pierce: row.pierce ?? 1,
    area: (row.area ?? 1) * s.area,
    duration: (row.duration ?? 0) * s.duration,
    speed: (row.speed ?? 1) * s.speed,
  };
}

/** Flow's damage multiplier at this many stacks */
export const flowMultiplier = (stacks: number): number => 1 + FLOW.perStack * stacks;

/** the relics, charms and evolutions a build starts with */
export type StartBuild = Pick<Build, "relics" | "charms" | "evolved">;

const isRelic = (id: string): id is RelicId => id in RELICS;
const isCharm = (id: string): id is CharmId => id in CHARMS;

/** a build written as `wisp:8,might:5,evolve:wisp`: relics and charms at their levels (kept inside each one's range),
 *  and relics taken in their evolved form; unknown names are skipped */
export function parseStartBuild(text: string): StartBuild {
  const out: StartBuild = { relics: {}, charms: {}, evolved: [] };
  for (const part of text.split(",")) {
    const [id, value = ""] = part.trim().split(":");
    const level = Math.max(1, Math.floor(Number(value)) || 1);
    if (id === "evolve" && isRelic(value)) {
      out.relics[value] = RELIC_MAX_LEVEL;
      if (!out.evolved.includes(value)) out.evolved.push(value);
    } else if (isRelic(id)) out.relics[id] = Math.min(RELIC_MAX_LEVEL, level);
    else if (isCharm(id)) out.charms[id] = Math.min(CHARMS[id].maxLevel, level);
  }
  return out;
}
