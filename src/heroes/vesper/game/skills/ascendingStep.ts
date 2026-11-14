import { createFloorRing } from "../../../../game/effects/floorRing";
import { createSlash } from "../../../../game/effects/slash";
import { meleeHit } from "../../../../game/meleeHit";
import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { game, hero } from "../../../../game/state";
import { boxAhead, boxBehind, newSwing } from "../../../../game/world";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { DUSK_RAMP } from "../../look/colors";

const ID = "ve_ascend";
/** the jump's cut beside her, and the double jump's ring round her */
const JUMP_CUT = { cx: 0, cy: -14, R: 18, sy: 0.7, rot: 0, a0: 1.6, a1: -1.6, W: 6 } as const;
const AIR_RING = { cx: 0, cy: -16, R: 20, sy: 0.9, rot: 0, a0: -3.1, a1: 3.1, W: 5, sweep: 0.06 } as const;

/** a cut on leaving the floor, beside her on both sides, that throws foes up from its third level */
function jumpCut(power: number, launch: boolean): void {
  newSwing();
  game.fx.push(createSlash(hero.x, hero.y, hero.face, JUMP_CUT));
  meleeHit([boxAhead(-4, -34, 22, 4), boxBehind(-4, -34, 22, 4)], {
    power,
    kx: 10,
    ky: -60,
    launch: launch ? -240 : undefined,
  });
}

/** a ring cut round her in the air */
function airCut(power: number): void {
  newSwing();
  game.fx.push(createSlash(hero.x, hero.y, hero.face, AIR_RING));
  game.fx.push(createFloorRing(hero.x, hero.y - 14, 18, DUSK_RAMP, 0.3, 0.5));
  meleeHit([boxAhead(-6, -40, 24, 8), boxBehind(-6, -40, 24, 8)], { power, kx: 30, ky: -80 });
}

/**
 * Ascending Step: more air blows (read by her air string), a cut as she leaves the floor, a ring cut on the double jump,
 * a dodge in the air, and an air blow that lands gives the double jump back; as Moonlit Steps every jump cuts round her
 * and the double jump comes back after every air blow that lands.
 */
export const ascendingStep: SkillBehavior = {
  create: () => ({ refreshed: false }),
  on: {
    jump(memory, ev) {
      const v = skillValues(ID);
      if (!ev.air) {
        memory.refreshed = false;
        if (skillEvolved(ID)) airCut(v.doubleCut);
        else if (v.jumpCut) jumpCut(v.jumpCut, !!v.jumpLaunch);
        return;
      }
      if (v.doubleCut) airCut(v.doubleCut);
    },
    blow(memory, ev) {
      const v = skillValues(ID);
      if (!v.refresh || hero.ground || ev.source !== "attacks" || hero.jumps < 2) return;
      if (memory.refreshed && !skillEvolved(ID)) return;
      memory.refreshed = true;
      hero.jumps = 1;
    },
  },
};

/** Ascending Step lets her dodge in the air */
export const airDodge = (): boolean => !!skillValues(ID).airDash;
