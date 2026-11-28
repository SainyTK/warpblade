import { RAIN_FOES as R } from "../../../../game/enemies/rain/colors";
import { GATOR_COLORS as C } from "./colors";
import { at, TORSO } from "./frame";
import type { GatorPose } from "./pose";
import { type GatorCanvas, glintAt } from "./scaled";

const SCUTE_XS = [-12, -9.2, -6.4, -3.6, -0.8, 2, 4.8, 7.6] as const;
const MOSS = [
  [-7, -11, 1.4],
  [0, -12.5, 1.6],
  [6, -11.5, 1.2],
  [-3, -7, 1.1],
] as const;

function topAt(p: GatorPose, x: number): number {
  let top = 0;
  for (const [cx, cy, r] of TORSO) {
    const dx = x - cx;
    if (Math.abs(dx) >= r) continue;
    top = Math.min(top, at(p, cx, cy)[1] - Math.sqrt(r * r - dx * dx));
  }
  return top;
}

export function drawTorso(s: GatorCanvas, p: GatorPose, hide: number): void {
  s.begin();
  for (const [x, y, r] of TORSO) s.dot(...at(p, x, y), r, hide);
  s.stroke(...at(p, -12, -2.6), ...at(p, 9, -3.2), 1.6, R.belly);
  s.shadeEdges(hide, C.hideLight, C.hideDark, 2);
  s.shadeEdges(R.belly, R.bellyLight, R.bellyDark);
  for (const [x, y, r] of MOSS) s.dot(...at(p, x, y), r, R.moss);
  s.shadeEdges(R.moss, R.mossLight, R.mossDeep);
  for (let x = -10; x <= 8; x += 3) s.hairline(...at(p, x, -2.4), ...at(p, x + 0.6, -4.6), R.bellyDark);
  for (let x = -12; x <= 9; x += 3) s.set(...at(p, x + 1.5, -9.5 + Math.sin(x) * 0.8), C.hideDeep);
  const [mx, my] = at(p, -2, -8.6);
  for (let a = -2.7; a < -2; a += 0.05) s.set(mx + Math.cos(a) * 6.8, my + Math.sin(a) * 6.8, R.wetSky);
  const [fx, fy] = at(p, 5, -8.8);
  for (let a = -2.2; a < -1.3; a += 0.07) s.set(fx + Math.cos(a) * 6, fy + Math.sin(a) * 6, C.hideRim);
  glintAt(s, ...at(p, -6.5, -13.5), C.hideGlint);
  glintAt(s, ...at(p, 3, -14.5), C.hideGlint);
  s.commit();
}

export function drawScutes(s: GatorCanvas, p: GatorPose): void {
  const tips: [number, number][] = [];
  s.begin();
  SCUTE_XS.forEach((x) => {
    const top = topAt(p, x) + 0.9;
    const tall = 2.4 + Math.sin(x * 0.4 + 1) * 0.5;
    const lx = x + p.lean;
    s.poly(
      [
        [lx - 1.4, top + 0.6],
        [lx + 1.4, top + 0.6],
        [lx + 0.4, top - tall],
      ],
      C.scute,
    );
    tips.push([lx + 0.3, top - tall + 0.8]);
  });
  s.shadeEdges(C.scute, C.scuteLight, C.scuteDark);
  const wander = Math.floor(p.time * 4) % SCUTE_XS.length;
  tips.forEach(([x, y], i) => {
    const lit = i / SCUTE_XS.length < p.scutes * 1.15 || (i === wander && p.scutes > 0.2);
    s.block(x - 0.5, y, lit ? R.wart : R.veinDeep, 1, 1);
    if (lit && p.hot) s.set(x, y + 0.5, R.wartHot);
  });
  s.commit();
  if (p.scutes < 0.55) return;
  s.begin();
  for (let i = 0; i < tips.length - 1; i++) {
    if (Math.sin(p.time * 41 + i * 2.1) < 0.1) continue;
    const [ax, ay] = tips[i];
    const [bx, by] = tips[i + 1];
    const mx = (ax + bx) / 2;
    const my = Math.min(ay, by) - 1.5 - Math.sin(p.time * 53 + i) * 0.8;
    const c = p.scutes > 0.9 ? R.veinHot : R.kiteVein;
    s.hairline(ax, ay - 0.5, mx, my, c);
    s.hairline(mx, my, bx, by - 0.5, c);
  }
  s.commit(false);
}

export function drawWeed(s: GatorCanvas, p: GatorPose): void {
  s.begin();
  for (const x of [-8, -1, 5]) {
    const [hx, hy] = at(p, x, -2);
    const sway = Math.sin(p.time * 2.5 + x) * 0.7;
    s.hairline(hx, hy, hx + sway, Math.min(-0.3, hy + 2.4), C.weed);
    s.set(hx + sway * 0.5, Math.min(-0.5, hy + 1.2), C.weedLight);
  }
  for (const x of [-4, 2]) {
    const top = topAt(p, x) + 1.2;
    const sway = Math.sin(p.time * 2 + x) * 0.5;
    s.hairline(x + p.lean, top, x + p.lean - 0.8 + sway, top + 3.5, C.weed);
    s.set(x + p.lean, top + 0.4, C.weedLight);
  }
  s.commit(false);
}
