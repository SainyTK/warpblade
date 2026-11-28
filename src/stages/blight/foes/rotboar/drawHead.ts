import type { SpriteCanvas } from "../../../../engine/sprite";
import { BOAR } from "./colors";
import type { BoarPose } from "./pose";

function snout(s: SpriteCanvas, hx: number, hy: number): void {
  s.begin();
  s.stroke(hx - 4, hy - 1, hx + 1, hy + 0.5, 4.2, BOAR.hide[2]);
  s.taper(hx, hy + 0.5, hx + 5.5, hy + 2.5, 2.6, 1.8, BOAR.hide[3]);
  s.shadeEdges(BOAR.hide[3], BOAR.hide[4], BOAR.hide[1], 1);
  s.commit();
  s.begin();
  s.dot(hx + 6.5, hy + 2.5, 1.8, BOAR.snout[3]);
  s.shadeEdges(BOAR.snout[3], BOAR.snout[4], BOAR.snout[2]);
  s.set(hx + 7, hy + 2, BOAR.nose);
  s.set(hx + 7, hy + 3, BOAR.nose);
  s.commit();
  s.begin();
  s.hairline(hx + 1, hy + 3.8, hx + 5.5, hy + 4.2, BOAR.hide[0]);
  s.commit(false);
}

function tusk(s: SpriteCanvas, hx: number, hy: number): void {
  s.begin();
  s.taper(hx + 3.5, hy + 3.5, hx + 6.5, hy - 1.8, 0.9, 0.3, BOAR.tusk[2], -1.2);
  s.shadeEdges(BOAR.tusk[2], BOAR.tusk[3], BOAR.tusk[1]);
  s.set(hx + 6.5, hy - 1.8, BOAR.tusk[3]);
  s.commit();
}

const PLATES: readonly (readonly [number, number, number])[] = [
  [-4, -3.6, 1.6],
  [-1.5, -3.4, 1.8],
  [1.2, -2.6, 1.6],
  [3.4, -1.4, 1.2],
];

function plates(s: SpriteCanvas, hx: number, hy: number, hot: boolean): void {
  s.begin();
  for (const [x, y, r] of PLATES) {
    s.poly(
      [
        [hx + x - r, hy + y + 1],
        [hx + x - r * 0.4, hy + y - r * 0.8],
        [hx + x + r, hy + y - r * 0.4],
        [hx + x + r * 0.8, hy + y + 1.2],
      ],
      BOAR.plate[1],
    );
  }
  s.shadeEdges(BOAR.plate[1], BOAR.plate[2], BOAR.plate[0], 1);
  s.commit();
  s.begin();
  for (const [x, y, r] of PLATES) {
    s.hairline(hx + x - r * 0.4, hy + y - r * 0.8, hx + x + r, hy + y - r * 0.4, hot ? BOAR.plate[4] : BOAR.plate[3]);
  }
  s.commit(false);
}

function eye(s: SpriteCanvas, hx: number, hy: number, hot: boolean): void {
  s.begin();
  s.block(hx + 0.5, hy - 0.8, BOAR.hide[0], 2, 1.5);
  s.block(hx + 1, hy - 0.6, hot ? BOAR.eyeHot : BOAR.eye, 1, 1);
  s.set(hx + 1, hy - 0.6, BOAR.eyeHot);
  s.commit(false);
}

function ear(s: SpriteCanvas, hx: number, hy: number, back: number): void {
  s.begin();
  s.poly(
    [
      [hx - 5, hy - 2.5],
      [hx - 8.5 - back, hy - 5.5 + back * 0.6],
      [hx - 3.5, hy - 4],
    ],
    BOAR.hide[3],
  );
  s.shadeEdges(BOAR.hide[3], BOAR.hide[4], BOAR.hide[1]);
  s.set(hx - 6, hy - 3.8, BOAR.snout[2]);
  s.commit();
}

function daze(s: SpriteCanvas, hx: number, hy: number, time: number): void {
  s.begin();
  for (let i = 0; i < 3; i++) {
    const a = time * 5 + (i * Math.PI * 2) / 3;
    s.set(hx - 1 + Math.cos(a) * 4, hy - 7 + Math.sin(a) * 1.4, BOAR.pustule[3 + (i % 2)]);
  }
  s.commit(false);
}

export function drawHead(s: SpriteCanvas, p: BoarPose, time: number, hot: boolean): void {
  const hx = 12 + p.lean;
  const hy = -11 + p.bob + p.head;
  ear(s, hx, hy, p.charge > 0 ? 1.5 : 0);
  snout(s, hx, hy);
  tusk(s, hx, hy);
  plates(s, hx, hy, hot);
  eye(s, hx, hy, hot);
  if (p.charge > 0.2 && Math.sin(time * 18) > 0.4) {
    s.begin();
    s.set(hx + 8.5, hy + 1.5, BOAR.pustule[3]);
    s.set(hx + 9.5, hy + 1, BOAR.pustule[4]);
    s.commit(false);
  }
  if (p.dazed) daze(s, hx, hy, time);
}
