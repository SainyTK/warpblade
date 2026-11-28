import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { AC, hideOf, VOID } from "../../../../game/enemies/abyss/colors";
import { fang, glowEye, type Pt, sunRim } from "../../../../game/enemies/abyss/paint";
import type { Enemy } from "../../../../types/enemy";
import { CITADEL_FOE } from "../colors";
import { type BehemothPose, behemothPose } from "./pose";

const canvas = detailCanvas(96, 64, 46, 58);
const B = CITADEL_FOE.bone;
type Hide = ReturnType<typeof hideOf>;

const PLATES: readonly (readonly [number, number, number])[] = [
  [-16, -31, 7],
  [-5, -35, 8],
  [7, -33, 7],
];

function tilt(p: BehemothPose, x: number, y: number): Pt {
  const a = -p.rear * 0.32;
  const px = x + 16;
  return [-16 + px * Math.cos(a) - y * Math.sin(a), px * Math.sin(a) + y * Math.cos(a) + p.lift];
}

function leg(s: SpriteCanvas, hip: Pt, paw: Pt, tone: number, light: number, H: Hide): void {
  const knee: Pt = [(hip[0] + paw[0]) / 2 + 1, (hip[1] + paw[1]) / 2];
  s.begin();
  s.taper(hip[0], hip[1], knee[0], knee[1], 4.6, 3.8, tone);
  s.taper(knee[0], knee[1], paw[0], paw[1] - 2, 3.8, 3.4, tone);
  s.poly(
    [
      [paw[0] - 4, paw[1] - 4],
      [paw[0] + 4.5, paw[1] - 4],
      [paw[0] + 5.5, paw[1]],
      [paw[0] - 4.5, paw[1]],
    ],
    tone,
  );
  s.shadeEdges(tone, light, H.deep, 2);
  s.commit();
  s.begin();
  for (const dx of [-2.5, 0.5, 3.5]) fang(s, [paw[0] + dx, paw[1] - 0.8], [paw[0] + dx + 1.6, paw[1]], 1.2, B[1]);
  s.commit();
}

function body(s: SpriteCanvas, p: BehemothPose, H: Hide, time: number): void {
  s.begin();
  for (const [x, y, r] of [
    [-17, -21, 12],
    [-3, -23, 13.5],
    [11, -22, 12.5],
  ] as const) {
    const [cx, cy] = tilt(p, x, y);
    s.dot(cx, cy, r, H.body);
  }
  s.shadeEdges(H.body, H.sheen, H.dark, 3);
  const [ax, ay] = tilt(p, -24, -12);
  const [bx, by] = tilt(p, 18, -11);
  s.stroke(ax, ay, bx, by, 2.4, H.dark);
  s.commit();
  const glowing = Math.sin(time * 2.5) > 0 ? VOID[2] : VOID[1];
  s.begin();
  for (let i = 0; i < 3; i++) {
    const [x0, y0] = tilt(p, -14 + i * 11, -19);
    const [x1, y1] = tilt(p, -11 + i * 11, -14);
    s.hairline(x0, y0, x1, y1, p.hot > 0.5 ? VOID[4] : glowing);
  }
  s.commit(false);
}

function core(s: SpriteCanvas, p: BehemothPose, time: number): void {
  if (p.open <= 0) return;
  const [cx, cy] = tilt(p, -5, -32);
  const pulse = 1 + Math.sin(time * 14) * 0.3;
  s.begin();
  s.dot(cx, cy, 6 * p.open, VOID[2]);
  s.dot(cx, cy, 4.2 * p.open * pulse, VOID[4]);
  s.dot(cx - 0.5, cy - 0.5, 2 * p.open, VOID[5]);
  s.commit(false);
}

