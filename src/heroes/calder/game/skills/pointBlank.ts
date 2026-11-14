import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { markFoe } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { game, hero } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { fillChamber } from "../chamber";
import { counterShot } from "../counterShot";
import { calder } from "../state";

const SKILL = "ca_pointblank";
/** the mark lasts this long, and the pierce reaches this far past the foe */
const MARK_TIME = 4;
const PIERCE_REACH = 70;

/** Point Blank's and Drum Cylinder's share of the counter shot: its power on the target, and the rounds it loads */
export function counterBonus(_foe: Enemy | null): { power: number; rounds: number } {
  const v = skillValues(SKILL);
  return { power: 1 + (v.power ?? 0), rounds: (v.rounds ?? 0) + (skillValues("ca_drum").parry ?? 0) };
}

/**
 * After the counter shot: Point Blank marks the foe, pierces to the foes behind it with the plain shot, makes the next
 * Trigger free, and as Deadeye fills the chamber with hot rounds.
 */
export function afterCounterShot(foe: Enemy | null, plain: number): void {
  const v = skillValues(SKILL);
  if (foe && v.mark) markFoe(foe, SKILL, withCharms("duration", MARK_TIME), v.mark);
  if (v.free) calder.freeTrigger = true;
  if (skillEvolved(SKILL)) fillChamber(true);
  if (!v.pierce || !foe) return;
  const [fx] = enemyCenter(foe);
  for (const e of game.enemies) {
    if (e === foe || e.hp <= 0) continue;
    const past = (enemyCenter(e)[0] - fx) * hero.face;
    if (past <= 0 || past > PIERCE_REACH || Math.abs(e.y - foe.y) > 30) continue;
    dealDamage(e, plain, { fromX: hero.x, kx: hero.face * 100, ky: -40, heavy: true });
  }
}

/** Point Blank's sixth level: a perfect dodge fires the counter shot too */
export const pointBlank: SkillBehavior = {
  create: () => ({}),
  on: {
    perfectDodge() {
      if (skillValues(SKILL).dodge) counterShot(null);
    },
  },
};
