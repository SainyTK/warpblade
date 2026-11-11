import { CHIPS } from "../../../../constants/hulda/look";
import { fleck, place } from "../../../../engine/frame";
import type { Color } from "../../../../types/color";
import type { Effect } from "../../../../types/effect";
import { grain } from "../../../../utils/grain";

export interface ChipBurst {
  x: number;
  y: number;
  /** the floor the chips come to rest on */
  floor: number;
  /** the way they are thrown, in radians, and how far either side of it */
  angle: number;
  spread: number;
  count: number;
  /** slowest and fastest, in pixels a second */
  speed: readonly [number, number];
  /** lit colors a chip may take; each is drawn over the dark one */
  colors: readonly Color[];
  dark: Color;
  /** keeps one burst's chips apart from the next */
  seed: number;
}

/**
 * Chips knocked loose by a blow: each flies on its own arc, tumbles, comes to rest on the floor and fades. Their paths
 * come from the seed, so drawing them takes nothing from the game's random stream.
 */
export function createChips(b: ChipBurst): Effect {
  const chips = Array.from({ length: b.count }, (_, i) => {
    const a = b.angle + (grain(i, b.seed) * 2 - 1) * b.spread;
    const sp = b.speed[0] + (b.speed[1] - b.speed[0]) * grain(b.seed, i + 7);
    return {
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 40,
      spin: (grain(i + 3, b.seed) * 2 - 1) * 18,
      big: grain(i + 11, b.seed) > 0.45,
      color: b.colors[Math.floor(grain(i + 5, b.seed) * b.colors.length) % b.colors.length],
      life: CHIPS.life * (0.6 + 0.4 * grain(i + 13, b.seed)),
    };
  });
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < CHIPS.life;
    },
    draw() {
      place();
      for (const c of chips) {
        if (t >= c.life) continue;
        const fall = b.floor - 0.5 - b.y;
        // the moment this chip reaches the floor, from its arc
        const lands = (-c.vy + Math.sqrt(Math.max(0, c.vy * c.vy + 2 * CHIPS.gravity * fall))) / CHIPS.gravity;
        const flying = t < lands;
        const at = flying ? t : lands;
        const x = b.x + c.vx * at + (flying ? 0 : c.vx * 0.04 * Math.min(1, (t - lands) * 8));
        const y = flying ? b.y + c.vy * at + 0.5 * CHIPS.gravity * at * at : b.floor - 0.5;
        const left = 1 - t / c.life;
        const a = Math.min(1, left / CHIPS.fade);
        const turn = c.spin * at;
        fleck(x, y + 0.5, b.dark, a);
        fleck(x, y, c.color, a);
        if (c.big) fleck(x + Math.cos(turn) * 0.5, y + Math.sin(turn) * 0.5, c.color, a);
      }
    },
  };
}
