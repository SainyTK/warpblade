import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Pose } from "../../../types/pose";
import { alongSpine } from "../../../utils/poseFrame";
import type { Vec } from "./reach";

/**
 * The torso along the spine, lit from the top left. From the front: open coat with a brass edge, dark shirt and belt.
 * From the back: the coat's seam down the middle and the belt across.
 */
export function drawTorso(s: SpriteCanvas, p: Pose, back: boolean): void {
  const neck: Vec = [p.nx, p.ny];
  const hip: Vec = [p.hx, p.hy];
  const line = (base: Vec, dx0: number, dy0: number, end: Vec, dx1: number, dy1: number, r: number, c: number) => {
    const a = alongSpine(p, base, dx0, dy0);
    const b = alongSpine(p, end, dx1, dy1);
    s.stroke(a[0], a[1], b[0], b[1], r, c);
  };
  s.begin();
  s.poly(
    [
      alongSpine(p, neck, -3.5, 0),
      alongSpine(p, neck, 3, 0),
      alongSpine(p, hip, 3, 0.5),
      alongSpine(p, hip, -3.5, 0.5),
    ],
    HC.coat,
  );
  line(neck, -2.6, 0.8, hip, -2.8, -1.5, 0.5, HC.coatLight);
  if (back) {
    line(neck, -0.2, 1.2, hip, -0.2, -1.5, 0.5, HC.coatDark);
    line(neck, -2, 0.6, neck, 2, 0.6, 0.6, HC.coatDark);
  } else {
    line(neck, -1.5, 0.6, neck, 1, 0.6, 0.5, HC.coatLight);
    line(neck, 1.6, 1.2, hip, 1.9, -1.5, 0.6, HC.shirt);
    line(neck, 0.4, 1, hip, 0.6, -0.5, 0.5, HC.trim);
  }
  line(hip, -3, -1, hip, 2.6, -1, 0.55, HC.glove);
  const buckle = alongSpine(p, hip, back ? -0.5 : 1, -1.5);
  s.set(buckle[0], buckle[1], HC.trim);
  s.commit();
}
