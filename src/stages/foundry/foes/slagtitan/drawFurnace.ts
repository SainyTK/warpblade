import type { SpriteCanvas } from "../../../../engine/sprite";
import { FORGE } from "../../colors";
import type { TitanPose } from "./pose";

const I = FORGE.iron;
const C = FORGE.crust;
const B = FORGE.brass;
const M = FORGE.molten;
const BRICK_ROWS = 5;

export function drawFurnace(s: SpriteCanvas, p: TitanPose, time: number): void {
  const c = p.crouch;
  const top = -54 + c;
  const bottom = -16 + c;
  s.begin();
  s.poly(
    [
      [-16, top + 5],
      [-14.5, top + 1.5],
      [-11, top],
      [11, top],
      [15, top + 1.5],
      [17, top + 5],
      [17.5, bottom - 6],
      [16, bottom - 1.5],
      [12, bottom],
      [-12, bottom],
      [-15.5, bottom - 1.5],
      [-17, bottom - 6],
    ],
    C[2],
  );
  s.shadeEdges(C[2], C[3], C[1], 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [10, top + 0.5],
      [15, top + 1.5],
      [17, top + 5],
      [17.5, bottom - 6],
      [16, bottom - 1.5],
      [12, bottom],
      [9, bottom],
      [11, bottom - 6],
      [11.5, top + 5],
    ],
    C[1],
  );
  s.poly(
    [
      [-14.5, top + 2],
      [-11, top + 0.5],
      [-8, top + 0.5],
      [-10, top + 5],
      [-10.5, bottom - 6],
      [-9, bottom - 0.5],
      [-12, bottom - 0.5],
      [-15.5, bottom - 2],
      [-16.5, bottom - 6],
      [-15.5, top + 5],
    ],
    C[3],
  );
  s.commit(false);
  s.begin();
  const rowH = (bottom - top - 4) / BRICK_ROWS;
  for (let r = 1; r < BRICK_ROWS; r++) {
    const y = top + 2 + r * rowH;
    const seep = 0.5 + 0.5 * Math.sin(time * 2.4 + r * 1.7);
    s.hairline(-16, y, 17, y, M[1]);
    s.hairline(-14 + r * 3, y, -6 + r * 3, y, seep > 0.6 ? M[3] : M[2]);
    for (let x = -12 + (r % 2) * 4; x < 16; x += 8) {
      s.hairline(x, y - rowH + 0.6, x, y - 0.4, x > 9 ? C[0] : M[1]);
      if ((x + r) % 3 === 0) s.set(x, y - rowH * 0.5, M[2 + Math.round(seep)]);
    }
    s.hairline(-15, y - rowH + 0.8, -11, y - rowH + 0.8, C[3]);
  }
  s.hairline(-13, top + 1, 9, top + 1, FORGE.plate[4]);
  s.hairline(-16.4, top + 6, -16.4, bottom - 6, FORGE.plate[3]);
  s.commit(false);
  s.begin();
  s.block(-17, top + 6, I[2], 35, 2);
  s.block(-17, bottom - 6, I[2], 35, 2);
  s.commit();
  s.begin();
  s.hairline(-17, top + 6, 11, top + 6, I[4]);
  s.hairline(11, top + 7.5, 18, top + 7.5, I[0]);
  s.hairline(-17, bottom - 6, 11, bottom - 6, I[3]);
  for (const x of [-14, -7, 0, 7, 14]) {
    s.set(x, top + 6.5, B[3]);
    s.set(x, bottom - 5.5, B[3]);
  }
  s.commit(false);
}
