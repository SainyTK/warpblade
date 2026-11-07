import { ELITE_LOOK as L } from "../constants/elite";
import { COIN_GOLD } from "../constants/palette";
import { FW } from "../constants/stage";
import { glow, place } from "../engine/frame";
import { blitRing } from "../engine/sprite";
import { enemyCenter } from "../game/enemies/enemy";
import { game } from "../game/state";
import type { Enemy } from "../types/enemy";
import type { SpriteImage } from "../types/sprite";

/** an elite's gold ring around its sprite, drawn before the sprite, with a glint sweeping across it on the diagonal */
export function drawEliteRing(e: Enemy, s: SpriteImage, x: number): void {
  const sweep = ((game.t / L.every) % 1) * (FW + 360) - 180;
  blitRing(s, x, e.y, e.face < 0, L.width, (ix, iy) => {
    const d = ix + iy * 0.5 - sweep;
    if (d >= 0 && d < L.glint) return COIN_GOLD[4];
    return (ix + iy) % 2 ? COIN_GOLD[3] : COIN_GOLD[2];
  });
}

/** the gold glow an elite gives off, over its own */
export function drawEliteGlow(e: Enemy): void {
  place();
  const [cx, cy] = enemyCenter(e);
  glow(cx, cy, 22, COIN_GOLD[3], L.glow + 0.08 * Math.sin(game.t * 5));
}
