import type { SpriteCanvas } from "../../../../engine/sprite";
import { RAIN_FOES as R } from "../../../../game/enemies/rain/colors";
import { glint } from "../../../../game/enemies/rain/detail";
import { mix, WHITE } from "../../../../utils/color";
import { SEER as C } from "./colors";
import { spineAt } from "./drawBody";
import type { SeerPose } from "./pose";

const GILLS = [-2.9, -2.15, -1.45] as const;

export const headAt = (p: SeerPose): [number, number] => [4 + p.lean * 1.1, -28.8 + p.bob];

export function drawGills(s: SpriteCanvas, p: SeerPose, time: number, near: boolean): void {
  const [hx, hy] = headAt(p);
  const bx = hx - 2.8;
  const by = hy + (near ? 0.4 : -0.6);
  s.begin();
  GILLS.forEach((a, i) => {
    const len = 4.2 + p.flare * 2 + Math.sin(time * 3 + i) * 0.4;
    const ang = a - (near ? 0 : 0.25) + Math.sin(time * 2.5 + i) * 0.08;
    const ex = bx + Math.cos(ang) * len;
    const ey = by + Math.sin(ang) * len;
    s.taper(bx, by, ex, ey, 0.8, 0.45, near ? C.gill : C.gillDeep);
    for (let k = 0.35; k < 1; k += 0.25) {
      const fx = bx + (ex - bx) * k;
      const fy = by + (ey - by) * k;
      s.hairline(fx, fy, fx - 0.4, fy - 1.1, near ? C.gillLight : C.gill);
    }
    const hot = p.flare > 0.6 && Math.sin(time * 40 + i * 2) > -0.2;
    s.block(ex - 0.5, ey - 0.5, hot ? R.wartHot : near ? R.wart : C.gill, 1, 1);
  });
  if (near) s.shadeEdges(C.gill, C.gillLight, C.gillDeep);
  s.commit();
}

export function drawHead(s: SpriteCanvas, p: SeerPose): void {
  const [hx, hy] = headAt(p);
  s.begin();
  s.dot(hx - 0.4, hy, 3.4, C.skin);
  s.dot(hx + 2.8, hy + 0.6, 2.6, C.skin);
  s.dot(hx + 4.4, hy + 0.9, 1.8, C.skin);
  s.shadeEdges(C.skin, C.skinLight, C.skinDark, 2);
  s.stroke(hx - 0.5, hy + 2.6, hx + 4.6, hy + 2.3, 0.75, C.throat);
  s.shadeEdges(C.throat, C.throatLight, C.throatDark);
  for (let x = hx + 0.6; x < hx + 6; x += 0.25) s.set(x, hy + 1.5 + (x - hx - 3) * (x - hx - 3) * 0.03, C.skinDeep);
  s.dot(hx - 2, hy - 1.4, 0.6, C.spot);
  s.dot(hx + 3.4, hy - 0.9, 0.5, C.spot);
  for (let a = -2.8; a < -1.2; a += 0.06) s.set(hx - 0.4 + Math.cos(a) * 3.2, hy + Math.sin(a) * 3.2, R.wetSky);
  s.dot(hx + 1.6, hy - 1.7, 1.45, R.outline);
  s.dot(hx + 1.8, hy - 1.75, 1, p.charge > 0.5 ? mix(R.wart, WHITE, p.charge) : R.wart);
  s.set(hx + 2.1, hy - 1.7, p.charge > 0.5 ? WHITE : C.eye);
  s.set(hx + 1.2, hy - 2.4, WHITE);
  glint(s, hx - 1.8, hy - 2.7, R.kiteGlint);
  s.commit();
}

export function drawArm(s: SpriteCanvas, p: SeerPose): void {
  const [sx, sy] = spineAt(p, 3);
  const [hx, hy] = p.hand;
  s.begin();
  s.taper(sx + 1, sy, hx, hy, 1.3, 0.9, C.skin, 0.8);
  s.shadeEdges(C.skin, C.skinLight, C.skinDark);
  s.commit();
  s.begin();
  s.dot(hx, hy, 1.25, C.skin);
  s.set(hx + 0.9, hy + 0.6, C.skinLight);
  s.shadeEdges(C.skin, C.skinLight, C.skinDark);
  s.commit();
}
