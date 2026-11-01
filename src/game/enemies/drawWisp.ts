import { ENEMY_COLORS as EC } from "../../constants/palette";
import { SpriteCanvas } from "../../engine/sprite";
import type { Enemy } from "../../types/enemy";
import { WHITE } from "../../utils/color";

const canvas = new SpriteCanvas(36, 36, 18, 18);

/** a floating shadow: round body lit on its upper rim, three trailing tendrils, two eyes that flare before a lunge */
export function drawWisp(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const sway = Math.sin(time * 5) * 1.5;
  s.clear();
  s.begin();
  for (let k = 0; k < 3; k++) {
    const ox = (k - 1) * 2.5;
    s.stroke(ox, 2, ox - 3 + Math.sin(time * 6 + k * 2) * 2, 8 + k * 1.5, 1.6 - k * 0.3, EC.bodyDark);
  }
  s.commit(false);
  s.begin();
  s.dot(0, 0, 5.3, EC.body);
  s.dot(-1.3, -1.5, 3, EC.bodyLight);
  for (let a = -2.6; a < -0.9; a += 0.25) s.set(Math.cos(a) * 4.8, Math.sin(a) * 4.8, EC.rim);
  const eye = e.state === "wind" ? WHITE : EC.eye;
  s.set(1 + sway * 0.2, -1, eye);
  s.set(3 + sway * 0.2, -1, eye);
  s.set(2, 1.5, EC.bodyDark);
  s.commit();
  s.outline(EC.outline);
  return s;
}
