import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { FOE } from "../colors";
import { type ClawPose, clawPose, type Pt } from "./pose";

const canvas = detailCanvas(128, 84, 64, 76);
const L = FOE.lynx;
const C = FOE.crystal;
const S = FOE.spine;

const SPOTS: readonly Pt[] = [
  [-20, -25],
  [-14, -20],
  [-8, -27],
  [-3, -19],
  [3, -25],
  [-24, -17],
  [8, -20],
];

function crystal(s: SpriteCanvas, pts: readonly Pt[], base: Color, light: Color, dark: Color, edge: Color): void {
  s.begin();
  s.poly(pts, base);
  s.shadeEdges(base, light, dark);
  s.hairline(pts[0][0], pts[0][1], pts[1][0], pts[1][1], edge);
  s.commit();
}

function tail(s: SpriteCanvas, p: ClawPose): void {
  const base: Pt = [-27, -27 + p.lift + p.haunch];
  const [mx, my] = p.tailMid;
  const [tx, ty] = p.tailTip;
  s.begin();
  s.taper(base[0], base[1], mx, my + p.lift, 3.4, 2.6, L[2], 0.8);
  s.taper(mx, my + p.lift, tx, ty + p.lift, 2.6, 1.6, L[2], -0.6);
  s.shadeEdges(L[2], L[3], L[1], 2);
  for (const u of [0.35, 0.7])
    s.dot(base[0] + (mx - base[0]) * u, base[1] + (my + p.lift - base[1]) * u, 1.2, FOE.stripe);
  s.commit();
  const hot = p.tailGlow;
  for (let i = 0; i < 3; i++) {
    const ang = Math.atan2(ty - my, tx - mx) + (i - 1) * 0.55;
    const len = 5 + (i === 1 ? 3 : 0);
    const x = tx;
    const y = ty + p.lift;
    crystal(
      s,
      [
        [x + Math.cos(ang) * len, y + Math.sin(ang) * len],
        [x - Math.sin(ang) * 1.4, y + Math.cos(ang) * 1.4],
        [x + Math.sin(ang) * 1.4, y - Math.cos(ang) * 1.4],
      ],
      hot ? C[3] : C[1],
      C[4],
      C[0],
      C[4],
    );
  }
}

function leg(s: SpriteCanvas, hip: Pt, paw: Pt, near: boolean, hind: boolean): void {
  const tone = near ? L[2] : L[1];
  const knee: Pt = hind
    ? [(hip[0] + paw[0]) / 2 + 4, (hip[1] + paw[1]) / 2 - 1]
    : [(hip[0] + paw[0]) / 2 - 1, (hip[1] + paw[1]) / 2];
  const hock: Pt = hind ? [paw[0] - 2, paw[1] - 5] : [paw[0], paw[1] - 3];
  s.begin();
  s.stroke(hip[0], hip[1], knee[0], knee[1], near ? 4.6 : 4, tone);
  s.stroke(knee[0], knee[1], hock[0], hock[1], near ? 3.2 : 2.8, tone);
  s.stroke(hock[0], hock[1], paw[0], paw[1] - 2, near ? 2.8 : 2.5, tone);
  s.poly(
    [
      [paw[0] - 2.5, paw[1] - 4],
      [paw[0] + 3, paw[1] - 4],
      [paw[0] + 4.5, paw[1]],
      [paw[0] - 2.5, paw[1]],
    ],
    near ? L[3] : L[1],
  );
  s.shadeEdges(tone, near ? L[3] : L[2], near ? L[1] : L[0], 2);
  s.commit();
  if (!near) return;
  s.begin();
  s.hairline(paw[0] + 0.5, paw[1] - 1.5, paw[0] + 0.5, paw[1] - 0.2, L[0]);
  s.hairline(paw[0] + 2.5, paw[1] - 1.5, paw[0] + 2.5, paw[1] - 0.2, L[0]);
  s.set(paw[0] + 4.5, paw[1] - 0.5, C[4]);
  s.set(paw[0] + 4.5, paw[1] - 1, C[3]);
  s.set(knee[0] - 1, knee[1] + 1, FOE.stripe);
  s.commit();
}

