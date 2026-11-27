import type { SpriteCanvas } from "../../../../engine/sprite";
import { lerp } from "../../../../utils/math";
import { BLIGHT } from "../../colors";
import { BLOAT_TONES } from "./colors";
import { CAP } from "./drawCap";
import type { BloatPose } from "./pose";

const G = BLOAT_TONES.gill;
const T = BLOAT_TONES.tendril;
const S = BLOAT_TONES.stalk;
const TENDRILS = 7;
const GILL_Y = CAP.cy + CAP.lip;

export function drawTendrils(s: SpriteCanvas, p: BloatPose, time: number): void {
  s.begin();
  for (let i = 0; i < TENDRILS; i++) {
    const x0 = lerp(-11.5, 11.5, i / (TENDRILS - 1));
    const len = 11 + ((i * 5) % 7) + p.drop * 2 + p.open * 3;
    let px = x0;
    let py = GILL_Y;
    for (let k = 1; k <= 6; k++) {
      const u = k / 6;
      const nx = x0 + Math.sin(time * 1.7 + i * 1.3 + u * 2.6) * 2.2 * u + p.shiver * Math.sin(time * 50 + i) * u;
      const ny = GILL_Y + len * u;
      if (k <= 2) s.stroke(px, py, nx, ny, 0.55, T[1]);
      else s.hairline(px, py, nx, ny, k < 5 ? T[1] : BLIGHT.rot[2]);
      px = nx;
      py = ny;
    }
    s.set(px, py, p.open > 0.4 ? G[4] : G[3]);
    s.set(px, py - 0.5, G[2]);
  }
  s.commit(false);
}

export function drawStalk(s: SpriteCanvas, p: BloatPose, fierce: boolean): void {
  const y = GILL_Y + 3.5;
  s.begin();
  s.dot(0.5, y, 3.8, S[1]);
  s.dot(0, y - 2.2, 2.8, S[1]);
  s.shadeEdges(S[1], S[2], S[0], 2);
  s.commit();
  s.begin();
  s.hairline(-2.5, y - 1, -2, y + 2.5, S[0]);
  s.hairline(-0.5, y + 1.5, 0, y + 3.5, BLIGHT.vein[1]);
  s.commit(false);
  const gape = 0.8 + p.maw * 2.2;
  s.begin();
  s.dot(2.8, y + 0.5, gape * 0.75 + 0.6, BLIGHT.maw);
  s.commit(false);
  s.begin();
  s.set(1.8, y + 0.5 - gape * 0.5, BLIGHT.tooth);
  s.set(3, y + 0.2 - gape * 0.65, BLIGHT.tooth);
  s.set(2, y + 0.5 + gape * 0.5, BLIGHT.tooth);
  s.set(3.4, y + 0.8 + gape * 0.6, BLIGHT.tooth);
  if (p.maw > 0.5) s.set(2.8, y + 0.5, fierce ? G[4] : G[3]);
  s.commit(false);
}

export function drawGills(s: SpriteCanvas, p: BloatPose, time: number): void {
  const ry = 1.6 + p.open * 2.4;
  s.begin();
  s.poly(
    [
      [-CAP.rx + 1, GILL_Y - 0.6],
      [-CAP.rx * 0.6, GILL_Y + ry * 0.8],
      [0, GILL_Y + ry],
      [CAP.rx * 0.6, GILL_Y + ry * 0.8],
      [CAP.rx - 1, GILL_Y - 0.6],
    ],
    BLIGHT.flesh[1],
  );
  s.commit();
  s.begin();
  const lit = p.open > 0.5 ? G[3] : G[1];
  for (let i = 0; i < 13; i++) {
    const x = lerp(-CAP.rx + 2, CAP.rx - 2, i / 12);
    const depth = (1 - (x / CAP.rx) ** 2) * ry;
    const flick = Math.sin(time * 6 + i * 1.9) > 0.2;
    s.hairline(x, GILL_Y, x * 0.9, GILL_Y + depth * 0.85, i % 2 === 0 ? lit : G[1]);
    if (p.open > 0.3 && flick) s.set(x * 0.9, GILL_Y + depth * 0.7, G[4]);
  }
  s.commit(false);
}

export function drawEyes(s: SpriteCanvas, p: BloatPose, fierce: boolean): void {
  const y = GILL_Y + 1.6 + p.open * 0.6;
  const open = fierce ? 1.5 : 1;
  s.begin();
  for (const x of [5.5, 9.5]) {
    s.block(x - 1, y - open * 0.5 - 0.5, BLIGHT.maw, 2.5, open + 1);
    s.block(x - 0.5, y - open * 0.5, fierce ? BLIGHT.eyeHot : BLIGHT.eye, 1.5, open);
    s.set(x - 0.5, y - open * 0.5, BLIGHT.eyeHot);
  }
  s.commit(false);
}
