import { hero } from "../../../state";
import { setState } from "../../actions";
import { lift } from "../../lift";

/** Falling Star: she springs this many pixels up out of the dive's impact, free to sweep or dive again */
export function springOut(rise: number): void {
  hero.ground = true;
  lift(rise, false);
  hero.jumps = 1;
  setState("jump");
}
