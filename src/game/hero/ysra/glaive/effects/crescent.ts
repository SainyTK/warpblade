import { fleck, glow, place, px } from "../../../../../engine/frame";
import type { Effect } from "../../../../../types/effect";
import type { Enemy } from "../../../../../types/enemy";
import { PK } from "../../../../../types/particle";
import { WHITE } from "../../../../../utils/color";
import { dealDamage } from "../../../../damage";
import { enemyBox } from "../../../../enemies/enemy";
import { game, lights, particles, rng } from "../../../../state";
import { boxHit } from "../../../../world";
import { skin } from "../../../skin";

/** Sunscythe's crescent: pixels a second it runs, how far, its height and how far ahead of her it starts */
const CRESCENT = { speed: 230, range: 130, tall: 24, bow: 7, width: 5, from: 10, fade: 0.12 } as const;

/**
 * Sunscythe: a crescent of fire stood on the floor, horns forward, running on ahead from where the reap was thrown and
 * striking every foe it passes once.
 */
export function createCrescent(x: number, floor: number, dir: number, damage: number, source: string): Effect {
  const struck = new Set<Enemy>();
  const life = CRESCENT.range / CRESCENT.speed;
  let t = 0;
  const front = () => x + dir * (CRESCENT.from + CRESCENT.speed * t);
  return {
    update(dt) {
      t += dt;
      const fx = front();
      for (const e of game.enemies) {
        if (e.hp <= 0 || struck.has(e) || !boxHit([fx - 6, floor - CRESCENT.tall, fx + 6, floor + 1], enemyBox(e)))
          continue;
        struck.add(e);
        dealDamage(e, damage, { fromX: fx - dir * 8, kx: dir * 70, ky: -30, heavy: true, source });
      }
      if (rng.chance(0.6))
        particles.spawn(PK.EMBER, fx - dir * rng.range(2, 8), floor - rng.range(1, CRESCENT.tall), -dir * 20, -30, 0.5);
      lights.add(fx, floor - 12, 24, skin.ramp[4], 0.5, 0.03);
      return t < life;
    },
    draw() {
      place();
      const R = skin.ramp;
      const fx = Math.round(front());
      const fade = Math.min(1, (life - t) / CRESCENT.fade);
      // the crescent: an arc bowed forward, thickest at its middle, its horns trailing back toward her
      for (let k = 0; k <= CRESCENT.tall; k++) {
        const u = k / CRESCENT.tall;
        const bow = Math.sin(Math.PI * u);
        const lead = fx + dir * Math.round(bow * CRESCENT.bow);
        const width = Math.max(1, Math.round(bow * CRESCENT.width));
        const y = floor - k;
        for (let w = 0; w < width; w++) px(lead - dir * w, y, R[w === 0 ? 5 : w < 3 ? 4 : 3], fade);
        px(lead - dir * width, y, R[2], fade * 0.7);
        fleck(lead + dir * 0.5, y, u > 0.25 && u < 0.75 ? WHITE : R[6], fade);
      }
      glow(fx + dir * 4, floor - 12, 12, R[4], 0.5 * fade);
    },
  };
}
