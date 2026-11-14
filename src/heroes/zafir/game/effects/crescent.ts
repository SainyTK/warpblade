import { fleck, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { drawThrownBlade } from "../../../../game/effects/thrownWeapon";
import { touches } from "../../../../game/skills/targets";
import { game, hero, progress } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { TAU } from "../../../../utils/math";
import { CRESCENT, CRESCENT_ORBIT } from "../../constants/abilities";
import { GRAIN } from "../../constants/palette";
import { openWounds } from "../wounds";

/** how fast the thrown scimitar turns, in radians a second */
const SPIN = 22;

/** the scimitar in flight: it ends when it is back in his hand, or at once when he calls it */
export interface CrescentFlight extends Effect {
  recall(): void;
}

/** where the blade is at share `u` of its flight: out along a rising curve ahead of him, back along a lower one */
function pathPoint(u: number, face: number): [number, number] {
  const s = Math.sin(Math.PI * u);
  const x = hero.x + face * CRESCENT.out * s;
  const y = hero.y - 18 - CRESCENT.rise * s * (u < 0.5 ? 1 : 0.45);
  return [x, y];
}

/** where the blade is on its orbit round him at share `u` */
function orbitPoint(u: number, face: number): [number, number] {
  const a = face * u * CRESCENT_ORBIT.turns * TAU;
  return [hero.x + Math.cos(a) * CRESCENT_ORBIT.radius, hero.y - 16 + Math.sin(a) * CRESCENT_ORBIT.radius * 0.45];
}

/**
 * The crescent throw: the scimitar flies out on a curve ahead and back to Zafir's hand, cutting each foe once on the way
 * out and once on the way back; wide, it circles him twice, cutting every foe it passes on each turn. `done` runs when
 * it is back, whether it came on its own or was called.
 */
export function createCrescent(face: number, wide: boolean, power: number, done: () => void): CrescentFlight {
  let t = 0;
  let over = false;
  const time = wide ? CRESCENT_ORBIT.time : CRESCENT.time;
  const out = new Set<Enemy>();
  const back = new Set<Enemy>();
  const next = new Map<Enemy, number>();
  const trail: [number, number][] = [];
  const at = (): [number, number] => (wide ? orbitPoint(t / time, face) : pathPoint(t / time, face));
  const strike = (e: Enemy, x: number) => {
    dealDamage(e, progress.stats.ad * power, {
      fromX: x - face * 4,
      kx: Math.sign(e.x - x) * 30,
      melee: true,
      source: "abilities",
    });
    openWounds(e, 1);
  };
  const cut = (x: number, y: number) => {
    for (const e of game.enemies) {
      if (e.hp <= 0 || !touches(e, x, y, CRESCENT.hitReach)) continue;
      if (wide) {
        if ((next.get(e) ?? 0) > t) continue;
        next.set(e, t + CRESCENT_ORBIT.every);
      } else {
        const struck = t < time / 2 ? out : back;
        if (struck.has(e)) continue;
        struck.add(e);
      }
      strike(e, x);
    }
  };
  const finish = () => {
    if (over) return;
    over = true;
    done();
  };
  return {
    recall: finish,
    update(dt) {
      if (over) return false;
      t += dt;
      const [x, y] = at();
      trail.unshift([x, y]);
      trail.length = Math.min(trail.length, 6);
      cut(x, y);
      if (t >= time) finish();
      return !over;
    },
    draw() {
      if (over) return;
      place();
      for (const [i, [x, y]] of trail.entries())
        fleck(x, y, GRAIN[Math.min(GRAIN.length - 1, i)], 1 - i / trail.length);
      const [x, y] = at();
      const angle = t * SPIN * face;
      const reach = 9;
      drawThrownBlade(x + Math.cos(angle) * reach, y + Math.sin(angle) * reach, angle);
    },
  };
}
