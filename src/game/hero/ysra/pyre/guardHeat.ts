import { GUARD } from "../../../../constants/ysra/stance";
import { skillValues } from "../../../skills/query";
import { onYsra } from "../events";
import { addHeat } from "./heat";

/** her guard builds Heat: a parry always, more with Kindling, and a block with Kindling */
export function listenGuard(): void {
  onYsra("parry", () => addHeat(GUARD.parryHeat + (skillValues("y_kindling").parry ?? 0)));
  onYsra("block", () => addHeat(skillValues("y_kindling").block ?? 0));
}
