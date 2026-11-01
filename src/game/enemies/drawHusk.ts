import { ENEMY_COLORS as EC } from "../../constants/palette";
import { SpriteCanvas } from "../../engine/sprite";
import type { Enemy } from "../../types/enemy";
import { WHITE } from "../../utils/color";

const canvas = new SpriteCanvas(48, 48, 24, 42);

/** a hunched horned walker with glowing cracks and one long clawed arm */
export function drawHusk(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const step = e.state === "walk" ? Math.floor((t + e.seed) * 6) % 2 : 0;
  const hand = e.state === "wind" ? [-3, -27] : e.state === "swipe" ? [14, -7] : [8, -6 - step];
  s.clear();
  s.begin();
  s.stroke(-3, -8, -4 - step, 0, 1.6, EC.bodyDark);
  s.stroke(-1, -14, -6, -11, 1.4, EC.bodyDark);
  s.commit();
  s.begin();
  s.stroke(2, -8, 3 + step, 0, 1.7, EC.body);
  s.dot(-1, -13, 6.5, EC.body);
  s.dot(-2.5, -15.5, 4, EC.bodyLight);
  s.dot(5, -18, 3.6, EC.body);
  s.stroke(4, -21, 1, -26, 0.8, EC.claw);
  s.stroke(1, -26, -2, -27, 0.6, EC.claw);
  s.stroke(6, -21, 8, -26, 0.7, EC.claw);
  s.set(7, -19, e.state === "wind" ? WHITE : EC.eye);
  for (const [x, y] of [
    [-4, -11],
    [-3, -10],
    [-1, -14],
    [1, -9],
  ])
    s.set(x, y, EC.crack);
  s.commit();
  s.begin();
  s.stroke(3, -14, hand[0], hand[1], 1.3, EC.body);
  for (let k = -1; k <= 1; k++) s.stroke(hand[0], hand[1], hand[0] + 3, hand[1] + k * 1.5 + 1, 0.5, EC.claw);
  s.commit();
  s.outline(EC.outline);
  return s;
}
