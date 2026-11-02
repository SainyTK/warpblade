import { ENEMY_COLORS as EC, PAL } from "../../constants/palette";
import { SpriteCanvas } from "../../engine/sprite";
import type { Enemy } from "../../types/enemy";
import { WHITE } from "../../utils/color";

const canvas = new SpriteCanvas(76, 76, 38, 34);

/** The Rift Warden: a great floating shadow with a horned crown, a pale mask, two clawed arms and five trailing tendrils */
export function drawWarden(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const raised = e.state === "volley" || e.state === "summon" || e.state === "wind";
  s.clear();
  s.begin();
  for (let i = 0; i < 5; i++) {
    const ox = (i - 2) * 4;
    s.stroke(
      ox,
      10,
      ox - 4 + Math.sin(time * 4 + i * 1.7) * 4,
      24 + (i % 2) * 5,
      2.4 - Math.abs(i - 2) * 0.4,
      EC.bodyDark,
    );
  }
  s.commit(false);
  s.begin();
  const armY = raised ? -16 : 6;
  for (const side of [-1, 1]) {
    s.stroke(side * 10, -2, side * 20, armY, 2, EC.body);
    for (let j = -1; j <= 1; j++) s.stroke(side * 20, armY, side * 24, armY + j * 2 + (raised ? -2 : 2), 0.7, EC.claw);
  }
  s.commit();
  s.begin();
  s.dot(0, 0, 13, EC.body);
  s.dot(-3, -4, 8, EC.bodyLight);
  for (let a = -2.7; a < -0.5; a += 0.12) s.set(Math.cos(a) * 12.5, Math.sin(a) * 12.5, EC.rim);
  // the crown: three horns
  s.stroke(-6, -10, -10, -22, 1.1, EC.claw);
  s.stroke(0, -12, 0, -25, 1.2, EC.claw);
  s.stroke(6, -10, 10, -22, 1.1, EC.claw);
  s.commit();
  s.begin();
  // the mask
  s.poly(
    [
      [-5, -6],
      [7, -6],
      [6, 3],
      [1, 7],
      [-4, 3],
    ],
    PAL.shadow[5],
  );
  const eye = raised || e.phase === 2 ? WHITE : EC.eye;
  s.set(-2, -2, eye);
  s.set(-1, -2, eye);
  s.set(3, -2, eye);
  s.set(4, -2, eye);
  s.set(1, 3, EC.bodyDark);
  if (e.phase === 2)
    for (const [x, y] of [
      [-6, 4],
      [8, -3],
      [-9, -6],
      [5, 8],
    ])
      s.set(x, y, EC.crack);
  s.commit();
  s.outline(EC.outline);
  return s;
}
