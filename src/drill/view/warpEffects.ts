import { fleck, glow, place } from "../../engine/frame";
import { blit } from "../../engine/sprite";
import { skin } from "../../game/hero/skin";
import type { DrillProfile, WarpTrace, WarpWeapon } from "../../types/drill";
import type { SpriteImage } from "../../types/sprite";
import { lerp } from "../../utils/math";
import { WARP_TRACE_LIFE } from "../constants";
import { drawWarpThread } from "./warpThread";
import { drawWeaponWake } from "./weaponWake";

export function drawFlyingSword(profile: DrillProfile, weapon: WarpWeapon, effects: boolean): void {
  if (effects) {
    drawWeaponWake(weapon.trail, weapon.angle, skin.ramp);
  }
  profile.drawThrown(weapon.x, weapon.y, weapon.angle);
}

export function drawWarpTrace(trace: WarpTrace): void {
  const {
    life,
    from: [x0, y0],
    to: [x1, y1],
  } = trace;
  const age = 1 - life / WARP_TRACE_LIFE;
  const { ramp } = skin;
  drawWarpThread(x0, y0 - 18, x1, y1 - 18, age, ramp);
  place();
  glow(x1, y1 - 18, 27, ramp[4], 0.32 * (1 - age));
  for (let i = 0; i < 13; i++) {
    const u = ((i * 7) % 13) / 12;
    const spread = ((i % 3) - 1) * (3 + age * 9);
    fleck(
      lerp(x0, x1, u) - age * (i % 2 ? 3 : -3),
      lerp(y0, y1, u) - 18 + spread - age * 10,
      ramp[4],
      (1 - age) * 0.76,
    );
  }
  place();
}

export function drawWarpGhosts(trace: WarpTrace, sprite: SpriteImage): void {
  const {
    life,
    face,
    from: [x0, y0],
    to: [x1, y1],
  } = trace;
  const age = WARP_TRACE_LIFE - life;
  const distance = Math.hypot(x1 - x0, y1 - y0);
  for (let i = 0; i < 5; i++) {
    const u = i / 5;
    const max = 0.18 + u * 0.18;
    if (distance * (1 - u) >= 16 && age < max) {
      blit(sprite, lerp(x0, x1, u), lerp(y0, y1, u), face < 0, {
        alpha: 0.6 * (1 - age / max),
        tint: skin.glow,
        tintAmount: 0.65,
        soft: true,
      });
    }
  }
}
