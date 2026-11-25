import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { WHITE } from "../../../../utils/color";
import { FOE } from "../colors";
import { letter } from "../letters";
import type { Neck, Pt } from "./pose";

interface HeadSkin {
  cover: Color;
  coverLit: Color;
  coverDeep: Color;
  trim: Color;
  eye: Color;
  eyeHot: Color;
}

export const LEATHER_HEAD: HeadSkin = {
  cover: FOE.leather[2],
  coverLit: FOE.leather[3],
  coverDeep: FOE.leather[0],
  trim: FOE.gilt,
  eye: FOE.eye,
  eyeHot: FOE.eyeHot,
};

export const INK_HEAD: HeadSkin = {
  cover: FOE.ink[1],
  coverLit: FOE.ink[3],
  coverDeep: FOE.ink[0],
  trim: FOE.letter,
  eye: FOE.letterHot,
  eyeHot: WHITE,
};

const HINGE: Pt = [-4, 0];
const UPPER: readonly Pt[] = [
  [-7, -5],
  [2, -6],
  [8, -3.5],
  [11, -0.5],
  [-5, 0.5],
];
const LOWER: readonly Pt[] = [
  [-5, 0.5],
  [9, 0.8],
  [7.5, 3.2],
  [-4, 4],
];

type Frame = (u: number, v: number) => Pt;

function frame(head: Pt, angle: number, open: number): Frame {
  const co = Math.cos(open);
  const so = Math.sin(open);
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  return (u, v) => {
    const du = u - HINGE[0];
    const dv = v - HINGE[1];
    const qu = HINGE[0] + du * co - dv * so;
    const qv = HINGE[1] + du * so + dv * co;
    return [head[0] + qu * ca - qv * sa, head[1] + qu * sa + qv * ca];
  };
}

function teeth(s: SpriteCanvas, at: Frame, v: number, dir: number, from: number, to: number): void {
  for (let u = from; u <= to; u += 1.6) {
    const [ax, ay] = at(u, v);
    const [bx, by] = at(u + 0.8, v + dir * 1.8);
    const [cx, cy] = at(u + 1.6, v);
    s.poly(
      [
        [ax, ay],
        [bx, by],
        [cx, cy],
      ],
      FOE.paper[4],
    );
  }
}

export function drawHead(s: SpriteCanvas, n: Neck, skin: HeadSkin, hot: boolean, time: number): void {
  const open = n.jaw;
  const upper = frame(n.head, n.angle, -open * 0.42);
  const lower = frame(n.head, n.angle, open * 0.5);
  const base = frame(n.head, n.angle, 0);
  if (open > 0.15) {
    s.begin();
    s.poly([base(-5, 0), upper(9, -0.5), lower(8, 1.5)], FOE.ink[0]);
    s.commit(false);
    s.begin();
    const [gx, gy] = base(2, 0.5);
    letter(s, gx, gy, Math.floor(time * 5), FOE.letter, FOE.letterHot);
    const wave = Math.sin(time * 12) * 1.2;
    const [rx, ry] = base(-3, 1);
    const [tx, ty] = base(7 + open * 3, 1.5 + wave);
    s.stroke(rx, ry, tx, ty, 0.55, FOE.leather[3]);
    s.set(tx, ty, FOE.leather[3]);
    s.commit(false);
  }
  s.begin();
  s.poly(
    LOWER.map(([u, v]) => lower(u, v)),
    skin.cover,
  );
  s.shadeEdges(skin.cover, skin.coverLit, skin.coverDeep);
  s.commit();
  s.begin();
  teeth(s, lower, 0.8, -1, -2, 7);
  s.commit(false);
  s.begin();
  for (let i = 0; i < 3; i++) {
    const sway = Math.sin(time * 4 + i) * 0.6;
    const [ax, ay] = upper(-6, -3.5 + i * 1.2);
    const [bx, by] = upper(-12 - i * 0.8 + sway, -7.5 + i * 2.6);
    s.taper(ax, ay, bx, by, 1.3, 0.4, i === 1 ? FOE.paper[4] : FOE.paper[3], 0.6);
  }
  s.commit();
  s.begin();
  s.poly(
    UPPER.map(([u, v]) => upper(u, v)),
    skin.cover,
  );
  s.shadeEdges(skin.cover, skin.coverLit, skin.coverDeep, 2);
  const [p0x, p0y] = upper(-5, -0.5);
  const [p1x, p1y] = upper(9.5, -0.6);
  s.hairline(p0x, p0y, p1x, p1y, FOE.paper[3]);
  for (const [u, v] of [
    [1.5, -5.4],
    [9, -2.6],
  ] as const) {
    const [x, y] = upper(u, v);
    s.block(x - 0.5, y - 0.5, skin.trim);
  }
  const [rx, ry] = upper(-5.5, -3);
  const [qx, qy] = upper(6, -4.6);
  s.hairline(rx, ry, qx, qy, skin.trim);
  s.commit();
  s.begin();
  teeth(s, upper, -0.4, 1, -2, 8);
  s.commit(false);
  s.begin();
  const [ex, ey] = upper(1.5, -2.6);
  s.dot(ex, ey, 1.4, FOE.ink[0]);
  s.dot(ex + 0.25, ey, 0.9, hot ? skin.eyeHot : skin.eye);
  s.set(ex + 0.5, ey - 0.25, WHITE);
  const [bx, by] = upper(-0.5, -4.4);
  const [cx, cy] = upper(4, -3.8);
  s.stroke(bx, by, cx, cy, 0.5, skin.coverDeep);
  s.commit(false);
}
