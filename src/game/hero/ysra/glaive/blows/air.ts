import { frame } from "../../../../../constants/hero";
import { GLAIVE_FEEL, REAPER } from "../../../../../constants/ysra/glaive";
import type { MoveDef, MoveHit } from "../../../../../types/move";
import { skillValues } from "../../../../skills/query";
import { lift } from "../../../lift";
import { glaiveHit } from "../reach";
import { reaped } from "../reap";
import { G_AIR_REAP, G_AIR_RISE } from "../slashes";

/** two air sweeps before she lands (Firewalk): each throws the foe up with her */
const reaps = (): boolean => (skillValues("y_firewalk").sweeps ?? 1) >= 2;
/** Sunreap's numbers; empty when not held */
const sunreap = () => skillValues("y_reap");

/** an air sweep: Sunreap sets its power, its sweep behind and its spike; it throws the foe up with her once she may
 *  sweep twice */
function reaping(hit: MoveHit): MoveHit {
  return Object.defineProperties(glaiveHit(hit, { power: () => sunreap().power ?? hit.power }), {
    launch: { get: () => (reaps() ? REAPER.launch : undefined), enumerable: true },
    around: { get: () => !!sunreap().around, enumerable: true },
    spike: { get: () => !!sunreap().spike, enumerable: true },
  });
}

/** after a sweep: Sunreap's fire, and a sweep that throws the foe up lifts her up after it */
function afterReap(hits: number): void {
  reaped(hits);
  if (reaps()) lift(REAPER.lift, false);
}

/** her air game: one wide sweep before she lands, two with Firewalk; she drops with the weight of the glaive */
export const AIR_BLOWS = {
  airReap: {
    id: "airReap",
    name: "Air reap",
    clip: "yAirReap",
    pitch: 0.8,
    falls: true,
    hits: [
      reaping({
        at: frame(5),
        box: [-14, -44, 42, 8],
        power: 1.3,
        kx: 120,
        ky: -40,
        slash: G_AIR_REAP,
        feel: GLAIVE_FEEL.sweep,
      }),
    ],
    afterHit: afterReap,
  },
  airReapRise: {
    id: "airReapRise",
    name: "Rising reap",
    clip: "yAirReapRise",
    pitch: 0.9,
    falls: true,
    hits: [
      reaping({
        at: frame(5),
        box: [-10, -50, 40, 4],
        power: 1.3,
        kx: 90,
        ky: -60,
        slash: G_AIR_RISE,
        feel: GLAIVE_FEEL.sweep,
      }),
    ],
    afterHit: afterReap,
  },
} satisfies Record<string, MoveDef>;
