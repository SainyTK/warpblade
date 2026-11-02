import { ENEMY_COLORS as EC } from "../../constants/palette";
import { SpriteCanvas } from "../../engine/sprite";
import type { Enemy } from "../../types/enemy";
import { WHITE } from "../../utils/color";

const huskCanvas = new SpriteCanvas(48, 48, 24, 42);
const bruteCanvas = new SpriteCanvas(80, 76, 40, 70);
const BRUTE_SCALE = 1.6;

/** a hunched horned walker with glowing cracks and one long clawed arm; the brute is the same beast grown huge */
export function drawHusk(e: Enemy, t: number): SpriteCanvas {
  const brute = e.type === "brute";
  const s = brute ? bruteCanvas : huskCanvas;
  const k = brute ? BRUTE_SCALE : 1;
  const step = e.state === "walk" ? Math.floor((t + e.seed) * (brute ? 4 : 6)) % 2 : 0;
  const crouch = e.state === "leap" && e.vy === 0 ? 3 : 0;
  const raised = e.state === "wind" || (e.state === "leap" && e.vy === 0);
  const hand = raised ? [-3, -27] : e.state === "swipe" ? [14, -7] : [8, -6 - step];
  const P = (x: number, y: number): [number, number] => [x * k, y * k + crouch];
  const stroke = (x0: number, y0: number, x1: number, y1: number, r: number, c: number) => {
    const [a, b] = P(x0, y0);
    const [c0, d] = P(x1, y1);
    s.stroke(a, b, c0, d, r * k, c);
  };
  const dot = (x: number, y: number, r: number, c: number) => {
    const [a, b] = P(x, y);
    s.dot(a, b, r * k, c);
  };
  const set = (x: number, y: number, c: number) => {
    const [a, b] = P(x, y);
    s.set(a, b, c);
  };
  s.clear();
  s.begin();
  stroke(-3, -8, -4 - step, 0, 1.6, EC.bodyDark);
  stroke(-1, -14, -6, -11, 1.4, EC.bodyDark);
  s.commit();
  s.begin();
  stroke(2, -8, 3 + step, 0, 1.7, EC.body);
  dot(-1, -13, 6.5, EC.body);
  dot(-2.5, -15.5, 4, EC.bodyLight);
  dot(5, -18, 3.6, EC.body);
  stroke(4, -21, 1, -26, 0.8, EC.claw);
  stroke(1, -26, -2, -27, 0.6, EC.claw);
  stroke(6, -21, 8, -26, 0.7, EC.claw);
  if (brute) {
    stroke(-4, -18, -8, -23, 0.7, EC.claw);
    stroke(-1, -19, -3, -25, 0.7, EC.claw);
  }
  set(7, -19, raised ? WHITE : EC.eye);
  for (const [x, y] of [
    [-4, -11],
    [-3, -10],
    [-1, -14],
    [1, -9],
    ...(brute
      ? [
          [-5, -14],
          [0, -11],
          [2, -15],
        ]
      : []),
  ])
    set(x, y, EC.crack);
  s.commit();
  s.begin();
  stroke(3, -14, hand[0], hand[1], 1.3, EC.body);
  for (let j = -1; j <= 1; j++) stroke(hand[0], hand[1], hand[0] + 3, hand[1] + j * 1.5 + 1, 0.5, EC.claw);
  s.commit();
  s.outline(EC.outline);
  return s;
}
