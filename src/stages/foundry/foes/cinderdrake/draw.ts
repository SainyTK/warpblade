import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { FORGE } from "../../colors";
import { type DrakePose, drakePose } from "./pose";

type Pt = readonly [number, number];
const canvas = detailCanvas(84, 64, 42, 32);
const H = FORGE.hide;
const L = FORGE.leather;
const C = FORGE.crust;
const M = FORGE.molten;
const MEMBRANE: readonly Pt[] = [
  [0, -2.5],
  [6, -7],
  [13, -10],
  [21, -7.5],
  [19, -2],
  [16, 1],
  [13.5, -0.5],
  [10.5, 3],
  [7.5, 1],
  [4, 4],
  [0, 3],
];
const FINGERS: readonly number[] = [4, 6, 8];
const ELBOW: Pt = [12, -9];

const toWing = (p: DrakePose, near: boolean, [u, v]: Pt): Pt => {
  const a = -0.45 + p.flap * 0.95;
  const span = (1 - p.sweep * 0.45) * (near ? 1 : 0.85);
  const x = -(u * Math.cos(a) - v * Math.sin(a)) * span;
  const y = (u * Math.sin(a) + v * Math.cos(a)) * (near ? 1 : 0.85);
  return near ? [x + 1, y - 3] : [x + 3, y - 4];
};

function wing(s: SpriteCanvas, p: DrakePose, near: boolean): void {
  const at = (q: Pt): Pt => toWing(p, near, q);
  const skin = near ? L[2] : L[1];
  s.begin();
  s.poly(MEMBRANE.map(at), skin);
  s.shadeEdges(skin, near ? L[3] : L[2], FORGE.soot);
  s.commit();
  const vein: Color = p.heat > 0.6 ? M[3] : near ? FORGE.wingVein : M[1];
  s.begin();
  const [rx, ry] = at([0, -2]);
  const [ex, ey] = at(ELBOW);
  const [tx, ty] = at(MEMBRANE[3]);
  s.hairline(rx, ry, ex, ey, near ? C[3] : C[2]);
  s.hairline(ex, ey, tx, ty, near ? C[3] : C[2]);
  for (const i of FINGERS) {
    const [fx, fy] = at(MEMBRANE[i]);
    s.hairline(ex, ey, fx, fy, vein);
  }
  s.set(tx, ty, near ? FORGE.ironGlint : C[3]);
  s.commit(false);
}

function tail(s: SpriteCanvas, p: DrakePose): void {
  s.begin();
  s.taper(-6, 1, -21, 4 + p.tail, 2.4, 0.6, H[1], 1.5);
  s.poly(
    [
      [-20, 3 + p.tail],
      [-25, 1.5 + p.tail],
      [-24, 6 + p.tail],
    ],
    C[2],
  );
  s.shadeEdges(H[1], H[2], H[0]);
  s.commit();
  s.begin();
  s.hairline(-8, 2.6, -18, 5 + p.tail * 0.8, M[1]);
  s.commit(false);
}

function body(s: SpriteCanvas, p: DrakePose): void {
  s.begin();
  s.dot(-1, 0, 5, H[1]);
  s.dot(2.5, -0.8, 4.2, H[1]);
  s.dot(-4.5, 0.8, 3.8, H[1]);
  s.shadeEdges(H[1], H[2], H[0], 2);
  s.commit();
  s.begin();
  const hot = p.heat > 0.6 ? M[4] : p.heat > 0.3 ? M[3] : M[2];
  for (let x = -5; x <= 5; x += 2.5) s.hairline(x, 3.4 - Math.abs(x) * 0.1, x + 1.6, 2.6, hot);
  s.hairline(0, -3.5, 4.5, -4, C[3]);
  s.set(-2, -4, FORGE.ironGlint);
  s.commit(false);
  s.begin();
  s.stroke(1, 3.5, 2, 6.5, 0.8, H[2]);
  s.stroke(-4, 3.5, -4.5, 6.4, 0.8, H[1]);
  s.commit();
}

function head(s: SpriteCanvas, p: DrakePose): void {
  const hx = 11;
  const hy = -7 + p.neck;
  s.begin();
  s.taper(4, -2.5, hx - 1, hy + 1, 2.4, 1.7, H[2], -1.2);
  s.shadeEdges(H[2], FORGE.hide[2], H[0]);
  s.commit();
  const drop = p.jaw * 2.6;
  s.begin();
  s.poly(
    [
      [hx - 1, hy + 0.6],
      [hx + 6.5, hy + 0.8 + drop * 0.7],
      [hx + 6, hy + 2 + drop],
      [hx - 1, hy + 2.4],
    ],
    C[2],
  );
  s.shadeEdges(C[2], C[3], C[0]);
  s.commit();
  if (p.jaw > 0.2) {
    s.begin();
    s.poly(
      [
        [hx, hy + 0.2],
        [hx + 6, hy - 0.1],
        [hx + 5.6, hy + 0.6 + drop * 0.8],
        [hx, hy + 1.4],
      ],
      p.heat > 0.6 ? M[5] : M[3],
    );
    s.commit(false);
  }
  s.begin();
  s.poly(
    [
      [hx - 2.5, hy - 2.5],
      [hx + 2, hy - 3.2],
      [hx + 7.5, hy - 1],
      [hx + 7, hy + 0.4],
      [hx - 2, hy + 0.8],
    ],
    H[2],
  );
  s.shadeEdges(H[2], FORGE.plate[3], H[0]);
  s.commit();
  s.begin();
  s.taper(hx - 1, hy - 2.6, hx - 6, hy - 6.5, 1, 0.3, C[3], 0.6);
  s.taper(hx + 1, hy - 3, hx - 2.5, hy - 7.5, 1, 0.3, C[3], 0.6);
  s.shadeEdges(C[3], FORGE.ironGlint, C[1]);
  s.commit();
  s.begin();
  const eye = p.heat > 0.5 ? WHITE : FORGE.eye;
  s.block(hx + 1.6, hy - 1.8, M[3], 1.4, 0.8);
  s.set(hx + 2.4, hy - 1.8, eye);
  s.set(hx + 6.6, hy - 0.6, M[2]);
  s.hairline(hx - 1.5, hy - 2.4, hx + 4, hy - 3, FORGE.plate[4]);
  s.commit(false);
}

export function drawCinderdrake(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = drakePose(e, t + e.seed);
  s.clear();
  wing(s, p, false);
  tail(s, p);
  body(s, p);
  head(s, p);
  wing(s, p, true);
  s.outline(FORGE.outline);
  return s;
}
