import type { RigExtra, RigParts } from "../../../../types/rig";
import { CARRIED, drawAnvilheart } from "../blade";
import { drawBrynnArm } from "./arm";
import { drawBrynnHead } from "./head";
import { drawBrynnLeg } from "./leg";
import { drawBrynnPouch } from "./pouch";
import { drawBrynnTorso } from "./torso";
import { drawBrynnTrails } from "./trails";

/** Brynn's own rig parts in place of the shared ones */
export const BRYNN_PARTS: Partial<RigParts> = {
  trails: drawBrynnTrails,
  arm: drawBrynnArm,
  leg: (s, hip, foot, toe, far) => drawBrynnLeg(s, hip, foot, toe, far),
  coatTails: drawBrynnPouch,
  torso: drawBrynnTorso,
  head: drawBrynnHead,
};

/** Anvilheart carried on the back of her shoulder, behind her body, while her pose's blade state says so */
export const BRYNN_EXTRAS: readonly RigExtra[] = [
  {
    layer: "behind",
    draw: (s, rig) => {
      if (rig.armed && rig.pose.bs >= CARRIED) drawAnvilheart(s, rig.nearHand, rig.pose.sa);
    },
  },
];
