import type { MoveDef } from "../../../../types/move";
import type { GlaiveMoveId } from "../../../../types/ysra/glaive";

/** the glaive string. Placeholder: one long thrust until the real string lands. */
export const GLAIVE_MOVES: Record<GlaiveMoveId, MoveDef> = {
  glaiveThrust: {
    id: "glaiveThrust",
    name: "Glaive thrust",
    clip: "yThrust",
    hits: [{ at: 0.12, box: [0, -30, 40, -6], power: 1.3, kx: 70, ky: -20 }],
  },
};
