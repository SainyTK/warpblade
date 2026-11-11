import { GROUND, PLATFORMS } from "../../../constants/stage";
import { fleck, px } from "../../../engine/frame";
import { RAIN_COLORS as RC } from "./palette";

/** Water running off the ends of the slabs in thin broken streams that splash on the floor. */

/** which slab ends shed a stream: the slab's index, its end (-1 left, 1 right) and the stream's own phase */
const STREAMS = [
  [0, 1, 0],
  [1, -1, 3.1],
  [2, -1, 5.4],
  [2, 1, 1.7],
] as const;
/** a stream falls at this many art pixels a second */
const FALL = 70;
/** the stream's drops: their length, the gap between them where the stream first breaks, and how fast the gaps grow as it falls */
const DROPS = { length: 4, gap: 4, spread: 0.3 };
/** art pixels of unbroken water under the slab */
const SOLID = 4;
const SLAB_DEPTH = 9;
const STEP = 0.5;

/** the streams, heavier as the storm builds: unbroken water under the slab, breaking into drops that spread apart as they fall */
export function drawRunoff(t: number, k: number): void {
  for (const [slab, end, phase] of STREAMS) {
    const p = PLATFORMS[slab];
    const x = end < 0 ? p.x0 + 1.25 : p.x1 - 0.25;
    const top = p.y + SLAB_DEPTH;
    const length = DROPS.length * (0.6 + 0.4 * k);
    for (let y = top; y < GROUND; y += STEP) {
      const fallen = y - top;
      const period = length + DROPS.gap + fallen * DROPS.spread;
      const along = (((y - t * FALL + phase * 7) % period) + period) % period;
      if (fallen > SOLID && along > length) continue;
      const sway = Math.sin(y * 0.35 + t * 5 + phase) > 0.6 ? 0.5 : 0;
      fleck(x + sway, y, along < 1 ? RC.splash : RC.drop, 0.9 - (fallen / (GROUND - top)) * 0.4);
    }
    // where it lands: two beads thrown up in turn and a bright foot
    const beat = (t * 6 + phase) % 1;
    px(x - 0.5, GROUND - 1, RC.splash, 0.9);
    fleck(x - 1.5 - beat * 3, GROUND - 1 - Math.sin(beat * Math.PI) * 3, RC.splash);
    fleck(x + 1.5 + beat * 3, GROUND - 0.5 - Math.sin(beat * Math.PI) * 2, RC.drop);
  }
}
