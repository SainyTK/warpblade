import { RAIN_FOES as R } from "../../../../game/enemies/rain/colors";
import { mix, WHITE } from "../../../../utils/color";
import { GATOR_COLORS as C } from "./colors";
import { across, add, at, JAW, NECK_X, type Point, SKULL, toward } from "./frame";
import type { GatorPose } from "./pose";
import { type GatorCanvas, glintAt } from "./scaled";

const along = (from: Point, dir: Point, side: Point, u: number, length: number, out: number): Point =>
  add(add(from, dir, u * length), side, out);

function throat(s: GatorCanvas, neck: Point, d: Point, n: Point, p: GatorPose): void {
  const swell = Math.max(0, p.throat);
  const center = add(add(neck, n, 3 + swell), d, 2.5 + swell);
  const r = 2.6 + swell * 2.6;
  const color = mix(C.throat, C.throatHot, Math.min(1, swell));
  s.begin();
  s.dot(center[0], center[1], r, color);
  s.shadeEdges(color, mix(color, WHITE, 0.4), C.throatDark, 2);
  if (swell > 0.3) {
    for (let k = -1; k <= 1; k++)
      s.hairline(...add(center, n, -r * 0.6 + k), ...add(add(center, d, r * 0.7), n, k), C.throatDark);
    glintAt(s, ...add(center, add(d, n, 1), -r * 0.45), WHITE);
  }
  s.commit();
}

function lowerJaw(s: GatorCanvas, neck: Point, p: GatorPose, hide: number): void {
  const angle = p.pitch + p.jaw * 0.6;
  const d = toward(angle);
  const n = across(angle);
  const base = add(neck, n, 2.2);
  const tip = add(base, d, JAW);
  s.begin();
  if (p.jaw > 0.1) {
    const top = add(neck, toward(p.pitch), SKULL - 1);
    s.poly([add(neck, n, 0.5), top, add(tip, n, -0.6)], C.mouth);
    s.hairline(...add(neck, n, 1), ...add(tip, n, -0.4), C.gum);
  }
  s.taper(base[0], base[1], tip[0], tip[1], 2.5, 1.3, hide);
  s.stroke(...add(base, n, 1.3), ...add(tip, n, 0.6), 0.8, C.throat);
  s.shadeEdges(hide, C.hideLight, C.hideDark);
  s.shadeEdges(C.throat, C.throatLight, C.throatDark);
  for (let u = 0.3; u <= 0.95; u += 0.11) {
    const r = 2.5 - 1.2 * u;
    const root = along(base, d, n, u, JAW, -r + 0.2);
    s.set(root[0], root[1], C.toothDark);
    s.set(...add(root, n, -0.6), u > 0.8 ? C.toothDark : C.tooth);
  }
  const weed = along(base, d, n, 0.45, JAW, 2);
  const sway = Math.sin(p.time * 3) * 0.6;
  s.hairline(weed[0], weed[1], weed[0] + sway, Math.min(-0.3, weed[1] + 3), C.weed);
  s.commit();
}

function skull(s: GatorCanvas, neck: Point, p: GatorPose, hide: number): void {
  const d = toward(p.pitch);
  const n = across(p.pitch);
  const tip = add(neck, d, SKULL);
  const brow = add(add(neck, d, 3.2), n, -3.4);
  const nose = add(add(tip, d, -1.8), n, -1.9);
  s.begin();
  s.taper(...add(neck, n, -0.4), tip[0], tip[1], 4.5, 2.1, hide);
  s.dot(brow[0], brow[1], 2.1, hide);
  s.dot(nose[0], nose[1], 1.2, hide);
  s.shadeEdges(hide, C.hideLight, C.hideDark, 2);
  for (let u = 0.35; u < 0.85; u += 0.16) s.set(...along(neck, d, n, u, SKULL, -2.2), C.hideDark);
  s.hairline(...along(neck, d, n, 0.32, SKULL, -3.6), ...along(neck, d, n, 0.86, SKULL, -2.2), R.wetSky);
  glintAt(s, ...add(brow, n, -1.6), C.hideGlint);
  s.set(nose[0], nose[1] - 0.6, C.hideGlint);
  s.set(nose[0] + 0.5, nose[1] + 0.2, C.hideDeep);
  for (let u = 0.25; u <= 0.97; u += 0.1) {
    const r = 4.5 - 2.4 * u;
    const root = along(neck, d, n, u, SKULL, r - 0.4);
    s.set(root[0], root[1], u > 0.85 ? C.toothDark : C.tooth);
    if (Math.round(u * 10) % 2) s.set(...add(root, n, 0.6), C.tooth);
  }
  s.hairline(...along(neck, d, n, 0.1, SKULL, 2), ...along(neck, d, n, 0.95, SKULL, 1.6), C.hideDeep);
  s.commit();
  s.begin();
  const eye = add(brow, n, 0.3);
  s.dot(eye[0], eye[1], 1.1, C.hideDeep);
  s.dot(eye[0], eye[1] - 0.1, 0.6, p.hot ? C.eye : mix(C.eye, C.hideDeep, 0.3));
  glintAt(s, eye[0] - 0.25, eye[1] - 0.25, p.hot ? C.eyeHot : C.eye);
  s.set(eye[0] - 0.25, eye[1] + 0.25, p.hot ? C.eye : mix(C.eye, C.hideDeep, 0.4));
  s.commit(false);
}

export function drawHead(s: GatorCanvas, p: GatorPose, hide: number): void {
  const neck = at(p, NECK_X, -10);
  throat(s, neck, toward(p.pitch), across(p.pitch), p);
  lowerJaw(s, neck, p, hide);
  skull(s, neck, p, hide);
}
