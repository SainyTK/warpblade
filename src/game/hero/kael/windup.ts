import { WINDUP_RATE } from "../../../constants/kael/motion";
import { hero } from "../../state";
import { MOVES } from "../moves";

/** the move clock's rate: slowed until the move's first blow is out, so its wind-up reads, then full speed */
export function windupRate(): number {
  const h = hero;
  if (h.state !== "move" || !h.move || h.hitIndex > 0) return 1;
  const first = MOVES[h.move].hits[0];
  return first && h.st < first.at ? WINDUP_RATE : 1;
}
