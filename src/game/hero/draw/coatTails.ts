import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Pose } from "../../../types/pose";
import { alongSpine } from "../../../utils/poseFrame";

/** the coat below the belt, hanging down the line of the spine and flaring back with speed */
export function drawCoatTails(s: SpriteCanvas, p: Pose, flare: number): void {
  const hip: [number, number] = [p.hx, p.hy];
  const at = (dx: number, dy: number) => alongSpine(p, hip, dx, dy);
  const fl = flare;
  s.begin();
  s.poly([at(-3.5, -2), at(3, -2), at(3.5 + fl * 0.2, 7), at(-4.5 - fl, 8.5 - fl * 0.4)], HC.coatDark);
  const [a, b] = [at(-2.5, -1), at(-3.5 - fl * 0.8, 6.5 - fl * 0.4)];
  s.stroke(a[0], a[1], b[0], b[1], 0.5, HC.coat);
  const [c, d] = [at(3.5 + fl * 0.2, 7.4), at(-4.5 - fl, 8.9 - fl * 0.4)];
  s.stroke(c[0], c[1], d[0], d[1], 0.55, HC.trim);
  s.commit();
}
