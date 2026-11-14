import { skillValues } from "../../../game/skills/query";
import { hero } from "../../../game/state";
import type { MoveHit } from "../../../types/move";
import type { VesperMoveId } from "../types/moves";
import { shortBlowAt } from "./blades";
import { vesper } from "./state";
import { tempoTop } from "./tempo";

/** a string blow as her skills and the parry shape it: reach and guard break at the top of Tempo (Rising Edge), short
 *  blows that cut behind too and hit harder (Crossing Storm), and every blow breaking guards while the foes are opened */
export function shapeHit(id: string, hit: MoveHit): MoveHit {
  const short = shortBlowAt(id as VesperMoveId, hero.hitIndex);
  const edge = skillValues("ve_edge");
  const storm = skillValues("ve_storm");
  let shaped = hit;
  if (tempoTop() && !short && edge.reach)
    shaped = { ...shaped, box: [hit.box[0], hit.box[1], hit.box[2] + edge.reach, hit.box[3]] };
  if (short && storm.behind) shaped = { ...shaped, around: true, power: shaped.power * (1 + (storm.shortPower ?? 0)) };
  if (!short && id === "scissorTurn" && storm.scissor) shaped = { ...shaped, around: true };
  if (vesper.opened > 0 || (tempoTop() && edge.heavyTop)) shaped = { ...shaped, big: true };
  return shaped;
}
