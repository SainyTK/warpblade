import { disc, fleck, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { touches } from "../../../../game/skills/targets";
import { game } from "../../../../game/state";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import { ROSE_RAMP } from "../../look/rose";

/** seconds between the ticks of lingering petals */
const EVERY = 0.4;
/** petals drawn in the ring */
const COUNT = 14;

/**
 * Rose petals with edges that hang in a ring of `reach` round (x, y) for `life` seconds, turning slowly, and cut every
 * foe inside for `damage` each tick (Rose Bloom's linger). The petals' positions come from the time, so drawing reads
 * nothing random.
 */
export function createPetalRing(
  x: number,
  y: number,
  reach: number,
  life: number,
  damage: number,
  source: SourceId,
): Effect {
  const o = { t: 0, next: EVERY };
  return {
    update(dt) {
      o.t += dt;
      o.next -= dt;
      if (o.next <= 0) {
        o.next = EVERY;
        for (const e of game.enemies)
          if (e.hp > 0 && touches(e, x, y, reach)) dealDamage(e, damage, { fromX: x, kx: 0, source, dot: true });
      }
      return o.t < life;
    },
    draw() {
      place();
      const k = Math.min(1, (life - o.t) * 3);
      for (let i = 0; i < COUNT; i++) {
        const a = (i / COUNT) * Math.PI * 2 + o.t * (i % 2 ? 1.4 : -1.1);
        const r = reach * (0.45 + (0.5 * ((i * 7) % 5)) / 4);
        const px = x + Math.cos(a) * r;
        const py = y + Math.sin(a) * r * 0.35;
        disc(px, py, 1.1, ROSE_RAMP[3 + (i % 2)], 0.8 * k);
        fleck(px + 0.5, py - 0.5, ROSE_RAMP[6], k);
      }
    },
  };
}
