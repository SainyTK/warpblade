import type { SpriteCanvas } from "../../../../engine/sprite";
import { LORD_COLORS as L } from "./colors";
import type { LordPose } from "./pose";

const S = L.steel;
const C = L.cloak;
const R = L.rune;

export function drawCloak(s: SpriteCanvas, p: LordPose, time: number): void {
  const l = p.lean;
  const c = p.crouch;
  const flow = Math.sin(time * 1.8) * 1.2 + l * 0.8;
  const hem: readonly [number, number][] = [
    [-1 - flow, -5],
    [-3.5 - flow, -2.5],
    [-6.5 - flow, -5.5],
    [-9.5 - flow * 1.3, -2.5],
    [-12.5 - flow * 1.2, -8],
  ];
  s.begin();
  s.poly([[-8 + l * 0.8, -32 + c], [4 + l, -32 + c], ...hem, [-11 + l * 0.4, -25 + c]], C[2]);
  s.shadeEdges(C[2], C[3], C[0], 2);
  s.hairline(-6 + l * 0.6, -28 + c, -8 - flow, -5, C[1]);
  s.hairline(-2.5 + l * 0.7, -29 + c, -4 - flow, -4, C[1]);
  s.commit();
  s.begin();
  for (let i = 0; i + 1 < hem.length; i++)
    s.hairline(hem[i][0], hem[i][1] - 0.5, hem[i + 1][0], hem[i + 1][1] - 0.5, L.lining);
  s.commit(false);
}

export function drawFaulds(s: SpriteCanvas, p: LordPose): void {
  const l = p.lean * 0.5;
  const c = p.crouch * 0.8;
  for (let k = 0; k < 3; k++) {
    const y = -18 + k * 2.4 + c;
    const w = 4.4 + k * 0.7;
    s.begin();
    s.poly(
      [
        [-w + l, y],
        [w + 1 + l, y - 0.4],
        [w + 1.6 + l, y + 2.8],
        [-w - 0.4 + l, y + 3],
      ],
      S[2],
    );
    s.shadeEdges(S[2], S[3], S[0]);
    s.hairline(-w + 0.5 + l, y + 0.4, w + l, y, S[4]);
    s.commit();
  }
}

export function drawCuirass(s: SpriteCanvas, p: LordPose): void {
  const l = p.lean;
  const c = p.crouch;
  const keel = 1 + l * 0.8;
  const top = -32 + c;
  const waist = -18 + c;
  s.begin();
  s.poly(
    [
      [-8.5 + l * 0.8, top],
      [keel, top - 0.6],
      [keel + 0.4, waist],
      [-4 + l * 0.5, waist],
      [-7.5 + l * 0.7, -25 + c],
    ],
    S[3],
  );
  s.poly(
    [
      [keel, top - 0.6],
      [9 + l, top],
      [8 + l * 0.8, -25 + c],
      [4.5 + l * 0.6, waist],
      [keel + 0.4, waist],
    ],
    S[2],
  );
  s.shadeEdges(S[3], S[4], S[2], 2);
  s.shadeEdges(S[2], S[3], S[1], 2);
  s.commit();
  s.begin();
  s.hairline(keel, top, keel + 0.4, waist - 0.5, S[5]);
  s.hairline(keel + 0.6, top, keel + 1, waist - 0.5, S[1]);
  for (const y of [-22.5, -20.3]) {
    s.hairline(-6 + l * 0.6, y + c, 6 + l * 0.6, y + c - 0.2, S[1]);
    s.hairline(-6 + l * 0.6, y + c + 0.5, 6 + l * 0.6, y + c + 0.3, S[4]);
  }
  s.hairline(-7 + l * 0.8, top + 1.2, -3 + l * 0.8, top + 4, S[5]);
  s.set(5 + l * 0.8, top + 3, L.rust);
  s.set(-4 + l * 0.7, -24 + c, L.rust);
  s.commit(false);
  drawRune(s, keel - 0.5, top + 4.5, p);
  s.begin();
  s.block(-4.5 + l * 0.5, waist - 0.6, L.leather[1], 9.5, 1.6);
  s.block(keel - 1, waist - 0.8, L.brass[1], 2.2, 2);
  s.set(keel - 0.6, waist - 0.6, L.brass[3]);
  s.commit();
}

function drawRune(s: SpriteCanvas, x: number, y: number, p: LordPose): void {
  const hot = p.heat > 0.5 || p.open;
  const glyph = p.open ? R[3] : hot ? R[4] : R[2];
  const edge = hot ? R[2] : R[1];
  s.begin();
  s.hairline(x, y, x, y + 5, glyph);
  s.hairline(x - 1.5, y + 1.2, x + 1.5, y + 1.2, glyph);
  s.hairline(x - 1.2, y + 3.5, x, y + 5, edge);
  s.hairline(x + 1.2, y + 3.5, x, y + 5, edge);
  s.set(x, y - 0.5, edge);
  if (p.open) {
    s.hairline(x + 2, y - 2, x + 3.5, y + 2, R[2]);
    s.hairline(x - 2, y + 2.5, x - 3.5, y + 6, R[2]);
  }
  s.commit(false);
}

export function drawPauldron(s: SpriteCanvas, x: number, y: number, near: boolean): void {
  const tones = near ? [S[3], S[4], S[1]] : [L.dark[3], S[2], L.dark[1]];
  for (let k = 2; k >= 0; k--) {
    const ly = y + k * 2.2;
    const r = 4.6 - k * 0.5;
    s.begin();
    s.poly(
      [
        [x - r, ly + 1.6],
        [x - r * 0.8, ly - 1.8],
        [x, ly - 3],
        [x + r * 0.8, ly - 1.8],
        [x + r, ly + 1.6],
      ],
      tones[0],
    );
    s.shadeEdges(tones[0], tones[1], tones[2], 2);
    s.commit();
    s.begin();
    s.hairline(x - r * 0.75, ly - 1.6, x + r * 0.6, ly - 2.4, near ? S[5] : S[3]);
    s.hairline(x - r + 0.4, ly + 1.4, x + r - 0.4, ly + 1.4, tones[2]);
    s.commit(false);
  }
  s.begin();
  s.set(x - 1.5, y - 2.5, near ? L.brass[3] : L.brass[1]);
  s.commit(false);
}
