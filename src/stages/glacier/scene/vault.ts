import { FW, RES } from "../../../constants/stage";
import { noise } from "../../../scene/eras/rain/noise";
import { grain } from "../../../utils/grain";

const STALACTITES = Array.from({ length: 46 }, (_, i) => ({
  x: i * 7.2 + grain(i, 3) * 5,
  w: 1.4 + grain(i, 5) * 3.2,
  len: 3 + grain(i, 7) ** 2 * 26,
}));

export const CRACKS: readonly number[] = [64, 184, 262];

const roof = (x: number): number => 13 + 7 * noise(x * 0.035, 1.3) + 4 * noise(x * 0.11, 7.1);

function vaultDepth(x: number): number {
  let depth = roof(x);
  for (const s of STALACTITES) {
    const u = Math.abs(x - s.x) / s.w;
    if (u < 1) depth = Math.max(depth, roof(s.x) + s.len * (1 - u) ** 1.4);
  }
  return depth;
}

export const VAULT = Float32Array.from({ length: FW }, (_, ix) => vaultDepth((ix + 0.5) / RES));

export const vaultAt = (x: number): number => VAULT[Math.max(0, Math.min(FW - 1, Math.floor(x * RES)))];

export const crackX = (cx: number, y: number): number => cx + 2.4 * Math.sin(y * 0.45 + cx) + 0.8 * Math.sin(y * 1.7);

export const crackHalf = (cx: number, y: number): number => 0.7 + 2.8 * Math.max(0, 1 - y / roof(cx));

export const crackFoot = (cx: number): number => roof(cx);
