import { PAL } from "../../../constants/palette";
import { glowLine, hairline, place } from "../../../engine/frame";
import { PK } from "../../../types/particle";
import { game, lights, particles, rng } from "../../state";
import { drawWickGhost } from "./drawWick";

/** seconds the thread of flame between the two spots shows, and the violet copy of a Wick where it stood */
const THREAD = 0.1;
const GHOST = 0.12;

/** a Wick leaves her a violet copy of itself where it stood, fading out, and a puff of smoke */
export function wickLeaves(x: number, y: number): void {
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      return t < GHOST;
    },
    draw() {
      drawWickGhost(x, y, 0.7 * (1 - t / GHOST));
    },
  });
  puff(x, y);
}

/** a puff of violet smoke where she or a Wick vanished */
function puff(x: number, y: number): void {
  for (let i = 0; i < 10; i++)
    particles.spawn(PK.SMOKE, x + rng.range(-4, 4), y - rng.range(4, 20), rng.range(-20, 20), -rng.range(5, 25), 0.5, {
      col: rng.chance(0.5) ? PAL.wick[2] : PAL.wick[3],
      size: rng.range(2, 4),
    });
  for (let i = 0; i < 6; i++)
    particles.spawn(PK.SPARK, x, y - 12, rng.range(-70, 70), -rng.range(20, 80), 0.3, { col: PAL.wick[4] });
  lights.add(x, y - 12, 30, PAL.wick[4], 0.7, 0.25);
}

/** a thread of flame joins where she stood and where she arrived for three frames */
export function thread(x0: number, y0: number, x1: number, y1: number): void {
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      return t < THREAD;
    },
    draw() {
      place();
      const k = 1 - t / THREAD;
      hairline(x0, y0 - 12, x1, y1 - 12, PAL.wick[5], k);
      hairline(x0, y0 - 11.5, x1, y1 - 11.5, PAL.wick[4], k);
      hairline(x0, y0 - 11, x1, y1 - 11, PAL.wick[2], k * 0.6);
      glowLine(x0, y0 - 12, x1, y1 - 12, 4, PAL.wick[3], 0.25 * k);
    },
  });
}

/** a ring of violet sparks and light round a Wick that arrives in a flare */
export function flareSparks(x: number, y: number): void {
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    particles.spawn(PK.SPARK, x, y - 8, Math.cos(a) * 90, Math.sin(a) * 60 - 20, 0.3, { col: PAL.wick[4] });
  }
  lights.add(x, y - 8, 36, PAL.wick[4], 0.9, 0.25);
}
