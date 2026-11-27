import type { SpriteCanvas } from "../../../../engine/sprite";
import { RAIN_FOES as R } from "../../../../game/enemies/rain/colors";
import { glint } from "../../../../game/enemies/rain/detail";
import { WHITE } from "../../../../utils/color";
import { SNAPPER as C } from "./colors";
import type { SnapperPose } from "./pose";

const NECK_X = 8;
const HEAD_X = 13;

function neck(s: SpriteCanvas, base: number, hx: number, hy: number): void {
  s.begin();
  s.taper(NECK_X, base - 2, hx - 1.5, hy + 0.5, 3, 2.2, C.skin);
  s.dot(hx, hy, 3.4, C.skin);
  s.dot(hx + 2.4, hy + 0.4, 2.4, C.skin);
  s.shadeEdges(C.skin, C.skinLight, C.skinDark, 2);
  for (let x = NECK_X + 2; x < hx - 2; x += 2.6) {
    const k = (x - NECK_X) / Math.max(1, hx - NECK_X);
    const y = base - 2 + (hy - base + 2) * k;
    s.hairline(x, y - 1.8, x + 0.6, y + 1.6, C.skinDark);
  }
  s.set(hx - 1.6, hy - 2.8, C.skinRim);
  s.set(hx - 0.8, hy - 3.2, R.wetSky);
  s.dot(hx - 1, hy + 1.4, 0.7, C.skinLight);
}

function beak(s: SpriteCanvas, hx: number, hy: number, open: number): void {
  const drop = open * 2.6;
  s.poly(
    [
      [hx + 1.5, hy - 2.4],
      [hx + 5.4, hy - 1.6],
      [hx + 6.6, hy + 0.2],
      [hx + 5.6, hy + 1.2],
      [hx + 5, hy + 0.3],
      [hx + 1.6, hy + 0.4],
    ],
    C.beak,
  );
  s.poly(
    [
      [hx + 1.4, hy + 1],
      [hx + 4.8, hy + 1 + drop * 0.6],
      [hx + 5.2, hy + 1.8 + drop],
      [hx + 1.4, hy + 2.6],
    ],
    C.beak,
  );
  s.shadeEdges(C.beak, C.beakLight, C.beakDark);
  if (open > 0.15) {
    s.poly(
      [
        [hx + 1.8, hy + 0.5],
        [hx + 5, hy + 0.6],
        [hx + 4.8, hy + 1.1 + drop * 0.8],
        [hx + 1.8, hy + 1.2],
      ],
      C.mouth,
    );
  }
  glint(s, hx + 3, hy - 1.9, C.beakLight);
}

function eye(s: SpriteCanvas, hx: number, hy: number, hot: number): void {
  s.dot(hx + 0.4, hy - 1.4, 1, R.outline);
  s.dot(hx + 0.5, hy - 1.45, 0.7, hot > 0.4 ? R.wartHot : R.wart);
  s.set(hx + 0.8, hy - 1.4, hot > 0.4 ? WHITE : R.veinDeep);
  s.set(hx + 0.1, hy - 1.9, WHITE);
}

export function drawHead(s: SpriteCanvas, base: number, p: SnapperPose): void {
  const hx = HEAD_X + p.neck;
  const hy = base - 4 + p.headY;
  neck(s, base, hx, hy);
  beak(s, hx, hy, p.mouth);
  eye(s, hx, hy, p.glow);
  s.commit();
}
