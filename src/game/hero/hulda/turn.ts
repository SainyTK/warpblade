import { hero } from "../../state";
import { foeOnlyBehind } from "../situation";

/** she starts a string or a grab facing the way she is pushed, or else turns to a foe within reach only behind her */
export function faceFor(dir: number): void {
  if (dir) hero.face = dir;
  else if (foeOnlyBehind()) hero.face = -hero.face;
}
