import { ENEMIES } from "../../constants/enemies";
import { TITAN } from "../../constants/hulda/ultimates";
import { W } from "../../constants/stage";
import { ULT_LEVELS } from "../../constants/ultimate";
import { glow, line, place } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { clamp } from "../../utils/math";
import { dealDamage } from "../damage";
import { createFloorRing } from "../effects/floorRing";
import { createImpact } from "../effects/impact";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { claim, isClaimed, unclaim } from "../hero/hulda/claims";
import { skin } from "../hero/skin";
import { game, hero, lights, progress } from "../state";
import { boxHit, dust, hitStop, shake } from "../world";
import { ultTargets } from "./targets";

interface Pulled {
  e: Enemy;
  /** where it was when the tether caught it */
  x0: number;
  y0: number;
  /** its place in the heap, around the heap's centre */
  ox: number;
  oy: number;
}

/** hold a foe at a point, frozen so its own update leaves it there */
function hold(e: Enemy, x: number, y: number): void {
  e.x = clamp(x, 10, W - 10);
  e.y = y;
  e.vx = 0;
  e.vy = 0;
  e.air = false;
  e.stun = Math.max(e.stun, 0.1);
  claim(e);
}

/**
 * Titan Throw, Hulda's ultimate: crimson tethers yank every minion in reach into a heap in her arms, she spins once and
 * hurls the heap ahead as one body. It strikes every foe in its path, and where it lands it bursts, each foe in the heap
 * taking the level's full power. Bigger foes are never pulled; they take the burst when it reaches them.
 */
export function castTitanThrow(level: number): void {
  const power = ULT_LEVELS[level - 1].power * progress.stats.ad;
  const face = hero.face;
  const ramp: Ramp = skin.ramp;
  const pulled: Pulled[] = ultTargets(level)
    .filter((e) => ENEMIES[e.type].launchable && !isClaimed(e))
    .map((e, i) => ({ e, x0: e.x, y0: e.y, ox: ((i % 3) - 1) * 4, oy: -Math.floor(i / 3) * 5 }));
  const struck = new Set<Enemy>(pulled.map((p) => p.e));
  const heapAt = (): [number, number] => [hero.x + face * TITAN.heap.x, hero.y + TITAN.heap.y];
  let t = 0;
  let flying = false;
  let hx = 0;
  let hy = 0;
  let vx = 0;
  let vy = 0;
  const alive = () => pulled.filter((p) => p.e.hp > 0);
  const burst = () => {
    const floor = hero.y;
    for (const p of alive()) {
      unclaim(p.e);
      p.e.y = p.e.y > floor ? floor : p.e.y;
      dealDamage(p.e, power, { fromX: hx - face * 10, kx: face * 80, launch: -200, heavy: true, source: "ultimate" });
    }
    for (const e of game.enemies) {
      if (struck.has(e) || e.hp <= 0) continue;
      if (Math.abs(enemyCenter(e)[0] - hx) > TITAN.burst) continue;
      dealDamage(e, power, { fromX: hx, kx: Math.sign(e.x - hx) * 120, heavy: true, source: "ultimate" });
      if (!ENEMIES[e.type].launchable) e.stun = Math.max(e.stun, 0.6);
    }
    game.fx.push(createFloorRing(hx, floor, TITAN.burst * 1.4, ramp, 0.5));
    game.fx.push(createImpact(hx, floor - 10, face, true));
    lights.add(hx, floor - 10, 70, ramp[4], 1, 0.4);
    dust(hx, floor, 14);
    hitStop(0.1);
    shake(0.4, 4);
    sfx.boom();
  };
  const effect: Effect = {
    update(dt) {
      t += dt;
      const heap = alive();
      if (!flying && t < TITAN.pull) {
        const u = t / TITAN.pull;
        const [cx, cy] = heapAt();
        for (const p of heap) hold(p.e, p.x0 + (cx + p.ox - p.x0) * u, p.y0 + (cy + p.oy - p.y0) * u);
        return true;
      }
      if (!flying && t < TITAN.pull + TITAN.spin) {
        const a = ((t - TITAN.pull) / TITAN.spin) * Math.PI * 2;
        const [, cy] = heapAt();
        for (const p of heap) hold(p.e, hero.x + Math.cos(a) * face * TITAN.heap.x + p.ox, cy + p.oy);
        return true;
      }
      if (!flying) {
        flying = true;
        [hx, hy] = heapAt();
        vx = face * TITAN.speed;
        vy = TITAN.lift;
        sfx.swing(0.5);
        if (!heap.length) return false;
      }
      vy += 900 * dt;
      hx += vx * dt;
      hy += vy * dt;
      for (const p of heap) hold(p.e, hx + p.ox, hy + p.oy);
      const zone = [hx - 10, hy - 14, hx + 10, hy + 6] as const;
      for (const e of game.enemies) {
        if (struck.has(e) || e.hp <= 0 || !boxHit([...zone], enemyBox(e))) continue;
        struck.add(e);
        dealDamage(e, power * TITAN.pathShare, {
          fromX: hx - face * 10,
          kx: face * 160,
          stun: 0.6,
          heavy: true,
          source: "ultimate",
        });
        game.fx.push(createImpact(enemyCenter(e)[0], enemyCenter(e)[1], face, true));
        sfx.hit(true, 0.8);
      }
      if (hy < hero.y && hx > 8 && hx < W - 8) return true;
      burst();
      return false;
    },
    draw() {
      place();
      const heap = alive();
      if (!flying && t < TITAN.pull) {
        // a tether from her hands to each foe it drags in
        const [hx0, hy0] = [hero.x + face * 6, hero.y - 20];
        for (const p of heap) {
          const [ex, ey] = enemyCenter(p.e);
          line(hx0, hy0, ex, ey, (u) => (u < 0.5 ? ramp[4] : ramp[5]), 0.9);
          glow(ex, ey, 6, ramp[4], 0.3);
        }
        return;
      }
      if (flying) glow(hx, hy - 4, 16, ramp[3], 0.35);
    },
  };
  game.fx.push(effect);
  lights.add(hero.x, hero.y - 20, 60, ramp[4], 0.8, 0.4);
}
