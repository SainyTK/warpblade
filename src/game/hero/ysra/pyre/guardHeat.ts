import { skillValues } from "../../../skills/query";
import { onYsra } from "../events";
import { addHeat } from "./heat";

/** Kindling: her guard builds Heat, a parry more than a block */
export function listenGuard(): void {
  onYsra("parry", () => addHeat(skillValues("y_kindling").parry ?? 0));
  onYsra("block", () => addHeat(skillValues("y_kindling").block ?? 0));
}
