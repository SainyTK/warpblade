import { hero } from "../../../state";
import { isFree } from "../../actions";
import { blowsDone, endCombo } from "../../combo";

/** she is free, or a glaive blow is out and in its follow-through, which a vault, dive or guard may cut */
export function canCut(): boolean {
  return isFree() || blowsDone();
}

/** drop the move under way, if any; the combo stays open */
export function cutMove(): void {
  if (hero.state !== "move") return;
  hero.move = null;
  endCombo(false);
}
