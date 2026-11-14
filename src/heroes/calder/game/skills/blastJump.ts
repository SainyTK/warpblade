import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { blastAt, blastFoe } from "../blastFoe";
import { calder } from "../state";
import { floorShock } from "./floorShock";

const SKILL = "ca_blastjump";
/** the blast under a double jump: its reach round the point under Calder, and how far below him it goes off */
const UNDER = { reach: 26, below: 6 } as const;
/** the reach of Drop cut's landing blast */
const LANDING = 34;

/** Blast Jump's landing: Drop cut meets the floor and a round goes off in it */
export function dropLanded(): void {
  const v = skillValues(SKILL);
  if (!v.drop) return;
  floorShock(hero.x, hero.y, { damage: progress.stats.ad * v.drop, reach: withCharms("area", LANDING), stun: v.stun });
}

/** Skyshot: an air blow that struck a foe fires a round down into it */
export function skyshot(foe: Enemy | null): void {
  if (!foe || foe.hp <= 0 || hero.ground || !skillEvolved(SKILL)) return;
  blastFoe(foe, {
    damage: progress.stats.ad * skillValues(SKILL).skyshot,
    splash: 0,
    reach: 0,
    kx: 20,
    ky: 120,
    hot: calder.hot,
  });
}

/** Blast Jump: the double jump fires a round down, blasting the foes under Calder */
export const blastJump: SkillBehavior = {
  create: () => ({}),
  on: {
    jump(_m, event) {
      if (!event.air) return;
      const v = skillValues(SKILL);
      const y = hero.y + UNDER.below;
      const reach = withCharms("area", UNDER.reach);
      blastAt(null, hero.x, y, {
        damage: 0,
        splash: progress.stats.ad * v.power,
        reach,
        kx: 40,
        ky: v.launch ? -280 : 80,
        hot: calder.hot,
        big: true,
      });
    },
  },
};
