import { skillValues } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { hero, rng } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { callDancer } from "../summons/dancer";

const ID = "za_mirage";

/** call the dancers on the foe nearest `x`: one on its far side, and from level 7 one on each side */
function dance(x: number): void {
  const v = skillValues(ID);
  if (!rng.chance(v.chance)) return;
  const foe = nearestFoe(x, hero.y - 16);
  if (!foe) return;
  const far = Math.sign(foe.x - hero.x) || hero.face;
  callDancer(foe, far);
  if (v.pair) callDancer(foe, -far);
}

/** Mirage Dancer: a parry, and from level 4 a perfect dodge, may call a mirage dancer beside the attacker */
export const mirageDancer: SkillBehavior = {
  create: () => ({}),
  on: {
    parry(_memory, ev) {
      dance(ev.fromX);
    },
    perfectDodge(_memory, ev) {
      if (skillValues(ID).dodge) dance(ev.at);
    },
  },
};
