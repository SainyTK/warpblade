import type { Situation } from "../../../types/move";
import { SKILL } from "../constants/skills/ids";
import { AIR_DRAWS, FALLING_SECOND } from "../constants/string";
import type { SayaMoveId } from "../types/moves";

/** the string in order before its last press; the last press a combo allows is always the sheathe */
const STRING: readonly SayaMoveId[] = ["drawCut", "returnCut"];

/** falling draws she may make in one airtime: one, two with Falling Moon's fourth level */
const airDraws = (s: Situation): number => AIR_DRAWS + (s.skills[SKILL.falling] >= FALLING_SECOND ? 1 : 0);

/** the move J starts now: the falling draw in the air, else the string's next press, the same wherever foes stand */
export function chooseMove(s: Situation): SayaMoveId | null {
  if (!s.ground) return s.airHits < airDraws(s) ? "airDraw" : null;
  if (s.next >= s.limit) return "sheathe";
  return STRING[Math.min(s.next, STRING.length) - 1];
}
