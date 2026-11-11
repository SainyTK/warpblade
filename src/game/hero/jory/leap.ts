import { HERO_MOVE } from "../../../constants/combat";
import { sfx } from "../../../services/audio";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { hero } from "../../state";
import { setState } from "../actions";
import { lift } from "../lift";
import { onBeatNow } from "./beat";
import { jory } from "./memory";

/** Downbeat Leap: a jump from the floor pressed on the beat opens the level's leaps in the air */
export function openLeaps(): void {
  jory.leaps = onBeatNow() ? (skillValues("j_leap").leaps ?? 0) : 0;
}

/**
 * Up in the air: with Downbeat Leap, another jump pressed on a beat, once per leap left. Up is never judged, so a leap
 * off the beat simply does not happen.
 */
export function airLeap(): boolean {
  if (jory.leaps <= 0 || !onBeatNow()) return false;
  jory.leaps--;
  hero.vy = 0;
  lift(HERO_MOVE.doubleJumpRise, true);
  setState("jump");
  sfx.doubleJump();
  emitSkillEvent({ type: "jump", air: true });
  return true;
}
