import { RITE_RAMP, RITE_SPARKS } from "../../../constants/ysra/emberLook";
import { ASHEN_WAKE as A } from "../../../constants/ysra/rites";
import { place } from "../../../engine/frame";
import type { SourceId } from "../../../types/build";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { ignite } from "../../enemies/burn";
import { enemyBox } from "../../enemies/enemy";
import { game, particles, progress, rng } from "../../state";
import { boxHit } from "../../world";
import { drawFireBed, type FireColors } from "../fireBed";

/** patches burning now, for the cap */
let burning = 0;

/** a cinder patch's colors, in her ember ramp */
const CINDER_FIRE: FireColors = {
  hot: RITE_RAMP[6],
  bright: RITE_RAMP[5],
  body: RITE_RAMP[4],
  edge: RITE_RAMP[3],
  deep: RITE_RAMP[2],
};

/** a patch of burning ground: how long it burns, its tick's ability power multiple, its half width, the most patches
 *  that burn one foe in the same tick, how long each tick holds a foe's feet (0 none), and the skill it counts for */
export interface CinderPatch {
  life: number;
  power: number;
  halfWidth: number;
  overlap: number;
  halt: number;
  source: SourceId;
}

/** patches that have burned each foe in its current tick window: when the window opened and how many */
const burnedBy = new WeakMap<Enemy, { at: number; n: number }>();

/** a patch may burn this foe now: fewer than `overlap` patches have burned it in this tick window */
function mayBurn(e: Enemy, overlap: number): boolean {
  const seen = burnedBy.get(e);
  if (!seen || game.t - seen.at >= A.tick * 0.9) {
    burnedBy.set(e, { at: game.t, n: 1 });
    return true;
  }
  if (seen.n >= overlap) return false;
  seen.n++;
  return true;
}

function createCinder(x: number, y: number, p: CinderPatch): Effect {
  let t = 0;
  let tick = 0;
  return {
    update(dt) {
      t += dt;
      tick -= dt;
      if (tick <= 0) {
        tick = A.tick;
        for (const e of game.enemies) {
          if (e.hp <= 0 || !boxHit(enemyBox(e), [x - p.halfWidth, y - 12, x + p.halfWidth, y])) continue;
          if (!mayBurn(e, p.overlap)) continue;
          dealDamage(e, progress.stats.ap * p.power, { dot: true, source: p.source });
          ignite(e, A.burn);
          if (p.halt) e.halt = Math.max(e.halt, p.halt);
        }
      }
      if (rng.chance(0.08))
        particles.spawn(PK.EMBER, x + rng.range(-p.halfWidth, p.halfWidth), y - 1, 0, -rng.range(15, 35), 0.6, {
          sparks: RITE_SPARKS,
        });
      const done = t >= p.life;
      if (done) burning--;
      return !done;
    },
    drawBack() {
      place();
      drawFireBed(x, y, p.halfWidth, t, clamp((p.life - t) / (p.life * 0.4)), CINDER_FIRE);
    },
    draw() {},
  };
}

/** a patch of burning ground, unless the cap is reached */
export function layCinder(x: number, y: number, patch: CinderPatch): void {
  if (burning >= A.cap) return;
  burning++;
  game.fx.push(createCinder(Math.round(x), Math.round(y), patch));
}

/** a fresh run: the effects were cleared with the rest of the field */
export function clearCinders(): void {
  burning = 0;
}