function torso(s: SpriteCanvas, p: ClawPose): void {
  const y = p.lift;
  s.begin();
  s.dot(-17, -22 + y + p.haunch, 10.5, L[2]);
  s.dot(-3, -23 + y, 10.5, L[2]);
  s.dot(13, -24 + y + p.pitch, 11.5, L[2]);
  s.stroke(-18, -19 + y, 14, -19 + y + p.pitch * 0.5, 8, L[2]);
  s.shadeEdges(L[2], L[3], L[1], 3);
  s.stroke(-14, -11 + y, 12, -12 + y + p.pitch * 0.5, 1.2, L[1]);
  for (const [x, sy] of SPOTS) {
    s.hairline(x, sy + y, x + 1, sy + y + 2, L[1]);
    s.set(x + 0.5, sy + y + 0.5, FOE.stripe);
  }
  s.hairline(-24, -31 + y + p.haunch, 6, -35 + y + p.pitch, L[4]);
  s.commit();
  const cy = -24 + y + p.pitch;
  s.begin();
  s.poly(
    [
      [16, cy - 9],
      [25, cy - 5],
      [26, cy + 3],
      [23.5, cy + 1],
      [22.5, cy + 7],
      [20, cy + 3],
      [18, cy + 9],
      [15, cy + 1],
    ],
    L[3],
  );
  s.shadeEdges(L[3], L[4], L[2]);
  s.commit();
}

function plates(s: SpriteCanvas, p: ClawPose): void {
  const y = p.lift;
  const py = p.pitch;
  crystal(
    s,
    [
      [6, -37 + y + py],
      [20, -35 + y + py],
      [18, -29 + y + py],
      [5, -31 + y + py],
    ],
    C[1],
    C[3],
    C[0],
    C[4],
  );
  for (const [x, h] of [
    [-22, 5],
    [-14, 6],
    [-6, 6],
    [1, 5],
  ] as const) {
    const top = -33 + y + (x < -10 ? p.haunch : 0) - (x > -4 ? py * 0.3 : 0);
    crystal(
      s,
      [
        [x - 3, top - h * 0.7],
        [x + 3.5, top],
        [x - 4, top + 2],
      ],
      C[1],
      C[3],
      C[0],
      C[4],
    );
  }
}

function spines(s: SpriteCanvas, p: ClawPose): void {
  if (p.spines <= 0) return;
  const y = p.lift;
  const hot = p.spineGlow > 0.6;
  for (let i = 0; i < 7; i++) {
    const x = -24 + i * 6;
    const len = (11 + (i % 2) * 6 + (i === 3 ? 4 : 0)) * p.spines;
    if (len < 1) continue;
    const base = -33 + y - (x > -4 ? p.pitch * 0.3 : 0) + (x < -10 ? p.haunch : 0);
    const lean = -0.35 - i * 0.04;
    crystal(
      s,
      [
        [x + Math.sin(lean) * len, base - Math.cos(lean) * len],
        [x + 2.4, base + 1],
        [x - 2.4, base + 1],
      ],
      hot ? S[2] : S[1],
      S[3],
      S[0],
      hot ? S[3] : S[2],
    );
  }
}

function ear(s: SpriteCanvas, x: number, y: number, near: boolean): void {
  const tone = near ? L[2] : L[1];
  s.begin();
  s.poly(
    [
      [x - 3, y],
      [x + 0.5, y - 11],
      [x + 3.5, y + 1],
    ],
    tone,
  );
  s.shadeEdges(tone, near ? L[4] : L[2], L[0]);
  s.hairline(x - 2.6, y - 0.5, x + 0.3, y - 10.5, FOE.stripe);
  if (near) s.hairline(x, y - 2, x + 0.8, y - 7, FOE.lynx[0]);
  s.commit();
  crystal(
    s,
    [
      [x + 1.2, y - 18],
      [x + 1.6, y - 10.5],
      [x - 0.4, y - 10.8],
    ],
    near ? C[2] : C[1],
    C[4],
    C[0],
    C[4],
  );
}

