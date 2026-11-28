import type { SpriteCanvas } from "../../../../engine/sprite";
import { RAIN_FOES as R } from "../../../../game/enemies/rain/colors";
import { glint } from "../../../../game/enemies/rain/detail";
import { mix } from "../../../../utils/color";
import { SNAPPER as C } from "./colors";

const CX = -1;
const RX = 13.5;
const RY = 12.5;
const SCUTE_ANGLES = [3.55, 4.15, 4.75, 5.3, 5.85] as const;
const MOSS = [
  [3.75, 1.5],
  [4.15, 1.9],
  [4.55, 1.7],
  [4.95, 1.8],
  [5.4, 1.4],
] as const;
const REEDS = [
  [-7, -15, -11, -27, 0.9, 1],
  [-4, -16, -3, -30, 0.8, 0],
  [-1, -17, 3, -25, 0.7, 0],
] as const;

type Pt = [number, number];

const onDome = (base: number, a: number, k: number): Pt => [CX + Math.cos(a) * RX * k, base + Math.sin(a) * RY * k];

function dome(s: SpriteCanvas, base: number): void {
  const pts: Pt[] = [];
  for (let a = Math.PI; a <= Math.PI * 2 + 0.01; a += 0.12) pts.push(onDome(base, a, 1));
  s.begin();
  s.poly(pts, C.shell);
  s.stroke(CX - RX + 0.5, base + 0.6, CX + RX - 0.5, base + 0.6, 1.4, C.plate);
  s.shadeEdges(C.shell, C.shellLight, C.shellDark, 2);
  s.shadeEdges(C.plate, C.plateLight, C.plateDark);
  for (let x = CX - RX + 1; x < CX + RX - 1; x += 3) s.set(x, base + 1.4, C.plateDark);
}

function scutes(s: SpriteCanvas, base: number, glow: number, time: number): void {
  const inner: Pt[] = SCUTE_ANGLES.map((a) => onDome(base, a, 0.55));
  for (let i = 0; i < inner.length - 1; i++) s.hairline(...inner[i], ...inner[i + 1], C.seam);
  SCUTE_ANGLES.forEach((a, i) => {
    const lit = glow > 0.2 ? Math.sin(time * 30 + i) > -0.4 : Math.sin(time * 2.2 + i * 1.3) > 0.6;
    const seam = lit ? mix(R.wart, R.wartHot, glow) : C.seam;
    s.hairline(...onDome(base, a, 0.55), ...onDome(base, a, 0.98), seam);
  });
  s.hairline(...onDome(base, 4.45, 0.55), ...onDome(base, 4.45, 0.1), C.seam);
  s.hairline(...onDome(base, 5.02, 0.55), ...onDome(base, 5.02, 0.1), C.seam);
  for (let i = 0; i < SCUTE_ANGLES.length - 1; i++) {
    const mid = (SCUTE_ANGLES[i] + SCUTE_ANGLES[i + 1]) / 2;
    const [x, y] = onDome(base, mid, 0.78);
    s.set(x - 0.5, y - 0.5, C.shellRim);
  }
  for (let a = 3.5; a < 4.6; a += 0.05) s.set(...onDome(base, a, 0.97), a < 4 ? R.wetSky : C.shellRim);
  glint(s, ...onDome(base, 3.9, 0.82), R.toadGlint);
}

function moss(s: SpriteCanvas, base: number, time: number): void {
  s.begin();
  for (const [a, r] of MOSS) s.dot(...onDome(base, a, 0.9), r, R.moss);
  MOSS.forEach(([a], i) => {
    const [x, y] = onDome(base, a + 0.12, 0.9);
    const sway = Math.sin(time * 1.5 + i) * 0.3;
    s.taper(x, y, x + sway - 0.3, y + 2.5 + (i % 2) * 1.5, 0.6, 0.3, R.moss);
  });
  s.stroke(CX - RX + 1.5, base + 0.2, CX - RX + 2, base + 3, 0.6, R.moss);
  s.stroke(CX + 3, base + 0.4, CX + 3.4, base + 2.6, 0.5, R.moss);
  s.shadeEdges(R.moss, R.mossLight, R.mossDeep);
  for (const [a] of MOSS) {
    const [x, y] = onDome(base, a - 0.08, 1.02);
    s.set(x, y, R.mossLight);
  }
  s.commit();
}

function reeds(s: SpriteCanvas, base: number, time: number): void {
  s.begin();
  REEDS.forEach(([x0, y0, x1, y1, r, head], i) => {
    const sway = Math.sin(time * 1.6 + i * 1.4) * 1.2;
    s.taper(x0, base + y0 + 4, x1 + sway, base + y1 + 4, r, 0.3, R.reed, 0.6);
    if (head) s.stroke(x1 + sway, base + y1 + 5, x1 + sway * 0.9 + 0.4, base + y1 + 8, 0.9, R.cattail);
  });
  s.shadeEdges(R.reed, R.reedLight, R.reedDark);
  s.shadeEdges(R.cattail, R.cattailLight, R.mudDeep);
  s.commit();
}

export function drawShell(s: SpriteCanvas, base: number, glow: number, time: number): void {
  reeds(s, base, time);
  dome(s, base);
  scutes(s, base, glow, time);
  s.commit();
  moss(s, base, time);
}
