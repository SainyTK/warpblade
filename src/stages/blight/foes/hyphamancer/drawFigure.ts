import type { SpriteCanvas } from "../../../../engine/sprite";
import { BLIGHT } from "../../colors";
import { HYPHA_TONES } from "./colors";
import type { HyphaPose } from "./pose";

const T = HYPHA_TONES.thread;
const H = HYPHA_TONES.husk;

function leg(s: SpriteCanvas, hipX: number, footX: number, lift: number, near: boolean): void {
  const base = near ? T[1] : T[0];
  const kneeX = (hipX + footX) / 2 + 2;
  s.begin();
  s.stroke(hipX, -13, kneeX, -6.5 - lift, 1.25, base);
  s.stroke(kneeX, -6.5 - lift, footX, -lift * 0.5, 1, base);
  s.dot(footX + 1, -0.6 - lift * 0.5, 1.2, base);
  if (near) s.shadeEdges(base, T[2], T[0]);
  s.commit();
  if (!near) return;
  s.begin();
  s.hairline(hipX - 1, -11, kneeX + 1, -8.5 - lift, T[3]);
  s.hairline(kneeX - 1, -4.5 - lift, footX + 1, -2 - lift * 0.5, T[3]);
  s.commit(false);
}

export function legs(s: SpriteCanvas, p: HyphaPose, near: boolean): void {
  const swing = p.stride * 3;
  const side = near ? 1 : -1;
  leg(s, near ? 1 : -2, (near ? 2 : -3) + swing * side, Math.max(0, swing * side) * 0.5, near);
}

export function backArm(s: SpriteCanvas, p: HyphaPose, time: number): void {
  const sx = p.lean - 1;
  const sway = Math.sin(time * 1.8) * 0.8;
  s.begin();
  s.stroke(sx, -24, sx - 3 + sway, -17, 1, T[0]);
  s.stroke(sx - 3 + sway, -17, sx - 2 + sway, -11.5, 0.8, T[0]);
  s.taper(sx - 2 + sway, -11.5, sx - 1 + sway, -8.5, 0.6, 0.2, HYPHA_TONES.bone[1]);
  s.commit();
}

function tatters(s: SpriteCanvas, time: number): void {
  for (let i = 0; i < 5; i++) {
    const x = -5 + i * 2.2;
    const len = 4 + (i % 3) * 2;
    const swing = Math.sin(time * 2.2 + i * 1.3) * 0.8;
    s.taper(x, -14, x - 0.5 + swing, -14 + len, 1, 0.3, H[2], i % 2 ? 0.4 : -0.4);
  }
}

const PATCHES: readonly (readonly [number, number, number])[] = [
  [-3, -25, 1.4],
  [2.5, -19, 1.1],
  [-4.5, -16, 0.9],
];

export function body(s: SpriteCanvas, p: HyphaPose, time: number): void {
  const l = p.lean;
  s.begin();
  s.poly(
    [
      [-5, -12],
      [4, -12],
      [6 + l, -22],
      [4 + l, -28],
      [-2 + l, -28],
      [-6 + l * 0.5, -20],
    ],
    H[2],
  );
  s.dot(-1 + l, -24, 5, H[2]);
  tatters(s, time);
  s.shadeEdges(H[2], H[3], H[1], 2);
  s.commit();
  s.begin();
  for (let i = 0; i < 4; i++) {
    const y = -26 + i * 3.6;
    const x0 = -5.5 + (i % 2) * 1.5 + l * (1 - i / 4);
    s.hairline(x0, y + 1.5, x0 + 4.5, y + 0.2, T[2]);
    s.hairline(x0 + 4.5, y + 0.2, x0 + 9, y - 1.5, i === 1 ? T[4] : T[3]);
  }
  s.hairline(-4 + l, -28.5, -6 + l * 0.5, -21, T[3]);
  s.commit(false);
  s.begin();
  for (const [u, v, r] of PATCHES) {
    s.dot(u + l * (v < -20 ? 1 : 0.5), v, r, T[2]);
    s.set(u + l * (v < -20 ? 1 : 0.5) - r * 0.4, v - r * 0.4, T[4]);
  }
  for (let i = 0; i < 3; i++) s.hairline(1.5 + l, -23 + i * 2, 4 + l, -22.5 + i * 2, HYPHA_TONES.bone[1]);
  s.set(-4 + l * 0.5, -21, BLIGHT.spore[3]);
  s.set(0 + l, -17, BLIGHT.spore[2]);
  s.commit(false);
}

export function strands(s: SpriteCanvas, p: HyphaPose, time: number): void {
  const cx = 5 + p.lean;
  const anchors = [-10, -8, -5.5, -3, 9.5] as const;
  s.begin();
  for (let i = 0; i < anchors.length; i++) {
    const x0 = cx + anchors[i];
    const len = 5 + ((i * 7) % 5) + (i === 0 ? 3 : 0);
    let px = x0;
    let py = -31.5;
    for (let k = 1; k <= 4; k++) {
      const u = k / 4;
      const nx = x0 + Math.sin(time * 2.6 + i * 1.9 + u * 2.5) * 1.1 * u;
      const ny = -31.5 + len * u;
      s.hairline(px, py, nx, ny, k < 3 ? T[3] : T[2]);
      px = nx;
      py = ny;
    }
    s.set(px, py + 0.5, BLIGHT.spore[3]);
  }
  s.commit(false);
}
