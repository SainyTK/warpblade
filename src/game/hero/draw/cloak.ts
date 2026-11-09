import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Vec } from "./reach";

/** a point below the hip, dx across the waist (toward the front) and dy down the spine */
type AtHip = (dx: number, dy: number) => Vec;

/** pixels a cloak hangs below a coat's tails, and the least gap it keeps above the feet */
export const CLOAK_DROP = 3.4;
export const CLOAK_CLEAR = 1.2;

/** where the drips of wax hang along the hem, from the front corner to the back, and how long each runs */
const DRIPS: readonly (readonly [number, number])[] = [
  [0.18, 0.9],
  [0.46, 1.6],
  [0.74, 1.1],
];

/**
 * The cloak's lining turned out along its back edge: a thin strip at rest that widens as the cloak flares back, so the
 * violet shows behind her as she walks and leaps.
 */
export function drawCloakLining(s: SpriteCanvas, at: AtHip, flare: number, hem: number): void {
  const wide = 0.6 + flare * 0.6;
  s.begin();
  s.poly(
    [
      at(-3.5, -1.2),
      at(-4.8 - flare, hem - flare * 0.4),
      at(-4.8 - flare + wide, hem - flare * 0.4 - 0.2),
      at(-2.9, -1),
    ],
    HC.scarf,
  );
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit();
}

/** pale wax dripped along the hem from her candles: short runs hanging off the hem line, lit on top */
export function drawHemDrips(s: SpriteCanvas, front: Vec, back: Vec): void {
  s.begin();
  for (const [u, run] of DRIPS) {
    const x = front[0] + (back[0] - front[0]) * u;
    const y = front[1] + (back[1] - front[1]) * u;
    s.stroke(x, y, x, y + run, 0.3, HC.trim);
    s.dot(x, y + run, 0.4, HC.trim);
  }
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
}
