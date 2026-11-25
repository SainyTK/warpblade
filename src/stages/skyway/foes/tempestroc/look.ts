import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { lerp } from "../../../../utils/math";
import { SKY_FOES as C } from "../colors";

export type At = (x: number, y: number) => readonly [number, number];

export interface RocPose {
  flap: number;
  spread: number;
  tilt: number;
  charge: number;
  open: number;
  headBack: number;
  reach: number;
  storm: boolean;
}

export function tail(s: SpriteCanvas, at: At, time: number, storm: boolean): void {
  const fan = [-2.6, -0.8, 1, 2.8, 4.6] as const;
  s.begin();
  fan.forEach((v, i) => {
    const sway = Math.sin(time * 5 + i * 0.9) * 1.2;
    const [x0, y0] = at(-11, 0.5 + v * 0.3);
    const [x1, y1] = at(-27 + Math.abs(i - 2) * 1.5, v * 1.6 + 1 + sway);
    s.taper(x0, y0, x1, y1, 1.9, 0.5, C.roc[2], 0);
  });
  s.shadeEdges(C.roc[2], C.roc[3], C.roc[1], 2);
  fan.forEach((v, i) => {
    const sway = Math.sin(time * 5 + i * 0.9) * 1.2;
    const [x1, y1] = at(-27 + Math.abs(i - 2) * 1.5, v * 1.6 + 1 + sway);
    const [x2, y2] = at(-24.5 + Math.abs(i - 2) * 1.5, v * 1.5 + 1 + sway);
    s.hairline(x2, y2, x1, y1, C.rocCrest[0]);
    s.set(x1, y1, storm ? C.volt[4] : C.volt[3]);
  });
  s.commit();
}

export function talons(s: SpriteCanvas, at: At, reach: number): void {
  for (const [hx, lag] of [
    [-4, 0.6],
    [1.5, 0],
  ] as const) {
    const [ax, ay] = at(hx, 5);
    const [kx, ky] = at(lerp(hx - 0.5, hx + 4 - lag, reach), lerp(9.5, 9, reach));
    const [fx, fy] = at(lerp(hx - 1, hx + 9 - lag * 3, reach), lerp(13.5, 12, reach));
    s.begin();
    s.stroke(ax, ay, kx, ky, 2.4, C.roc[2]);
    s.shadeEdges(C.roc[2], C.roc[3], C.roc[1]);
    s.commit();
    s.begin();
    s.stroke(kx, ky, fx, fy, 0.9, C.beak[2]);
    s.shadeEdges(C.beak[2], C.beak[3], C.beak[1]);
    s.commit();
    s.begin();
    for (const [dx, dy] of [
      [2.6, 0.4],
      [1.2, 1.6],
      [-1.6, 0.8],
    ] as const) {
      s.taper(fx, fy, fx + dx, fy + dy, 0.6, 0.25, C.beak[1], -0.4);
      s.set(fx + dx, fy + dy + 0.5, C.outline);
    }
    s.commit();
  }
}

export function body(s: SpriteCanvas, at: At): void {
  const [x0, y0] = at(-14, 0.5);
  const [x1, y1] = at(7, -1.5);
  s.begin();
  s.taper(x0, y0, x1, y1, 5.6, 8.2, C.roc[2], 1.4);
  s.shadeEdges(C.roc[2], C.roc[3], C.roc[1], 3);
  s.commit();
  s.begin();
  s.poly([at(9, -5), at(11, 0), at(7, 6.5), at(0, 7.4), at(-7, 5.2), at(-2, 2), at(4, -2)], C.rocBelly[1]);
  s.shadeEdges(C.rocBelly[1], C.rocBelly[2], C.rocBelly[0], 2);
  for (let row = 0; row < 4; row++)
    for (let k = 0; k < 4 - row * 0.5; k++) {
      const u = 8 - row * 2.4 - k * 0.6;
      const v = -1.5 + k * 2 + row * 0.8;
      const [x, y] = at(u, v);
      const [x2, y2] = at(u - 1, v + 0.6);
      s.set(x, y, C.rocBelly[0]);
      s.set(x2, y2, C.rocBelly[0]);
      const [hx, hy] = at(u + 0.5, v - 0.5);
      s.set(hx, hy, C.rocBelly[3]);
    }
  s.commit();
  s.begin();
  for (let u = -11; u <= 4; u += 2.6) {
    const [x, y] = at(u, -6.2 + Math.abs(u + 3) * 0.06);
    s.set(x, y, C.roc[4]);
    const [x2, y2] = at(u + 1, -5.4);
    s.set(x2, y2, C.roc[3]);
  }
  s.commit(false);
}

