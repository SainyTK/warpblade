import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { lerp } from "../../../../utils/math";
import { FOE } from "../colors";
import { letter } from "../letters";
import type { Neck, Pt } from "./pose";

export interface Skin {
  body: Color;
  lit: Color;
  shade: Color;
  band: Color;
  bandLit: Color;
  fin: Color;
  finEdge: Color;
  seam: Color;
  glyph: Color;
  glyphHot: Color;
  letterEvery: number;
}

export const PAPER_SKIN: Skin = {
  body: FOE.paper[3],
  lit: FOE.paper[4],
  shade: FOE.paper[1],
  band: FOE.ink[1],
  bandLit: FOE.ink[3],
  fin: FOE.paper[2],
  finEdge: FOE.paperGlint,
  seam: FOE.paperShade,
  glyph: FOE.eyeDeep,
  glyphHot: FOE.letter,
  letterEvery: 3,
};

export const INK_SKIN: Skin = {
  body: FOE.ink[2],
  lit: FOE.ink[4],
  shade: FOE.ink[0],
  band: FOE.ink[0],
  bandLit: FOE.letter,
  fin: FOE.ink[1],
  finEdge: FOE.letter,
  seam: FOE.eyeDeep,
  glyph: FOE.letter,
  glyphHot: FOE.letterHot,
  letterEvery: 1,
};

const RADIUS = { base: 8.5, neck: 4.6 } as const;

const radiusAt = (u: number): number => lerp(RADIUS.base, RADIUS.neck, u);

function normalAt(joints: readonly Pt[], i: number): Pt {
  const a = joints[Math.max(0, i - 1)];
  const b = joints[Math.min(joints.length - 1, i + 1)];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return [dy / len, -dx / len];
}

export function drawNeck(s: SpriteCanvas, n: Neck, skin: Skin, time: number, thin: number): void {
  const { joints } = n;
  const last = joints.length - 1;
  s.begin();
  joints.forEach(([x, y], i) => {
    s.dot(x, y, radiusAt(i / last) * thin, skin.body);
  });
  s.shadeEdges(skin.body, skin.lit, skin.shade, 2);
  for (let i = 1; i < last; i++) {
    const [nx, ny] = normalAt(joints, i);
    const r = radiusAt(i / last) * thin;
    for (const half of [0, 0.5]) {
      const [ax, ay] = joints[i];
      const [bx, by] = joints[i + 1];
      const x = ax + (bx - ax) * half;
      const y = ay + (by - ay) * half;
      const edge = half === 0 ? skin.seam : skin.shade;
      s.hairline(x - nx * r * 0.7, y - ny * r * 0.7, x + nx * r * 0.55, y + ny * r * 0.55, edge);
      s.set(x - nx * r * 0.85, y - ny * r * 0.85, skin.shade);
    }
  }
  s.commit();
  for (let i = 2; i < last - 1; i += 2) {
    const [x, y] = joints[i];
    const [nx, ny] = normalAt(joints, i);
    const r = radiusAt(i / last) * thin;
    const flap = Math.sin(time * 5 + i) * 0.6;
    const side = nx < 0 ? 1 : -1;
    const ox = x + nx * r * side;
    const oy = y + ny * r * side;
    s.begin();
    s.poly(
      [
        [ox - ny * 1.6, oy + nx * 1.6],
        [ox + nx * side * 3.4 + flap, oy + ny * side * 3.4 - 1],
        [ox + ny * 1.6, oy - nx * 1.6],
      ],
      skin.fin,
    );
    s.set(ox + nx * side * 3 + flap, oy + ny * side * 3 - 1, skin.finEdge);
    s.commit();
  }
  for (let i = 3; i < last; i += 3) {
    const [x, y] = joints[i];
    const [nx, ny] = normalAt(joints, i);
    const r = radiusAt(i / last) * thin;
    s.begin();
    s.stroke(x - nx * r * 0.95, y - ny * r * 0.95, x + nx * r * 0.95, y + ny * r * 0.95, 0.75, skin.band);
    s.set(x + nx * r * 0.6, y + ny * r * 0.6, skin.bandLit);
    s.commit();
  }
  for (let i = 2; i < last; i += skin.letterEvery) {
    const [x, y] = joints[i];
    const [nx, ny] = normalAt(joints, i);
    const r = radiusAt(i / last) * thin;
    const drift = Math.sin(time * 1.7 + i * 1.3) * r * 0.35;
    s.begin();
    letter(s, x - 0.75 + nx * drift, y - 0.75 + ny * drift, i + Math.floor(time * 2), skin.glyph, skin.glyphHot);
    s.commit(false);
  }
}
