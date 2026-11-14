import type { Situation } from "../../../types/move";
import { AIR_DRAWS } from "../constants/string";
import type { SayaMoveId } from "../types/moves";

/** the string in order before its last press; the last press a combo allows is always the sheathe */
const STRING: readonly SayaMoveId[] = ["drawCut", "returnCut"];

/** the move J starts now: the falling draw in the air, else the string's next press, the same wherever foes stand */
export function chooseMove(s: Situation): SayaMoveId | null {
  if (!s.ground) return s.airHits < AIR_DRAWS ? "airDraw" : null;
  if (s.next >= s.limit) return "sheathe";
  return STRING[Math.min(s.next, STRING.length) - 1];
}
