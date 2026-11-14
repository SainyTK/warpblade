import { isFree } from "../../actions";
import { blowsDone } from "../../combo";

/** she is free, or a glaive blow is out and in its follow-through, which the shared actions may cut */
export function canCut(): boolean {
  return isFree() || blowsDone();
}
