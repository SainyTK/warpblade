import { PAL } from "../../../constants/palette";
import { H, W } from "../../../constants/stage";
import { GLOAMING } from "../../../constants/tallis/special";
import { blendScreen, shakeOffset } from "../../../engine/frame";
import { blitRing } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { kindOf } from "../../enemies/kinds";
import { game } from "../../state";

/**
 * The dark Gloaming and Eclipse lay over the scene: drawn behind the foes and the heroes, so only they stand out of it,
 * each foe struck rimmed in dusk rose. It deepens over the wind-up and fades once `fading` is set.
 */
export function createDark(targets: readonly Enemy[]): { fading: boolean } {
  const handle = { fading: false };
  let k = 0;
  game.fx.push({
    update(dt) {
      const step = handle.fading ? -dt / GLOAMING.light : dt / GLOAMING.windup;
      k = Math.max(0, Math.min(1, k + step));
      return !handle.fading || k > 0;
    },
    drawBack() {
      const [sx, sy] = shakeOffset();
      const a = GLOAMING.dark * k;
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
