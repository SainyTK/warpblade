import { RITE_RAMP, RITE_SPARKS } from "../../../constants/ysra/emberLook";
import { ASHEN_WAKE as A } from "../../../constants/ysra/rites";
import { glow, place, px } from "../../../engine/frame";
import type { SourceId } from "../../../types/build";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { clamp } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { ignite } from "../../enemies/burn";
import { enemyBox } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { game, particles, progress, rng } from "../../state";
import { boxHit } from "../../world";

/** patches burning now, for the cap */
let burning = 0;

/** which cinder of a strip glows this beat: a cheap stable flicker */
const flicker = (i: number, beat: number): number => Math.abs(Math.sin(i * 12.9898 + beat * 78.233) * 43758.5453) % 1;

/** a patch of burning ground: how long it burns, its tick's ability power multiple, its half width, the most patches
 *  that burn one foe in the same tick, the stagger each tick gives (0 none), and the skill it counts for */
export interface CinderPatch {
  life: number;
  power: number;
  halfWidth: number;
  overlap: number;
  stagger: number;
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
          if (p.stagger && kindOf(e.type).staggers) e.stagger = Math.max(e.stagger, p.stagger);
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
      const k = clamp((p.life - t) / (p.life * 0.4));
      const beat = Math.floor(t * 10);
      for (let dx = -p.halfWidth; dx <= p.halfWidth; dx++) {
        const f = flicker(x + dx, beat);
        px(x + dx, y, RITE_RAMP[f > 0.6 ? 4 : f > 0.25 ? 3 : 2], k);
        if (f > 0.7) px(x + dx, y - 1, RITE_RAMP[f > 0.9 ? 5 : 4], k);
        if (f > 0.9) px(x + dx, y - 2, RITE_RAMP[4], k);
      }
      glow(x, y - 2, 10, RITE_RAMP[4], 0.3 * k);
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
