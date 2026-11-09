import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { TAU } from "../../../utils/math";
import { skin } from "../skin";

/** a point d along the staff from the hand and w across it */
type Along = (d: number, w: number) => [number, number];

/** pixels of shaft behind the hand, and the clock ring's radius at the top */
const BUTT = 12;
const RING = 3.4;

/**
 * Mirel's staff: dark wood from a sand-gold butt cap through the hand to a collar, topped by a clock ring of teal glass
 * with one dark hand inside and a glint on its rim. `reach` is the shaft ahead of the hand; the ring sits past it.
 */
export function drawStaff(s: SpriteCanvas, at: Along, angle: number): void {
  const L = skin.reach;
  s.begin();
  const [b0, b1] = [at(-BUTT, 0), at(L, 0)];
  s.stroke(b0[0], b0[1], b1[0], b1[1], 0.5, HC.hilt);
  s.shadeEdges(HC.hilt, HC.glove, HC.outline);
  s.commit();
  s.begin();
  const cap = at(-BUTT - 0.4, 0);
  s.dot(cap[0], cap[1], 0.6, HC.trim);
  const collar = at(L - 0.4, 0);
  s.dot(collar[0], collar[1], 0.65, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
  const [cx, cy] = at(L + RING, 0);
  s.begin();
  const steps = 18;
  for (let i = 0; i < steps; i++) {
    const a0 = (i / steps) * TAU;
    const a1 = ((i + 1) / steps) * TAU;
    s.stroke(
      cx + Math.cos(a0) * RING,
      cy + Math.sin(a0) * RING,
      cx + Math.cos(a1) * RING,
      cy + Math.sin(a1) * RING,
      0.45,
      HC.blade,
    );
  }
  s.shadeEdges(HC.blade, HC.bladeEdge, HC.bladeDeep, 2);
  s.commit();
  s.begin();
  // the hand inside points along the staff, so it swings round as she does
  s.stroke(cx, cy, cx + Math.cos(angle - 1.2) * 2.2, cy + Math.sin(angle - 1.2) * 2.2, 0.28, HC.hilt);
  s.set(cx, cy, HC.bladeEdge);
  const glint = [cx - RING * 0.6, cy - RING * 0.7];
  s.set(glint[0], glint[1], HC.bladeEdge);
  s.commit(false);
}
