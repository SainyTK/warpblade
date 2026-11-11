import type { SpriteCanvas } from "../../../engine/sprite";
import { VOID } from "./colors";
import type { Mirrored } from "./unblinkingMirror";
import type { UnblinkingPose } from "./unblinkingPose";
import { type BodyFrame, lidLower } from "./unblinkingShape";

/** the tear gathers under the eye, where the globs leave it (unblinking.ts weeps them from 12 art pixels below) */
const SAC = { y: 12.5, sag: 2, r: 1.4, grow: 3.4, wobble: 0.3, rate: 30 } as const;
/** beads of void running along the lower lid toward the middle: how many, and from how far out they start */
const BEADS = { calm: 3, enraged: 5, from: 15, to: 2.5 } as const;
/** the threads left hanging once the tears fall: where they hang across, and how long they are at first */
const THREADS: readonly (readonly [number, number])[] = [
  [-1.5, 3.5],
  [0.3, 5.5],
  [2, 3],
];

/**
 * Its tears: while the lid swells, beads of void run along the lower lid to a dark streak down the hide and a tear
 * that swells and trembles under the eye; once the globs fall, thin threads hang where it was and shrink away.
 */
export function paintTears(
  m: Mirrored,
  s: SpriteCanvas,
  p: UnblinkingPose,
  f: BodyFrame,
  time: number,
  enraged: boolean,
): void {
  if (p.swell <= 0 && p.drip <= 0) return;
  const y = f.y + SAC.y * f.sy;
  s.begin();
  if (p.swell > 0) {
    const k = p.swell;
    const n = enraged ? BEADS.enraged : BEADS.calm;
    for (let j = 0; j < n; j++) {
      const side = j % 2 ? 1 : -1;
      const x = side * (BEADS.to + (BEADS.from - BEADS.to) * (1 - k) * (1 - j / (n * 1.5)));
      const by = f.y + (lidLower(x, p) + 0.4) * f.sy;
      m.dot(f.x + x * f.sx, by, 0.7, VOID[2]);
      m.set(f.x + x * f.sx, by - 0.25, VOID[4]);
    }
    const top = f.y + (lidLower(0, p) + 1) * f.sy;
    m.taper(f.x, top, f.x, y + SAC.sag * k, 0.35, (SAC.r + SAC.grow * k) * 0.7, VOID[1]);
    m.hairline(f.x + 0.25, top, f.x + 0.25, y, VOID[2]);
    const r = SAC.r + SAC.grow * k + Math.sin(time * SAC.rate) * SAC.wobble * k;
    const cy = y + SAC.sag * k;
    m.dot(f.x, cy, r, VOID[1]);
    m.dot(f.x - 0.2, cy + 0.2, r - 0.6, VOID[2]);
    m.dot(f.x + r * 0.25, cy - r * 0.25, r * 0.5, VOID[3]);
    m.set(f.x + r * 0.45, cy - r * 0.5, VOID[5]);
  }
  if (p.drip > 0)
    for (const [x, long] of THREADS) {
      const end = y + long * p.drip;
      m.hairline(f.x + x, y, f.x + x, end, VOID[2]);
      m.dot(f.x + x, end, 0.55, VOID[3]);
    }
  s.commit(false);
}
