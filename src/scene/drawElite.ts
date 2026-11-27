import { ELITE_LOOK } from "../constants/elite";
import { MINI_RING } from "../constants/miniBoss";
import { COIN_GOLD } from "../constants/palette";
import { FW } from "../constants/stage";
import { glow, place } from "../engine/frame";
import { blitRing } from "../engine/sprite";
import { enemyCenter } from "../game/enemies/enemy";
import { game } from "../game/state";
import type { Color, Ramp } from "../types/color";
import type { Enemy } from "../types/enemy";
import type { SpriteImage } from "../types/sprite";
import { mix, scale, WHITE } from "../utils/color";

const L = { ...ELITE_LOOK, bandPitch: 0.16, bandSpeed: 2.5, bandCut: 0.2 } as const;

export function drawEliteRing(
  e: Enemy,
  s: SpriteImage,
  x: number,
  ramp: Ramp = COIN_GOLD,
  width: number = L.width,
): void {
  const sweep = ((game.t / L.every) % 1) * (FW + 360) - 180;
  blitRing(s, x, e.y, e.face < 0, width + 1, () => ramp[0]);
  blitRing(s, x, e.y, e.face < 0, width, (ix, iy) => {
    const d = ix + iy * 0.5 - sweep;
    if (d >= 0 && d < L.glint) return ramp[4];
    return Math.sin((ix - iy * 2) * L.bandPitch + game.t * L.bandSpeed) > L.bandCut ? ramp[3] : ramp[2];
  });
}

export function drawEliteGlow(e: Enemy, color: Color = COIN_GOLD[3], boost = 0): void {
  place();
  const [cx, cy] = enemyCenter(e);
  glow(cx, cy, 22 + boost * 24, color, L.glow + 0.08 * Math.sin(game.t * 5) + boost * 0.5);
}

export const ringRamp = (light: Color): Ramp => [
  scale(light, 0.12),
  scale(light, 0.35),
  scale(light, 0.7),
  light,
  mix(light, WHITE, 0.75),
];

export const miniRingWidth = (charge: number): number =>
  MINI_RING.width + (charge > 0 && Math.floor(game.t * MINI_RING.pulse * 2) % 2 === 0 ? 1 : 0);
