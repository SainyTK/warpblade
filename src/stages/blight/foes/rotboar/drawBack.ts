import type { SpriteCanvas } from "../../../../engine/sprite";
import { BOAR } from "./colors";
import type { BoarPose } from "./pose";

const SHELVES: readonly (readonly [number, number, number])[] = [
  [-7, -17.5, 3.6],
  [-2.5, -19.5, 4.4],
  [-10.5, -14.5, 2.8],
];

const PUSTULES: readonly (readonly [number, number, number])[] = [
  [1.5, -19, 1.2],
  [-4.5, -17.2, 0.9],
  [4.5, -18.4, 0.8],
  [-9.5, -12, 0.8],
];

function bristles(s: SpriteCanvas, p: BoarPose, time: number): void {
  const up = p.charge > 0 ? 1 + p.charge : 1;
  s.begin();
  for (let i = 0; i < 9; i++) {
    const x = -10 + i * 2.2 + p.lean;
    const top = -12.5 - Math.sin(((i + 1) / 10) * Math.PI) * 7.5 + p.bob + (i < 3 ? p.rump * 0.6 : 0);
    const sway = Math.sin(time * 3 + i) * 0.3;
    s.hairline(x, top + 0.5, x - 1 + sway, top - 2.8 * up, i % 2 ? BOAR.bristle[2] : BOAR.hide[4]);
  }
  s.commit(false);
}

function shelves(s: SpriteCanvas, p: BoarPose): void {
  s.begin();
  for (const [x, y, r] of SHELVES) {
    const cx = x + p.lean;
    const cy = y + p.bob + (x < -5 ? p.rump * 0.6 : 0);
    s.poly(
      [
        [cx - r, cy + 0.6],
        [cx - r * 0.7, cy - r * 0.45],
        [cx, cy - r * 0.6],
        [cx + r * 0.7, cy - r * 0.45],
        [cx + r, cy + 0.6],
        [cx, cy + 1.2],
      ],
      BOAR.shelf[2],
    );
  }
  s.shadeEdges(BOAR.shelf[2], BOAR.shelf[3], BOAR.shelf[1], 1);
  s.commit();
  s.begin();
  for (const [x, y, r] of SHELVES) {
    const cx = x + p.lean;
    const cy = y + p.bob + (x < -5 ? p.rump * 0.6 : 0);
    s.hairline(cx - r * 0.6, cy - 0.2, cx + r * 0.6, cy - 0.2, BOAR.shelf[1]);
    s.hairline(cx - r * 0.8, cy + 0.7, cx + r * 0.8, cy + 0.7, BOAR.shelf[0]);
    s.set(cx - r * 0.3, cy - r * 0.5, BOAR.shelf[3]);
  }
  s.commit(false);
}

function pustules(s: SpriteCanvas, p: BoarPose, time: number): void {
  s.begin();
  PUSTULES.forEach(([x, y, r], i) => {
    const cx = x + p.lean;
    const cy = y + p.bob;
    const lit = p.charge > 0.3 || Math.sin(time * 3 + i * 1.9) > 0;
    s.dot(cx, cy, r, lit ? BOAR.pustule[2] : BOAR.pustule[1]);
    s.set(cx - r * 0.4, cy - r * 0.4, lit ? BOAR.pustule[4] : BOAR.pustule[3]);
  });
  s.commit(false);
}

export function drawBack(s: SpriteCanvas, p: BoarPose, time: number): void {
  bristles(s, p, time);
  shelves(s, p);
  pustules(s, p, time);
}
