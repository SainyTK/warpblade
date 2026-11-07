import { ENEMY_AIR } from "../../../../constants/combat";
import { ENEMIES } from "../../../../constants/enemies";
import { GROUND } from "../../../../constants/stage";
import { GLAIVE_FEEL } from "../../../../constants/ysra/glaive";
import { glow, line, place } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { dealDamage } from "../../../damage";
import { createFloorRing } from "../../../effects/floorRing";
import { createImpact } from "../../../effects/impact";
import { enemyCenter } from "../../../enemies/enemy";
import { kindOf } from "../../../enemies/kinds";
import { meleeHit } from "../../../meleeHit";
import { skillEvolved, skillValues } from "../../../skills/query";
import { game, hero, progress, rng } from "../../../state";
import { boxAhead, dust, shake, struckThisSwing } from "../../../world";
import { lift } from "../../lift";
import { skin } from "../../skin";
import { pinFoe } from "../pin";

/** the hooked foe's slam hits foes this close to where it lands */
const SLAM_REACH = 20;
/** a hooked foe is dragged down this much faster than a spike */
const DRAG = 1.3;
/** Heaven's Hook heaps the flyers this far ahead of her feet */
const HEAP_AHEAD = 16;

const hook = () => skillValues("y_skyhook");

/** foes on their way down on the hook, so each is dragged once */
const dragging = new WeakSet<Enemy>();

/** the hooked foe hits the floor: the slam on it and the foes on the floor it lands on (not the other flyers of a heap,
 *  which take their own), then it stays grounded */
function slam(e: Enemy, power: number): void {
  const v = hook();
  if (power > 0) {
    const [cx, cy] = enemyCenter(e);
    for (const o of game.enemies) {
      if (o.hp <= 0 || (o !== e && (kindOf(o.type).flies || Math.abs(o.x - e.x) > SLAM_REACH))) continue;
      dealDamage(o, progress.stats.ad * power, { fromX: hero.x, kx: Math.sign(o.x - e.x) * 60, heavy: true });
    }
    game.fx.push(createImpact(cx, cy, hero.face, true));
    game.fx.push(createFloorRing(e.x, GROUND, SLAM_REACH, skin.ramp, 0.3));
    shake(0.18, 2.4);
  }
  dust(e.x, GROUND, 8);
  if (v.ground) pinFoe(e, { time: v.ground, taken: 0, burn: 0 });
}

/** waits for a dragged foe to hit the floor, then slams it */
function createDrag(e: Enemy, power: number): Effect {
  let fell = false;
  let t = 0;
  return {
    update(dt) {
      t += dt;
      if (e.hp <= 0) return false;
      if (e.vy > 0) fell = true;
      if ((fell && e.vy <= 0) || !e.air || t > 1) {
        dragging.delete(e);
        slam(e, power);
        return false;
      }
      return true;
    },
    /** the burning hook line from the glaive down to the foe it drags */
    draw() {
      const [cx, cy] = enemyCenter(e);
      place();
      line(hero.x + hero.face * 10, hero.y - 30, cx, cy, (u) => skin.ramp[u < 0.5 ? 4 : 5]);
      glow(cx, cy, 6, skin.ramp[4], 0.4);
    },
  };
}

/** drag a foe out of the air toward the floor, stunned; one that cannot be thrown is only stunned */
function drag(e: Enemy, power: number): void {
  if (dragging.has(e)) return;
  e.stun = Math.max(e.stun, hook().stun ?? 0);
  if (!ENEMIES[e.type].launchable) return;
  dragging.add(e);
  Object.assign(e, { air: true, airTime: 0, vx: 0, vy: ENEMY_AIR.spike * DRAG, state: "recover", st: 0 });
  game.fx.push(createDrag(e, power));
}

/** Heaven's Hook: every flyer within reach is hauled into a heap at her feet and slammed together */
function heap(power: number): void {
  const v = hook();
  for (const e of game.enemies) {
    if (e.hp <= 0 || !kindOf(e.type).flies || Math.abs(e.x - hero.x) > v.heap) continue;
    e.x = hero.x + hero.face * (HEAP_AHEAD + rng.range(-4, 4));
    drag(e, power);
  }
  hero.warpCd = 0;
}

/** the Skyhook landed: the cone takes every flyer over her, struck foes are dragged down, and she rises with the hook */
export function hookStruck(): void {
  const v = hook();
  if (v.cone) {
    const top = Math.max(56, v.reach ?? 0) + 10;
    meleeHit([boxAhead(-30, -top, 50, -20)], { power: v.power, kx: 0, ky: 0, big: true, feel: GLAIVE_FEEL.sweep });
  }
  const slamPower = skillEvolved("y_skyhook") ? v.heapPower : v.slam;
  for (const e of game.enemies)
    if (e.hp > 0 && struckThisSwing(e) && (e.air || kindOf(e.type).flies)) drag(e, slamPower);
  if (skillEvolved("y_skyhook")) heap(slamPower);
  if (v.rise) lift(v.rise, false);
}
