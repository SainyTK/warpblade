import { markFoe } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { hero } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { fillChamber } from "../chamber";
import { counterShot } from "../counterShot";
import { calderFx } from "../skillFx";
import { calder } from "../state";

const SKILL = "ca_pointblank";
/** the mark lasts this long */
const MARK_TIME = 4;

/** Point Blank's and Drum Cylinder's share of the counter shot: its power and stagger on the target, and the rounds it loads */
export function counterBonus(): { power: number; rounds: number; stagger: number } {
  const v = skillValues(SKILL);
  return {
    power: 1 + (v.power ?? 0),
    rounds: (v.rounds ?? 0) + (skillValues("ca_drum").parry ?? 0),
    stagger: v.stagger ?? 0,
  };
}

export function counterFx(x: number, y: number, damage: number): void {
  if (!skillValues(SKILL).power && !skillValues(SKILL).rounds) return;
  calderFx(SKILL, "burst", { x, y, face: hero.face, reach: 9 }, { damage });
  if (!skillEvolved(SKILL)) return;
  const line = { x: hero.x + hero.face * 12, y, face: hero.face, toX: x + hero.face * 60, toY: y };
  calderFx(SKILL, "trail", line, { damage, quiet: true });
}

/** After the counter shot: Point Blank marks the foe, makes the next Trigger free, and as Deadeye fills the chamber */
export function afterCounterShot(foe: Enemy | null): void {
  const v = skillValues(SKILL);
  if (foe && v.mark) markFoe(foe, SKILL, withBuild("duration", MARK_TIME), v.mark);
  if (v.free) calder.freeTrigger = true;
  if (skillEvolved(SKILL)) fillChamber(calder.hot);
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
