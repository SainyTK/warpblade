import { PAL } from "../../../constants/palette";
import { H, W } from "../../../constants/stage";
import { GLOAMING } from "../../../constants/tallis/special";
import { blendScreen, lightB, lightG, lightR, shakeOffset } from "../../../engine/frame";
import { blitRing } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { kindOf } from "../../enemies/kinds";
import { game } from "../../state";

/** the dark under way: how deep it is now, 0 to 1, and whether it is lifting */
export interface GloamDark {
  fading: boolean;
  k: number;
}

/** the light the scene gives off dims with the dark, so the sun's glow does not wash it out */
export function dimLights(dark: GloamDark): void {
  const keep = 1 - GLOAMING.dark * dark.k;
  if (keep >= 1) return;
  for (let i = 0; i < lightR.length; i++) {
    lightR[i] *= keep;
    lightG[i] *= keep;
    lightB[i] *= keep;
  }
}

/**
 * The dark Gloaming and Eclipse lay over the scene: drawn behind the foes and the heroes, so only they stand out of it,
 * each foe struck rimmed in dusk rose. It deepens over the wind-up and fades once `fading` is set.
 */
export function createDark(targets: readonly Enemy[]): GloamDark {
  const handle: GloamDark = { fading: false, k: 0 };
  game.fx.push({
    update(dt) {
      const step = handle.fading ? -dt / GLOAMING.light : dt / GLOAMING.windup;
      handle.k = Math.max(0, Math.min(1, handle.k + step));
      return !handle.fading || handle.k > 0;
    },
    drawBack() {
      const [sx, sy] = shakeOffset();
      const a = GLOAMING.dark * handle.k;
      for (let y = -2; y < H + 2; y++) for (let x = -2; x < W + 2; x++) blendScreen(x + sx, y + sy, PAL.gloam[0], a);
      if (handle.fading) return;
      for (const e of targets) {
        if (e.hp <= 0) continue;
        blitRing(kindOf(e.type).draw(e, game.t), e.x, e.y, e.face < 0, 1, () => PAL.gloam[4]);
      }
    },
    draw() {},
  });
  return handle;
}
