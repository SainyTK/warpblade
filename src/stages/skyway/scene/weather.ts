import { GROUND, H, W } from "../../../constants/stage";
import { fleck, hairline, haze } from "../../../engine/frame";
import { grain } from "../../../utils/grain";
import { gustDirection, gustStrength } from "../hazard";
import { SKYWAY_PALETTE as P, SKYWAY_COLORS as S } from "./palette";

const DRIFT = { count: 8, speed: 70, span: W + 60 } as const;
const WISPS = [
  { y: GROUND + 14, r: 26, speed: 9, at: 0 },
  { y: GROUND + 20, r: 34, speed: 14, at: 140 },
  { y: 30, r: 30, speed: 6, at: 220 },
  { y: 62, r: 22, speed: 11, at: 60 },
] as const;
const MOTES = 24;

export function drawWind(t: number): void {
  const gust = gustStrength();
  const dir = gust > 0 ? gustDirection() : -1;
  for (let i = 0; i < DRIFT.count; i++) {
    const y = 10 + grain(i, 21) * (GROUND - 30);
    const speed = DRIFT.speed * (0.6 + grain(i, 22) * 0.8);
    const travel = (grain(i, 23) * DRIFT.span + t * speed) % DRIFT.span;
    const x = dir > 0 ? travel - 30 : W + 30 - travel;
    const len = 5 + grain(i, 24) * 9;
    if (gust > 0.3) continue;
    hairline(x, y, x - dir * len, y + Math.sin(t + i) * 0.5, (u) => (u < 0.4 ? S.streak[1] : S.streak[0]));
  }
  for (const w of WISPS) {
    const x = ((((w.at - t * w.speed) % (W + 120)) + W + 120) % (W + 120)) - 60;
    haze(x, w.y, w.r * 2, w.r * 0.35, P.mist, 0.12);
  }
  for (let i = 0; i < MOTES; i++) {
    const x = (((grain(i, 31) * W - t * (14 + grain(i, 32) * 20)) % W) + W) % W;
    const y = (grain(i, 33) * H + Math.sin(t * 0.8 + i) * 6) % H;
    fleck(x, y, i % 5 === 0 ? S.boltEdge : S.streak[1], 0.35 + Math.sin(t * 3 + i) * 0.2);
  }
}
