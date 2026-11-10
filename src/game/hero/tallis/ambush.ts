import { SINK } from "../../../constants/tallis/sink";
import type { Enemy } from "../../../types/enemy";
import { skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { behindOf } from "./backOpen";
import { tallis } from "./memory";

/** an Ambush is open: his first blow out of the Veil, or one soon after rising behind a foe */
export const ambushOpen = (): boolean => (tallis.veil && tallis.ambushNext) || tallis.ambushLeft > 0;

/** the open Ambush is used by the blow landing now: true when there was one */
export function takeAmbush(): boolean {
  if (!ambushOpen()) return false;
  tallis.ambushNext = false;
  tallis.ambushLeft = 0;
  return true;
}

/** seconds after a rise behind a foe in which a blow is an Ambush: Ambush lengthens it */
export const ambushWindow = (): number => skillValues("t_ambush").window || SINK.ambushWindow;

/** he rose within reach on the side a foe does not face: the next blow soon after is an Ambush. Returns that foe. */
export function openRiseAmbush(): Enemy | null {
  for (const e of game.enemies) {
    if (e.hp <= 0 || Math.abs(e.x - hero.x) > SINK.ambushBehind || Math.abs(e.y - hero.y) > 24) continue;
    if (!behindOf(e)) continue;
    tallis.ambushLeft = ambushWindow();
    return e;
  }
  return null;
}
