import { STOPPED_RIM } from "../../../constants/mirel/look";
import { blitRing } from "../../../engine/sprite";
import { foeSprite } from "../../../scene/foeSprites";
import type { Enemy } from "../../../types/enemy";
import { game } from "../../state";

/** every this many image pixels along the rim one glints, and the glints creep round this fast */
const GLINT = { every: 7, speed: 6 } as const;

/**
 * A foe stopped in time wears a rim of pale glass one image pixel wide, with glints creeping slowly round it, so it
 * reads as held and not merely tinted.
 */
export function drawStoppedRim(e: Enemy): void {
  if (e.hp <= 0 || e.stopped <= 0) return;
  const creep = Math.floor(game.t * GLINT.speed);
  // the picture the foe layer just showed, so the rim fits it and nothing is drawn twice
  blitRing(foeSprite(e), e.x, e.y, e.face < 0, 1, (ix, iy) =>
    (ix + iy + creep) % GLINT.every === 0 ? STOPPED_RIM.glint : STOPPED_RIM.glass,
  );
}
