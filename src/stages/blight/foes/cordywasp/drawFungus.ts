import type { SpriteCanvas } from "../../../../engine/sprite";
import { WASP } from "./colors";
import { BULB } from "./moves";
import type { WaspPose } from "./pose";

export function stalk(s: SpriteCanvas, time: number): void {
  const sway = Math.sin(time * 2.4) * 0.6;
  s.begin();
  s.taper(5, -3, BULB.x + 2 + sway * 0.5, -9, 1.1, 0.8, WASP.stalk[2], -0.8);
  s.taper(BULB.x + 2 + sway * 0.5, -9, BULB.x + sway, BULB.y + 2, 0.8, 0.6, WASP.stalk[2], 0.6);
  s.taper(4, -6, 8 + sway, -9, 0.5, 0.2, WASP.stalk[1], -0.4);
  s.shadeEdges(WASP.stalk[2], WASP.stalk[3], WASP.stalk[1]);
  s.commit();
}

export function bulb(s: SpriteCanvas, p: WaspPose, time: number): void {
  const sway = Math.sin(time * 2.4) * 0.6;
  const x = BULB.x + sway;
  const y = BULB.y;
  const r = p.spent ? 1.4 : 2.1 + p.swell * 1.9;
  const B = WASP.bulb;
  s.begin();
  s.dot(x, y, r, p.swell > 0.5 ? B[3] : B[2]);
  s.shadeEdges(p.swell > 0.5 ? B[3] : B[2], B[4], B[1], 1);
  s.commit();
  s.begin();
  s.set(x - r * 0.4, y - r * 0.5, B[4]);
  for (let i = 0; i < 4; i++) {
    const a = i * 1.6 + time * 0.5;
    const lit = p.swell > 0.3 || Math.sin(time * 5 + i * 2) > 0.4;
    s.set(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, lit ? WASP.eyeHot : B[1]);
  }
  s.commit(false);
}

export function wing(s: SpriteCanvas, up: boolean, near: boolean): void {
  const root: readonly [number, number] = [near ? 0 : 1.5, -3];
  const tip: readonly [number, number] = up ? [-9, -14] : [-12, -5];
  const mid: readonly [number, number] = up ? [-2, -12] : [-7, -9];
  const tail: readonly [number, number] = up ? [-8, -6] : [-9, -2];
  const W = WASP.wing;
  s.begin();
  const lerp2 = (a: readonly [number, number], b: readonly [number, number], u: number) =>
    [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u] as const;
  for (let v = 0; v <= 1; v += 0.12)
    for (let u = 0; u <= 1; u += 0.08) {
      const top = lerp2(mid, tip, u);
      const bot = lerp2(root, tail, u);
      const [px, py] = lerp2(lerp2(root, top, Math.min(1, u * 1.5)), bot, v);
      if ((Math.round(px * 2) + Math.round(py * 2)) % 2 === 0) s.set(px, py, near ? W[4] : W[3]);
    }
  s.hairline(root[0], root[1], mid[0], mid[1], W[4]);
  s.hairline(mid[0], mid[1], tip[0], tip[1], W[4]);
  s.hairline(tip[0], tip[1], tail[0], tail[1], W[3]);
  s.hairline(root[0], root[1], tail[0] + 2, tail[1] - 1, W[2]);
  s.commit(false);
}
