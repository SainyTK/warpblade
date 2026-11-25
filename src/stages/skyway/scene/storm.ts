import { fleck, glow, hairline } from "../../../engine/frame";
import { grain } from "../../../utils/grain";
import { lerp } from "../../../utils/math";
import { SEA_POCKETS, SEA_TOP } from "./cloudSea";
import { SKYWAY_COLORS as S } from "./palette";
import { THUNDER_POCKETS } from "./thunderhead";

const SEA = { slot: 2.6, life: 0.5, chance: 0.75 } as const;
const HEAD = { slot: 4.2, life: 0.7, chance: 0.6 } as const;
const BIG = { every: 3, peak: 0.22 } as const;

function strike(t: number, slot: number, life: number, chance: number, salt: number) {
  const n = Math.floor(t / slot);
  if (grain(n, salt) > chance) return null;
  const age = t - (n + grain(n, salt + 1) * 0.4) * slot;
  return age >= 0 && age < life ? { n, age } : null;
}

const pulse = (age: number, life: number): number =>
  age < 0.05 ? 1 : age < 0.1 ? 0.25 : age < 0.18 ? 0.75 : 0.75 * Math.max(0, 1 - (age - 0.18) / (life - 0.18));

function seaBolt(x: number, n: number, a: number): void {
  let px = x;
  let py = SEA_TOP + 6;
  for (let k = 1; k <= 5; k++) {
    const nx = x + (grain(n, k + 10) - 0.5) * 16;
    const ny = SEA_TOP + 6 + k * 6;
    hairline(px, py, nx, ny, k < 3 ? S.boltCore : S.boltEdge, a);
    px = nx;
    py = ny;
  }
  fleck(x, SEA_TOP + 6, S.boltCore, a);
}

export function seaLightning(t: number): void {
  const s = strike(t, SEA.slot, SEA.life, SEA.chance, 3);
  if (!s) return;
  const p = pulse(s.age, SEA.life);
  const pocket = SEA_POCKETS[s.n % SEA_POCKETS.length];
  const x = lerp(pocket.x - 60, pocket.x + 60, grain(s.n, 7));
  glow(x, pocket.y - 6, 46, S.stormGlow, 0.5 * p);
  glow(x, pocket.y, 22, S.boltEdge, 0.4 * p);
  if (s.age < 0.22 && grain(s.n, 8) > 0.4) seaBolt(x, s.n, p);
}

export function headLightning(t: number): void {
  const s = strike(t, HEAD.slot, HEAD.life, HEAD.chance, 11);
  if (!s) return;
  const p = pulse(s.age, HEAD.life);
  const pocket = THUNDER_POCKETS[s.n % THUNDER_POCKETS.length];
  glow(pocket.x, pocket.y, pocket.r * 2.4, S.stormGlow, 0.45 * p);
  glow(pocket.x + 4, pocket.y - 4, pocket.r, S.boltEdge, 0.35 * p);
}

export function stormFlash(t: number): number {
  const sea = strike(t, SEA.slot, SEA.life, SEA.chance, 3);
  const head = strike(t, HEAD.slot, HEAD.life, HEAD.chance, 11);
  const a = sea ? pulse(sea.age, SEA.life) * (sea.n % BIG.every === 0 ? BIG.peak : 0.05) : 0;
  const b = head ? pulse(head.age, HEAD.life) * 0.08 : 0;
  return Math.max(a, b);
}
