import { HAFT_REACH } from "../../../../constants/ysra/glaive";
import type { MoveHit } from "../../../../types/move";
import type { Box } from "../../../../types/world";
import { progress } from "../../../state";

/** Long Haft: how many pixels further every glaive blow reaches */
export const haftReach = (): number => (progress.ranks[HAFT_REACH.skill] ?? 0) * HAFT_REACH.perRank;

/** a box pushed out at its far end: forward for a blow ahead, backward for a blow behind */
function longer(box: Box, extra: number): Box {
  const [x0, y0, x1, y1] = box;
  if (x1 <= 0) return [x0 - extra, y0, x1, y1];
  return [x0, y0, x1 + extra, y1];
}

/** a glaive blow whose box and slash grow with Long Haft, read at the moment the blow lands */
export function glaiveHit(hit: MoveHit): MoveHit {
  return {
    ...hit,
    get box() {
      return longer(hit.box, haftReach());
    },
    get slash() {
      return hit.slash && { ...hit.slash, R: hit.slash.R + haftReach() };
    },
  };
}