function head(s: SpriteCanvas, p: ClawPose): void {
  const [hx, hy0] = p.head;
  const hy = hy0 + p.lift;
  s.begin();
  s.stroke(16, -27 + p.lift + p.pitch, hx - 3, hy + 2, 7, L[2]);
  s.shadeEdges(L[2], L[3], L[1], 2);
  s.commit();
  ear(s, hx - 4, hy - 5, false);
  s.begin();
  s.dot(hx, hy, 8.2, L[3]);
  s.shadeEdges(L[3], L[4], L[1], 2);
  s.commit();
  ear(s, hx + 1, hy - 6, true);
  s.begin();
  s.poly(
    [
      [hx - 3, hy + 1],
      [hx - 10, hy + 9],
      [hx - 5, hy + 8.5],
      [hx - 4, hy + 13],
      [hx - 0.5, hy + 9],
      [hx + 2, hy + 12],
      [hx + 4, hy + 7],
      [hx + 5, hy + 4],
    ],
    L[4],
  );
  s.shadeEdges(L[4], FOE.eyeHot, L[2]);
  s.hairline(hx - 6, hy + 5, hx - 3, hy + 9, FOE.stripe);
  s.hairline(hx - 2.5, hy + 5, hx - 0.5, hy + 9.5, FOE.stripe);
  s.commit();
  const open = p.jaw * 5;
  s.begin();
  s.dot(hx + 6, hy + 2.6, 3.6, L[4]);
  s.shadeEdges(L[4], FOE.eyeHot, L[2]);
  s.commit();
  if (open > 0.6) {
    s.begin();
    s.poly(
      [
        [hx + 3, hy + 4],
        [hx + 10, hy + 3.5],
        [hx + 9, hy + 4 + open],
        [hx + 3, hy + 5 + open * 0.6],
      ],
      p.mouthGlow > 0.3 ? C[2] : FOE.nose,
    );
    s.set(hx + 8.5, hy + 4.5, FOE.eyeHot);
    s.set(hx + 8.5, hy + 3.5 + open, FOE.eyeHot);
    s.set(hx + 5.5, hy + 4.5, FOE.eyeHot);
    s.commit();
    s.begin();
    s.stroke(hx + 3, hy + 5 + open * 0.6, hx + 8.5, hy + 4.5 + open, 1.1, L[3]);
    s.shadeEdges(L[3], L[4], L[1]);
    s.commit();
  }
  s.begin();
  s.poly(
    [
      [hx + 8, hy - 0.2],
      [hx + 10, hy - 0.2],
      [hx + 9.2, hy + 1.4],
    ],
    FOE.nose,
  );
  s.hairline(hx + 9.2, hy + 1.4, hx + 9.2, hy + 3, L[1]);
  s.hairline(hx + 6.5, hy + 3.6, hx + 9.2, hy + 3, L[1]);
  s.block(hx + 3, hy - 2.5, p.glare ? FOE.amberHot : FOE.amber, 2, 1);
  s.set(hx + 4, hy - 2.5, FOE.nose);
  s.set(hx + 4, hy - 2, FOE.nose);
  s.hairline(hx + 2.5, hy - 3, hx + 5.5, hy - 3.5, FOE.nose);
  s.hairline(hx + 3, hy - 1, hx + 5, hy - 1, L[4]);
  s.hairline(hx - 1, hy - 7, hx - 0.5, hy - 3.5, FOE.stripe);
  s.hairline(hx + 1, hy - 7.5, hx + 1.2, hy - 4.5, FOE.stripe);
  s.hairline(hx - 3, hy - 5, hx - 3, hy - 2, FOE.stripe);
  s.commit();
}

export function drawRimeclaw(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = clawPose(e, time);
  const y = p.lift;
  s.clear();
  tail(s, p);
  leg(s, [-19, -18 + y + p.haunch], p.hindFar, false, true);
  leg(s, [12, -18 + y + p.pitch * 0.5], p.frontFar, false, false);
  torso(s, p);
  spines(s, p);
  plates(s, p);
  leg(s, [-15, -17 + y + p.haunch], p.hindNear, true, true);
  leg(s, [17, -17 + y + p.pitch * 0.5], p.frontNear, true, false);
  head(s, p);
  s.outline(FOE.outline);
  if (e.state === "swipe") {
    s.begin();
    for (let i = 0; i < 5; i++) s.hairline(-60 + i * 4, -2 - i * 0.6, -30 + i * 2, -6 - i * 1.4, C[4 - (i % 2)]);
    s.commit(false);
  }
  return s;
}
