import { frame } from "../../../../../constants/hero";
import { GLAIVE_FEEL, REAPER } from "../../../../../constants/ysra/glaive";
import type { MoveDef, MoveHit } from "../../../../../types/move";
import { skillValues } from "../../../../skills/query";
import { lift } from "../../../lift";
import { glaiveHit } from "../reach";
import { G_AIR_REAP, G_AIR_RISE } from "../slashes";

/** two air sweeps before she lands (Vault Strike): each throws the foe up with her */
const reaps = (): boolean => (skillValues("y_vault").sweeps ?? 1) >= 2;

/** an air sweep that throws the foe up with her once she may sweep twice */
function reaping(hit: MoveHit): MoveHit {
  const base = glaiveHit(hit);
  return Object.defineProperty(base, "launch", {
    get: () => (reaps() ? REAPER.launch : undefined),
    enumerable: true,
  });
}

/** a sweep that throws the foe up lifts her up after it */
const rise = (): void => {
  if (reaps()) lift(REAPER.lift, false);
};

/** her air game: one wide sweep before she lands, two with Vault Strike; she drops with the weight of the glaive */
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
