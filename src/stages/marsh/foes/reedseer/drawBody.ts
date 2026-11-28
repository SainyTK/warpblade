import type { SpriteCanvas } from "../../../../engine/sprite";
import { RAIN_FOES as R } from "../../../../game/enemies/rain/colors";
import { glint } from "../../../../game/enemies/rain/detail";
import { lerp } from "../../../../utils/math";
import { SEER as C } from "./colors";
import type { SeerPose } from "./pose";

type Pt = [number, number];

const TAIL_SPOTS = [0.3, 0.55, 0.78] as const;
const SPINE = [
  [-1, -11, 3.6],
  [-0.4, -15, 3.8],
  [0.4, -19, 3.5],
  [1.2, -22.5, 3],
  [2, -25.5, 2.4],
] as const;

export const spineAt = (p: SeerPose, i: number): Pt => {
  const [x, y] = SPINE[i];
  const k = (-y - 10) / 16;
  return [x + p.lean * k, y + p.bob * k];
};

export function drawTail(s: SpriteCanvas, p: SeerPose, time: number): void {
  const endX = -17;
  const endY = -1.5 - p.tail * 5;
  s.begin();
  s.taper(-2, -10, endX, endY, 3, 0.6, C.skin, -2);
  s.shadeEdges(C.skin, C.skinLight, C.skinDark, 2);
  TAIL_SPOTS.forEach((u, i) => {
    const lit = Math.sin(time * 2.5 + i * 1.8) > 0.3;
    const x = lerp(-3, endX, u);
    const y = lerp(-11, endY, u) - 0.6 + u;
    s.block(x, y, lit ? R.wart : C.spot, 1, 1);
  });
  s.commit();
}

function leg(s: SpriteCanvas, hip: Pt, side: number, p: SeerPose, color: number): void {
  const swing = p.step * side * 2;
  const knee: Pt = [hip[0] + 3 + swing * 0.5, hip[1] + 4.5];
  const foot: Pt = [hip[0] + 0.5 + swing, -1];
  s.taper(hip[0], hip[1], knee[0], knee[1], 2.2, 1.4, color);
  s.taper(knee[0], knee[1], foot[0], foot[1], 1.4, 1, color);
  s.stroke(foot[0] - 1, -0.6, foot[0] + 2.4, -0.6, 0.7, color);
  for (let i = 0; i < 3; i++) s.set(foot[0] + 3 - i * 1, -0.1 - (i === 1 ? 0.4 : 0), color);
}

export function drawLegs(s: SpriteCanvas, p: SeerPose, near: boolean): void {
  s.begin();
  if (near) leg(s, [0, -10], 1, p, C.skin);
  else leg(s, [-2, -10.5], -1, p, C.skinDark);
  if (near) s.shadeEdges(C.skin, C.skinLight, C.skinDark);
  else s.shadeEdges(C.skinDark, C.skin, C.skinDeep);
  s.commit();
}

export function drawTorso(s: SpriteCanvas, p: SeerPose): void {
  s.begin();
  SPINE.forEach(([, , r], i) => s.dot(...spineAt(p, i), r, C.skin));
  s.shadeEdges(C.skin, C.skinLight, C.skinDark, 2);
  for (let i = 0; i < SPINE.length; i++) {
    const [x, y] = spineAt(p, i);
    s.dot(x + SPINE[i][2] * 0.55, y + 0.4, SPINE[i][2] * 0.5, C.throat);
  }
  s.shadeEdges(C.throat, C.throatLight, C.throatDark);
  for (let i = 1; i < SPINE.length; i++) {
    const [x, y] = spineAt(p, i);
    s.hairline(x + 0.6, y + 0.4, x + SPINE[i][2] * 0.9, y + 0.2, C.throatDark);
  }
  s.commit();
}

export function drawShawl(s: SpriteCanvas, p: SeerPose, time: number): void {
  const [nx, ny] = spineAt(p, 4);
  const [sx, sy] = spineAt(p, 3);
  const flutter = Math.sin(time * 2.2) * 0.8;
  const hem: Pt[] = [];
  for (let i = 0; i <= 6; i++) hem.push([lerp(2.5, -8.5, i / 6) + flutter * (i / 6), -9 + (i % 2 ? 1.6 : 0) + i * 0.2]);
  const outline: Pt[] = [
    [nx - 2.5, ny - 1.8],
    [nx + 0.5, ny - 1.5],
    [sx - 0.5, sy + 2],
    ...hem,
    [-6.5 + flutter * 0.4, -17],
  ];
  s.begin();
  s.poly(outline, R.reed);
  s.shadeEdges(R.reed, R.reedLight, R.reedDark, 2);
  for (let i = 1; i < 6; i++) {
    const u = i / 6;
    const top: Pt = [lerp(nx - 2.2, sx - 0.8, u), lerp(ny - 1.6, sy + 2, u)];
    const bottom = hem[Math.min(6, Math.round(u * 6))];
    s.hairline(top[0], top[1] + 0.5, bottom[0], bottom[1] - 1, i % 2 ? R.reedDark : R.reedLight);
  }
  for (const k of [0.35, 0.7]) {
    const a: Pt = [lerp(nx - 2.5, -8, k), lerp(ny - 1.8, -9, k)];
    const b: Pt = [lerp(sx - 0.5, 2.5, k), lerp(sy + 2, -9, k)];
    s.hairline(a[0], a[1], b[0], b[1], R.cattailLight);
  }
  s.hairline(nx - 2.4, ny - 1.4, -7, -16, R.wetSky);
  glint(s, nx - 1.5, ny - 1.2, R.toadGlint);
  s.commit();
  s.begin();
  for (let i = 0; i < 3; i++) {
    const x = nx - 2 - i * 1.6;
    s.taper(x, ny - 1, x - 1.5 - i, ny - 7 - i * 0.6 + Math.sin(time * 1.8 + i) * 0.5, 0.9, 0.25, R.reed, 0.4);
  }
  s.shadeEdges(R.reed, R.reedLight, R.reedDark);
  s.commit();
}
