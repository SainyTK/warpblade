import { skillValues } from "../../../../game/skills/query";
import { fireTrigger } from "../trigger";

/** Hair Trigger's sixth level: a Trigger on Breaker fires a second round into the wound */
export function twinRound(): void {
  if (skillValues("ca_trigger").twin) fireTrigger();
}
