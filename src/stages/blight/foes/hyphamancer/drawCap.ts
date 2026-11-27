import type { SpriteCanvas } from "../../../../engine/sprite";
import { BLIGHT } from "../../colors";
import { HYPHA_TONES } from "./colors";
import type { HyphaPose } from "./pose";

const C = HYPHA_TONES.cap;
const G = HYPHA_TONES.gill;
const RX = 11.5;
const RY = 7.5;
const RIM = -32;

type Pt = [number, number];

function dome(cx: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= 16; i++) {
    const a = Math.PI + (i / 16) * Math.PI;
    const droop = Math.abs(Math.cos(a)) ** 4 * 2;
    pts.push([cx + Math.cos(a) * RX, RIM + Math.sin(a) * RY + droop]);
  }
  pts.push([cx + RX - 2, RIM + 1.5]);
  pts.push([cx - RX + 2, RIM + 1.5]);
  return pts;
}

const SPOTS: readonly (readonly [number, number, number])[] = [
  [-6, -4.5, 1.3],
  [-1, -6.2, 1],
  [4, -5, 1.2],
  [7.5, -2.2, 0.8],
  [-8.5, -1.6, 0.8],
];

export function face(s: SpriteCanvas, p: HyphaPose, fierce: boolean): void {
  const cx = 5 + p.lean;
  s.begin();
  s.dot(cx + 2, -28.5, 3.2, HYPHA_TONES.husk[1]);
  s.shadeEdges(HYPHA_TONES.husk[1], HYPHA_TONES.husk[3], HYPHA_TONES.husk[0]);
  s.commit();
  s.begin();
  s.hairline(cx + 1.5, -26, cx + 4.5, -26.3, HYPHA_TONES.bone[1]);
  s.set(cx + 2.5, -26, HYPHA_TONES.bone[2]);
  s.set(cx + 4, -26, HYPHA_TONES.bone[2]);
  const eye = fierce ? BLIGHT.eyeHot : BLIGHT.eye;
  s.block(cx + 2, -29, eye, 1.5, 1);
  s.block(cx + 4.5, -28.5, eye, 1.5, 1);
  s.set(cx + 2, -29, BLIGHT.eyeHot);
  s.set(cx + 4.5, -28.5, BLIGHT.eyeHot);
  s.commit(false);
}

export function cap(s: SpriteCanvas, p: HyphaPose, time: number): void {
  const cx = 5 + p.lean;
  s.begin();
  s.poly(dome(cx), C[2]);
  s.shadeEdges(C[2], C[3], C[1], 2);
  s.commit();
  s.begin();
  for (let x = -RX + 2; x <= RX - 2; x += 0.5) {
    const glowing = p.gills > 0.5 && Math.sin(time * 9 + x * 1.3) > 0.2 - p.gills;
    const rib = Math.round(x * 2) % 2 === 0;
    s.set(cx + x, RIM + 1, rib ? G[1] : BLIGHT.maw);
    s.set(cx + x, RIM + 1.5, rib ? (glowing ? G[4] : G[2]) : BLIGHT.maw);
    if (Math.abs(x) < RX - 3.5) s.set(cx + x, RIM + 2, rib && glowing ? G[3] : BLIGHT.maw);
  }
  s.commit(false);
  s.begin();
  for (const [u, v, r] of SPOTS) {
    s.dot(cx + u, RIM + v, r * 0.85, C[3]);
    s.set(cx + u - r * 0.3, RIM + v - r * 0.3, HYPHA_TONES.bone[3]);
    s.set(cx + u + r * 0.4, RIM + v + r * 0.3, C[1]);
  }
  s.commit(false);
  s.begin();
  for (let i = 0; i <= 8; i++) {
    const a = Math.PI * 1.08 + (i / 8) * Math.PI * 0.5;
    s.set(cx + Math.cos(a) * (RX - 1), RIM + Math.sin(a) * (RY - 1), C[4]);
  }
  s.set(cx - 7, RIM - 5.5, C[4]);
  s.set(cx + 9, RIM - 1, BLIGHT.rot[3]);
  s.set(cx + 8, RIM - 0.5, BLIGHT.rot[2]);
  s.commit(false);
}
