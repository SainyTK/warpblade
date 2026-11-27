import { enemyCenter } from "../../../../game/enemies/enemy";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { hero, progress } from "../../../../game/state";
import { surfaceBelow } from "../../../../game/world";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { blastAt, blastFoe } from "../blastFoe";
import { calderFx, calderRing } from "../skillFx";
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
  const ring = { x: hero.x, y: hero.y, face: hero.face, reach: withBuild("area", LANDING) * 0.7 };
  calderRing(SKILL, "wave", ring, { damage: progress.stats.ad * v.drop });
  floorShock(hero.x, hero.y, { damage: progress.stats.ad * v.drop, reach: withBuild("area", LANDING), stun: v.stun });
}

/** Skyshot: an air blow that struck a foe fires a round down into it */
export function skyshot(foe: Enemy | null): void {
  if (!foe || foe.hp <= 0 || hero.ground || !skillEvolved(SKILL)) return;
  const [fx, fy] = enemyCenter(foe);
  calderFx(SKILL, "bolt", { x: fx, y: fy, reach: 40 }, { damage: progress.stats.ad * skillValues(SKILL).skyshot });
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
      const reach = withBuild("area", UNDER.reach);
      const under = { x: hero.x, y: surfaceBelow(hero.x, y), face: hero.face, reach: 30 };
      calderFx(SKILL, "pillar", under, { damage: progress.stats.ad * v.power });
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
