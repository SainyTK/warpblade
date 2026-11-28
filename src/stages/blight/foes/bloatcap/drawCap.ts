import type { SpriteCanvas } from "../../../../engine/sprite";
import { BLIGHT } from "../../colors";
import { BLOAT_TONES } from "./colors";
import type { BloatPose } from "./pose";

type Pt = [number, number];

export const CAP = { rx: 15, ry: 12, cy: -3, lip: 2.4 } as const;

const C = BLOAT_TONES.cap;
const F = BLOAT_TONES.flesh;
const W = BLOAT_TONES.wart;
const WARTS: readonly (readonly [number, number, number])[] = [
  [-0.55, -0.55, 1.6],
  [-0.05, -0.85, 1.3],
  [0.45, -0.6, 1.5],
  [-0.8, -0.15, 1],
  [0.78, -0.2, 1.1],
  [0.2, -0.35, 0.8],
  [-0.3, -0.25, 0.7],
];

function capOutline(ry: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= 24; i++) {
    const a = Math.PI + (i / 24) * Math.PI;
    const bulge = 1 + Math.sin(a * 2) * 0.03;
    pts.push([Math.cos(a) * CAP.rx * bulge, CAP.cy + Math.sin(a) * ry]);
  }
  for (let i = 1; i < 12; i++) {
    const u = i / 12;
    const x = CAP.rx - u * CAP.rx * 2;
    const sag = (1 - (x / CAP.rx) ** 2) * 1.2;
    pts.push([x, CAP.cy + CAP.lip - sag]);
  }
  return pts;
}

function dome(s: SpriteCanvas, ry: number): void {
  s.begin();
  s.poly(capOutline(ry), C[2]);
  s.shadeEdges(C[2], C[3], C[1], 2);
  s.commit();
  s.begin();
  for (let x = -CAP.rx + 1; x <= CAP.rx - 1; x += 0.5) {
    const sag = (1 - (x / CAP.rx) ** 2) * 1.2;
    const edge = CAP.cy + CAP.lip - sag;
    s.set(x, edge - 0.5, F[2]);
    s.set(x, edge - 1, Math.abs(x) > CAP.rx * 0.7 ? F[1] : F[3]);
    if (Math.abs(x) < CAP.rx * 0.8) s.set(x, edge - 1.5, F[2]);
  }
  s.commit(false);
}

function inside(x: number, y: number, ry: number, margin: number): boolean {
  const sag = (1 - (x / CAP.rx) ** 2) * 1.2;
  if (y > CAP.cy + CAP.lip - sag - 2) return false;
  return (x / CAP.rx) ** 2 + ((y - CAP.cy) / ry) ** 2 < margin;
}

function volume(s: SpriteCanvas, ry: number): void {
  s.begin();
  for (let y = CAP.cy - ry; y <= CAP.cy + CAP.lip; y += 0.5)
    for (let x = -CAP.rx; x <= CAP.rx; x += 0.5) {
      if (!inside(x, y, ry, 0.9)) continue;
      const lit = ((x + 5) / 7) ** 2 + ((y - CAP.cy + ry * 0.55) / (ry * 0.42)) ** 2;
      const low = (y - CAP.cy + ry * 0.2) / (ry * 0.3) + x / (CAP.rx * 2.5);
      const checker = (Math.round(x * 2) + Math.round(y * 2)) % 2 === 0;
      if (lit < 0.55) s.set(x, y, C[3]);
      else if (lit < 1 && checker) s.set(x, y, C[3]);
      else if (low > 0.6) s.set(x, y, C[1]);
      else if (low > 0.35 && checker) s.set(x, y, C[1]);
    }
  s.commit(false);
}

function sheen(s: SpriteCanvas, ry: number, hot: boolean): void {
  s.begin();
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI * 1.12 + i * 0.07;
    s.set(Math.cos(a) * (CAP.rx - 1.2), CAP.cy + Math.sin(a) * (ry - 1.2), C[4]);
  }
  s.set(-CAP.rx * 0.45, CAP.cy - ry * 0.72, hot ? BLIGHT.eyeHot : C[4]);
  s.set(-CAP.rx * 0.45 + 0.5, CAP.cy - ry * 0.75, C[4]);
  s.commit(false);
}

function warts(s: SpriteCanvas, ry: number): void {
  s.begin();
  for (const [u, v, r] of WARTS) s.dot(u * CAP.rx, CAP.cy + v * ry, r, W[1]);
  s.shadeEdges(W[1], W[3], W[0]);
  s.commit(false);
  s.begin();
  for (const [u, v, r] of WARTS) s.set(u * CAP.rx - r * 0.4, CAP.cy + v * ry - r * 0.4, W[3]);
  s.commit(false);
}

function veins(s: SpriteCanvas, ry: number, pulse: number): void {
  s.begin();
  const vein = pulse > 0.5 ? BLIGHT.vein[2] : BLIGHT.vein[1];
  s.hairline(-9, CAP.cy - 0.5, -6, CAP.cy - ry * 0.35, vein);
  s.hairline(-6, CAP.cy - ry * 0.35, -7.5, CAP.cy - ry * 0.6, vein);
  s.hairline(7, CAP.cy - 0.2, 9.5, CAP.cy - ry * 0.4, vein);
  s.hairline(2, CAP.cy, 3, CAP.cy - ry * 0.18, vein);
  s.commit(false);
}

export function drawCap(s: SpriteCanvas, p: BloatPose, time: number): void {
  const ry = CAP.ry * p.squash;
  dome(s, ry);
  volume(s, ry);
  warts(s, ry);
  veins(s, ry, p.open > 0.3 ? 1 : (Math.sin(time * 2.4) + 1) / 2);
  sheen(s, ry, p.open > 0.8);
}
