import { frame } from "../../../../../constants/hero";
import { GLAIVE_FEEL, REAPER } from "../../../../../constants/ysra/glaive";
import type { MoveDef, MoveHit } from "../../../../../types/move";
import { hasPerk } from "../../../../progress";
import { lift } from "../../../lift";
import { glaiveHit } from "../reach";
import { G_AIR_REAP, G_AIR_RISE } from "../slashes";

/** High Reaper: an air sweep throws the foe up with her */
function reaping(hit: MoveHit): MoveHit {
  const base = glaiveHit(hit);
  return Object.defineProperty(base, "launch", {
    get: () => (hasPerk("highReaper") ? REAPER.launch : undefined),
    enumerable: true,
  });
}

/** High Reaper lifts her up after the foe as the sweep lands */
const rise = (): void => {
  if (hasPerk("highReaper")) lift(REAPER.lift, false);
};

/** her air game: one wide sweep before she lands, two with High Reaper; she drops with the weight of the glaive */
export const AIR_BLOWS = {
  airReap: {
    id: "airReap",
    name: "Air reap",
    clip: "yAirReap",
    pitch: 0.8,
    falls: true,
    hits: [
      reaping({
        at: frame(4),
        box: [-14, -44, 42, 8],
        power: 1.3,
        kx: 120,
        ky: -40,
        slash: G_AIR_REAP,
        feel: GLAIVE_FEEL.sweep,
      }),
    ],
    afterHit: rise,
  },
  airReapRise: {
    id: "airReapRise",
    name: "Rising reap",
    clip: "yAirReapRise",
    pitch: 0.9,
    falls: true,
    hits: [
      reaping({
        at: frame(4),
        box: [-10, -50, 40, 4],
        power: 1.3,
        kx: 90,
        ky: -60,
        slash: G_AIR_RISE,
        feel: GLAIVE_FEEL.sweep,
      }),
    ],
    afterHit: rise,
  },
} satisfies Record<string, MoveDef>;
