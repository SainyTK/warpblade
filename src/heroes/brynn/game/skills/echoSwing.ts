import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createImpact } from "../../../../game/effects/impact";
import { createSlash } from "../../../../game/effects/slash";
import { enemyBox } from "../../../../game/enemies/enemy";
import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import { hitStop } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { CRIMSON, CRIMSON_SPARKS } from "../../constants/colors";
import { brynnFx, CRESCENT } from "../fx";
import { showEcho } from "../phantom";

const ID = "br_echo";
/** the echo stands this far from the foe's edge, shows this long, cleaves this far apart in time, and reaches foes
 *  this close beside its target */
const ECHO = { gap: 8, life: 0.45, first: 0.08, between: 0.16, ring: 26 } as const;

/** an echo on `side` of the foe (1 its right, -1 its left) that cleaves it `cuts` times */
function createEcho(foe: Enemy, side: number, cuts: number, power: number): Effect {
  const box = enemyBox(foe);
  const x = side > 0 ? box[2] + ECHO.gap : box[0] - ECHO.gap;
  const face = -side;
  showEcho(x, foe.y, face, ECHO.life);
  let t = 0;
  let done = 0;
  return {
    update(dt) {
      t += dt;
      if (done < cuts && t >= ECHO.first + done * ECHO.between) {
        done++;
        game.fx.push(
          createSlash(x, foe.y, face, {
            cx: 10,
            cy: -22,
            R: 28,
            sy: 0.85,
            rot: 0.1,
            a0: -2.5,
            a1: 1.05,
            W: 12,
            ramp: CRIMSON,
          }),
        );
        game.fx.push(createFloorRing(x + face * 20, foe.y, 20, CRIMSON, 0.3));
        const at = { x: x + face * 4, y: foe.y - 20, face, reach: 22 };
        brynnFx(ID, "slash", at, { damage: progress.stats.ad * power, quiet: done > 1, signature: CRESCENT });
        if (foe.hp > 0) {
          dealDamage(foe, progress.stats.ad * power, {
            fromX: x,
            kx: face * 80,
            ky: -40,
            stun: 0.6,
            heavy: true,
            source: ID,
          });
          game.fx.push(createImpact(foe.x, foe.y - 10, face, true, CRIMSON_SPARKS));
          hitStop(0.05);
        }
        const ring = skillValues(ID).ring;
        if (ring)
          for (const other of game.enemies)
            if (other !== foe && other.hp > 0 && Math.abs(other.x - foe.x) < ECHO.ring)
              dealDamage(other, progress.stats.ad * power * ring, { fromX: x, kx: face * 60, stun: 0.4, source: ID });
      }
      return done < cuts;
    },
    draw() {},
  };
}

/** call the echo on the foe nearest `x` when the chance and the cooldown allow */
function call(memory: SkillMemory, x: number, chance: number): void {
  const v = skillValues(ID);
  if ((memory.cd as number) > 0 || !rng.chance(chance)) return;
  const foe = nearestFoe(x, hero.y - 16);
  if (!foe) return;
  memory.cd = v.cooldown;
  const side = Math.sign(foe.x - hero.x) || hero.face;
  game.fx.push(createEcho(foe, side, v.cuts, v.power));
  if (skillEvolved(ID)) game.fx.push(createEcho(foe, -side, v.cuts, v.power));
}

/** Echo Swing: a parry (and from its third level a perfect dodge, from its sixth some heavy swings) calls a crimson
 *  echo of her on the far side of the foe that brings down a heavy cleave on it */
export const echoSwing: SkillBehavior = {
  create: () => ({ cd: 0 }),
  update(memory, _state, dt) {
    memory.cd = Math.max(0, (memory.cd as number) - dt);
  },
  on: {
    parry(memory, e) {
      call(memory, e.fromX, skillValues(ID).chance);
    },
    perfectDodge(memory, e) {
      if (skillValues(ID).both) call(memory, e.at, skillValues(ID).chance);
    },
    blow(memory, e) {
      const v = skillValues(ID);
      if (v.heavy && e.keen && e.melee) call(memory, e.foe.x, v.heavy);
    },
  },
};