function plates(s: SpriteCanvas, p: BehemothPose): void {
  PLATES.forEach(([x, y, r], i) => {
    const spread = p.open * (i - 1) * 5;
    const rise = p.open * (i === 1 ? 7 : 4);
    const [cx, cy] = tilt(p, x + spread, y - rise);
    s.begin();
    s.poly(
      [
        [cx - r, cy + 3],
        [cx - r * 0.6, cy - r * 0.55],
        [cx + r * 0.3, cy - r * 0.8],
        [cx + r, cy - 1],
        [cx + r * 0.7, cy + 3.5],
      ],
      AC.plate,
    );
    s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark, 2);
    s.hairline(cx - r * 0.5, cy - r * 0.4, cx + r * 0.5, cy - r * 0.6, AC.plateGlint);
    fang(s, [cx + r * 0.1, cy - r * 0.7], [cx - r * 0.4, cy - r * 0.7 - 5], 2, AC.plateLight);
    s.hairline(cx - 1, cy - 2, cx + 2, cy + 2.5, p.hot > 0.5 ? VOID[4] : VOID[2]);
    s.commit();
  });
}

function head(s: SpriteCanvas, p: BehemothPose, H: Hide): void {
  const [hx, hy] = [p.head[0], p.head[1] + p.lift];
  const [nx, ny] = tilt(p, 16, -24);
  s.begin();
  s.stroke(nx, ny, hx - 3, hy, 6.5, H.body);
  s.shadeEdges(H.body, H.sheen, H.dark, 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [hx - 6, hy - 6],
      [hx + 3, hy - 7],
      [hx + 9, hy - 2],
      [hx + 10, hy + 4],
      [hx + 4, hy + 7],
      [hx - 5, hy + 5],
    ],
    AC.plate,
  );
  s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark, 2);
  s.hairline(hx - 3, hy - 5, hx + 6, hy - 4, AC.plateGlint);
  s.commit();
  s.begin();
  s.taper(hx + 2, hy - 5, hx + 13, hy - 13, 2.2, 0.5, B[2], 0.8);
  s.taper(hx + 6, hy + 2, hx + 16, hy + 1, 2, 0.5, B[1], -0.6);
  s.shadeEdges(B[2], B[3], B[0]);
  s.shadeEdges(B[1], B[2], B[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [hx + 3, hy + 5],
      [hx + 9, hy + 4],
      [hx + 7, hy + 8],
      [hx + 2, hy + 8],
    ],
    p.hot > 0.5 ? AC.gulletHot : AC.gullet,
  );
  fang(s, [hx + 7, hy + 4.5], [hx + 7.5, hy + 7], 1, AC.tooth);
  fang(s, [hx + 4.5, hy + 5], [hx + 5, hy + 7.2], 1, AC.tooth);
  s.commit();
  const hot = p.hot > 0.5;
  glowEye(s, hx + 5, hy - 2, hot ? AC.eyeHot : AC.eye, hot ? AC.eye : AC.eyeDim, AC.eyeHot);
  glowEye(s, hx + 2, hy - 2.5, hot ? AC.eye : AC.eyeDim, AC.eyeDim, AC.eye);
}

export function drawVoidbehemoth(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = behemothPose(e, time);
  const H = hideOf(e.seed);
  s.clear();
  leg(s, tilt(p, -19, -14), p.hindFar, H.deep, H.dark, H);
  leg(s, tilt(p, 10, -14), p.frontFar, H.deep, H.dark, H);
  s.begin();
  const [tx, ty] = tilt(p, -27, -22);
  s.taper(tx, ty, tx - 8, ty + 8 + Math.sin(time * 3) * 2, 2.4, 1, H.dark, 0.6);
  s.shadeEdges(H.dark, H.body, H.deep);
  s.commit();
  body(s, p, H, time);
  core(s, p, time);
  plates(s, p);
  leg(s, tilt(p, -15, -13), p.hindNear, H.dark, H.sheen, H);
  leg(s, tilt(p, 14, -13), p.frontNear, H.dark, H.sheen, H);
  head(s, p, H);
  sunRim(s, AC.rim, AC.rimSoft);
  s.outline(AC.outline);
  return s;
}
