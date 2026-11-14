import type { VesperMoveId } from "../types/moves";

/** which blow of each move is the short blade's, by its place in the move */
const SHORT_BLOW: Partial<Record<VesperMoveId, number>> = {
  duskCross: 1,
  risingPair: 1,
  scissorTurn: 1,
  moonrise: 0,
  wingCut: 0,
  twinWheel: 1,
};

/** the blow at this place in the move is the short blade's */
export const shortBlowAt = (id: VesperMoveId, index: number): boolean => SHORT_BLOW[id] === index;
