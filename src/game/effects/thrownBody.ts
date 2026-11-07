import { THROWN } from "../../constants/hulda/grab";
import { glow, line, place } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { dealDamage } from "../damage";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { hasPerk } from "../progress";
import { game, lights, progress } from "../state";
import { boxHit, dust, hitStop, shake } from "../world";
import { createFloorRing } from "./floorRing";
import { createImpact } from "./impact";

/** how many past centres the streak behind the body keeps */
const TRAIL = 6;

/**
 * A foe Hulda threw: while it flies it strikes every other foe it touches once, and when it lands it takes a last blow
 * and lies stunned. Wrecking Throw bursts it on landing. The foe draws itself; this draws the streak behind it.
 */
export function createThrownBody(body: Enemy, dir: number, ramp: Ramp): Effect {
  const struck = new Set<Enemy>([body]);
  const trail: [number, number][] = [];
  let t = 0;
  let done = false;
  const land = () => {
    done = true;
    if (body.hp <= 0) return;
    const [cx, cy] = enemyCenter(body);
    dealDamage(body, progress.stats.ad * THROWN.landPower, { fromX: cx - dir * 10, kx: 0, heavy: true });
    body.stun = Math.max(body.stun, THROWN.landStun);
    dust(cx, body.y, 6);
    shake(0.1, 1.5);
    if (!hasPerk("wreckingThrow")) return;
    for (const e of game.enemies) {
      if (e === body || e.hp <= 0) continue;
      const [ex, ey] = enemyCenter(e);
      if (Math.hypot(ex - cx, ey - cy) > THROWN.wreckRing) continue;
      dealDamage(e, progress.stats.ad * THROWN.wreckPower, {
        fromX: cx,
        kx: Math.sign(ex - cx) * 120,
        stun: 0.5,
        heavy: true,
      });
    }
    game.fx.push(createFloorRing(cx, body.y, THROWN.wreckRing, ramp, 0.35));
    game.fx.push(createImpact(cx, cy, dir, true));
    sfx.boom();
  };
  return {
    update(dt) {
      if (done) return false;
      t += dt;
      if (body.hp <= 0) return false;
      const [cx, cy] = enemyCenter(body);
      trail.unshift([cx, cy]);
      if (trail.length > TRAIL) trail.pop();
      const box = enemyBox(body);
      for (const e of game.enemies) {
        if (struck.has(e) || e.hp <= 0 || !boxHit(box, enemyBox(e))) continue;
        struck.add(e);
        const [ex, ey] = enemyCenter(e);
        dealDamage(e, progress.stats.ad * THROWN.power, {
          fromX: cx,
          kx: dir * THROWN.kx,
          stun: THROWN.stun,
          heavy: true,
        });
        game.fx.push(createImpact((cx + ex) / 2, (cy + ey) / 2, dir, true));
        lights.add(ex, ey, 30, ramp[4], 0.8, 0.15);
        hitStop(THROWN.stop);
        sfx.hit(true, 0.7);
      }
      if (!body.air || t >= THROWN.life) land();
      return !done;
    },
    draw() {
      place();
      for (let i = 1; i < trail.length; i++) {
        const [x0, y0] = trail[i - 1];
        const [x1, y1] = trail[i];
        const k = 1 - i / trail.length;
        line(x0, y0, x1, y1, ramp[Math.max(1, Math.round(2 + k * 3))], k * 0.8);
        line(x0, y0 + 3, x1, y1 + 3, ramp[2], k * 0.5);
      }
      if (trail.length) glow(trail[0][0], trail[0][1], 10, ramp[3], 0.25);
    },
  };
}