export function head(s: SpriteCanvas, at: At, p: RocPose, time: number): void {
  const hb = p.headBack;
  const crestLift = p.storm ? 2.5 : 0;
  s.begin();
  for (const [ex, ey, k] of [
    [2, -16 - crestLift, 0],
    [4.5, -19 - crestLift, 1],
    [8, -20 - crestLift * 1.2, 2],
  ] as const) {
    const sway = Math.sin(time * 7 + k) * 0.9;
    const [x0, y0] = at(14 - hb, -10);
    const [x1, y1] = at(ex - hb, ey + sway);
    s.taper(x0, y0, x1, y1, 1.5, 0.4, C.rocCrest[1], -0.8);
  }
  s.shadeEdges(C.rocCrest[1], C.rocCrest[2], C.rocCrest[0]);
  if (p.storm) {
    const [tx, ty] = at(8 - hb, -20 - crestLift * 1.2);
    s.set(tx, ty, C.volt[4]);
  }
  s.commit();
  s.begin();
  const [nx, ny] = at(11 - hb * 0.5, -4);
  s.dot(nx, ny, 5.2, C.roc[3]);
  s.shadeEdges(C.roc[3], C.roc[4], C.roc[2], 2);
  for (const v of [-7, -4, -1]) {
    const [x0, y0] = at(13 - hb * 0.5, v);
    const [x1, y1] = at(8 - hb * 0.5, v + 1.5);
    s.hairline(x0, y0, x1, y1, C.rocBelly[3]);
  }
  s.commit();
  const [hx, hy] = at(17 - hb, -7);
  s.begin();
  s.dot(hx, hy, 4.6, C.roc[3]);
  s.shadeEdges(C.roc[3], C.roc[4], C.roc[1], 2);
  const [b0, b1] = at(15.5 - hb, -10.5);
  const [b2, b3] = at(20.5 - hb, -9.4);
  s.stroke(b0, b1, b2, b3, 0.7, C.roc[1]);
  s.commit();
  const jaw = p.open * 0.7;
  s.begin();
  const lower = [
    [21 - hb, -4.8],
    [25.5 - hb, -3.8 + jaw * 4],
    [22 - hb, -2.4 + jaw * 2],
  ] as const;
  s.poly(
    lower.map(([x, y]) => at(x, y)),
    C.beak[1],
  );
  s.shadeEdges(C.beak[1], C.beak[2], C.beak[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [20.4 - hb, -9.4],
      [26 - hb, -7.4],
      [28.2 - hb, -4.6],
      [26.6 - hb, -3.6],
      [21 - hb, -5.2],
    ].map(([x, y]) => at(x, y)),
    C.beak[2],
  );
  s.shadeEdges(C.beak[2], C.beak[3], C.beak[1]);
  const [tx, ty] = at(27.6 - hb, -4.2);
  s.set(tx, ty, C.beak[0]);
  if (p.open > 0.3) {
    const [mx, my] = at(24 - hb, -4.4 + jaw);
    s.set(mx, my, p.charge > 0.5 ? WHITE : C.volt[4]);
  }
  s.commit();
  s.begin();
  const [ex, ey] = at(19 - hb, -8);
  const hot = p.storm || p.charge > 0.6;
  s.block(ex - 0.5, ey - 0.5, hot ? C.volt[3] : C.rocEye, 1.5, 1);
  s.set(ex, ey - 0.5, hot ? C.rocEyeHot : C.rocEye);
  s.set(ex - 0.5, ey - 0.5, WHITE);
  s.commit(false);
}

export function veins(s: SpriteCanvas, at: At, time: number, wingTips: readonly (readonly [number, number])[]): void {
  const beat = Math.floor(time * 14);
  s.begin();
  const from = at(0, -1);
  const ends = [...wingTips, at(-28, 2), at(16, -8), at(-6, 8)];
  ends.forEach(([ex, ey], i) => {
    if (grain(beat, i) < 0.35) return;
    let [px, py] = from;
    for (let k = 1; k <= 5; k++) {
      const u = k / 5;
      const j = (grain(beat + i * 7, k) - 0.5) * 6 * Math.sin(u * Math.PI);
      const nx = lerp(from[0], ex, u) + j;
      const ny = lerp(from[1], ey, u) - j * 0.5;
      s.hairline(px, py, nx, ny, k % 2 ? C.volt[4] : C.volt[3]);
      px = nx;
      py = ny;
    }
  });
  s.commit(false);
}
