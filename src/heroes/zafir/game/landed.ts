import { usesDrill } from "../../../drill";
import { hero } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import { WHIRL } from "../constants/whirl";
import { WOUND } from "../constants/wounds";
import { behindHim, zafirCutWounds } from "./skillHooks";
import { zafir } from "./state";
import { gainWhirl } from "./whirl";
import { openWounds } from "./wounds";

/** one of his own hits landed: it opens a wound (two on a Keen spin) and feeds the Whirl; the ring's own cuts do
 *  neither, so the ring cannot keep itself turning */
export function landed(e: Enemy): void {
  if (zafir.ringCutting || usesDrill()) return;
  const keen = hero.keen && hero.state === "move";
  if (hero.state === "move") zafir.sides |= behindHim(e) ? 2 : 1;
  openWounds(e, (keen ? WOUND.keen : WOUND.cut) + zafirCutWounds(e));
  gainWhirl(WHIRL.perHit + (keen ? WHIRL.keen : 0));
}
