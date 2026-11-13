import { PAL } from "../../../constants/palette";
import { createFloorRing } from "../../effects/floorRing";
import { game, hero } from "../../state";
import { judgeShared } from "./beat";
import { jory } from "./memory";

/** an on-beat dodge leaves a cobalt ring where it starts */
const DODGE_RING = { radius: 16, life: 0.25 } as const;

/**
 * The shared moves his beat judges as they start, by when their key went down: a warp thrown on the beat arrives as an
 * Accent, and a dodge on the beat builds Groove. Off the beat neither costs anything.
 */
export function watchSharedPresses(): void {
  const state = hero.state;
  if (state === jory.seen) return;
  jory.seen = state;
  if (state === "throw") {
    const judged = judgeShared("J");
    jory.warpOnBeat = judged.onBeat;
    jory.warpDownbeat = judged.downbeat;
  }
  if (state === "dash") {
    jory.dodgeOnBeat = judgeShared("L").onBeat;
    if (jory.dodgeOnBeat) game.fx.push(createFloorRing(hero.x, hero.y, DODGE_RING.radius, PAL.beat, DODGE_RING.life));
  }
}
