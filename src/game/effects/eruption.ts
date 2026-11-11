import { EMBER } from "../../constants/characters/ysra/look";
import { glow, hairline, place, polygon } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import { PF, PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { clamp, ease } from "../../utils/math";
import { game, lights, particles, rng } from "../state";

/** seconds to shoot up, to roar at full height, and to sink back into the floor */
const SHOOT = 0.1;
const ROAR = 0.22;
const SINK = 0.25;
/** the pillar's light: its flare as it bursts out, the glow round its body and the white at its root */
const PILLAR_LIGHT = { flare: 0.5, body: 0.35, root: 0.18 } as const;

/** a pillar of fire bursting out of the floor at (x, floor), `height` tall and `width` wide, after `delay`;
 *  `erupt` gets the box it fills the moment it bursts out */
export function createEruption(
  x: number,
  floor: number,
  height: number,
  width: number,
  delay: number,
  erupt: (x0: number, y0: number, x1: number, y1: number) => void,
): Effect {
  let t = -delay;
  let burst = false;
  const tall = () => {
    if (t < SHOOT) return height * ease.outBack(clamp(t / SHOOT));
    if (t < SHOOT + ROAR) return height * (1 + Math.sin(t * 50) * 0.04);
    return height * (1 - ease.outCubic(clamp((t - SHOOT - ROAR) / SINK)));
  };
  return {
    update(dt) {
      t += dt;
      if (t < 0) return true;
      if (!burst) {
        burst = true;
        erupt(x - width, floor - height, x + width, floor);
        lights.add(x, floor - height / 2, height, EMBER[4], PILLAR_LIGHT.flare, SHOOT + ROAR);
        for (let i = 0; i < 8; i++) {
          const sp = rng.range(160, 320);
          const a = -Math.PI / 2 + rng.range(-0.5, 0.5);
          particles.spawn(PK.SPARK, x, floor - 2, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.25, 0.5));
        }
        for (let i = 0; i < 3; i++)
          particles.spawn(PK.BRAND, x, floor - height * 0.8, rng.range(-60, 60), -rng.range(80, 160), 2);
      }
      const h = tall();
      if (t < SHOOT + ROAR)
        for (let i = 0; i < 3; i++)
          particles.spawn(
            PK.FIRE,
            x + rng.range(-width, width) * 0.7,
            floor - h * rng.range(0.6, 1),
            rng.range(-12, 12),
            -rng.range(40, 90),
            rng.range(0.2, 0.4),
            {
              col: 0,
              size: rng.range(1.6, 3),
              flag: rng.chance(0.25) ? PF.SMOKES : 0,
            },
          );
      return t < SHOOT + ROAR + SINK;
    },
    draw() {
      if (t < 0) return;
      const h = tall();
      if (h < 1) return;
      place();
      const wob = (k: number) => Math.sin(game.t * 40 + k * 3 + x) * 1.2;
      const column = (w: number, top: number) => {
        const pts: [number, number][] = [];
        for (let k = 0; k <= 4; k++) pts.push([x - w + wob(k) * (k / 4), floor - (h * top * k) / 4]);
        pts.push([x + wob(5) * 0.5, floor - h * top - w * 1.2]);
        for (let k = 4; k >= 0; k--) pts.push([x + w + wob(k + 7) * (k / 4), floor - (h * top * k) / 4]);
        return pts;
      };
      polygon(column(width, 1), EMBER[3]);
      polygon(column(width * 0.6, 0.85), EMBER[4]);
      polygon(column(width * 0.3, 0.6), EMBER[5]);
      // white threads up the heart of the pillar, wavering with it
      for (const side of [-1, 0, 1]) {
        const reach = side ? 0.3 : 0.45;
        hairline(
          x + side * width * 0.18,
          floor - 1,
          x + side * width * 0.1 + wob(side + 2) * 0.5,
          floor - h * reach,
          WHITE,
          (u) => 1 - u * 0.6,
        );
      }
      // tongues torn off the pillar's edges
      for (let k = 1; k <= 3; k++) {
        const up = floor - (h * k) / 4;
        hairline(x - width + wob(k), up, x - width - 1.5 + wob(k + 1), up - 4, EMBER[4]);
        hairline(x + width + wob(k + 7), up, x + width + 1.5 + wob(k + 8), up - 4, EMBER[4]);
      }
      glow(x, floor - h / 2, h * 0.7 + width, EMBER[3], PILLAR_LIGHT.body);
      glow(x, floor - 2, width * 2, WHITE, PILLAR_LIGHT.root);
    },
  };
}
