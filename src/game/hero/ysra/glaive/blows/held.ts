import { frame } from "../../../../../constants/hero";
import { GLAIVE_FEEL, LUNGE } from "../../../../../constants/ysra/glaive";
import type { MoveDef } from "../../../../../types/move";
import { LUNGE_BURST_AT, startLunge, stepLunge } from "../lunge";
import { glaiveHit } from "../reach";
import { G_POKE, G_THRUST } from "../slashes";

/** the heft's releases: the quick poke and the lunge through the line */
export const HELD_BLOWS = {
  heftPoke: {
    id: "heftPoke",
    name: "Quick poke",
    clip: "yPoke",
    pitch: 1,
    hits: [
      glaiveHit({
        at: frame(1),
        box: [4, -26, 38, -6],
        power: 1,
        kx: 90,
        ky: -10,
        slash: G_POKE,
        feel: GLAIVE_FEEL.poke,
      }),
    ],
  },
  heftLunge: {
    id: "heftLunge",
    name: "Heft lunge",
    clip: "yLunge",
    pitch: 0.7,
    finisher: true,
    guard: LUNGE.guard,
    ghosts: LUNGE_BURST_AT,
    // the line is pierced as she travels; this is the burst at the point where she stops
    hits: [
      glaiveHit({
        at: LUNGE_BURST_AT,
        box: [16, -28, 42, -4],
        power: 0.6,
        kx: 120,
        ky: -30,
        slash: G_THRUST,
        feel: GLAIVE_FEEL.thrust,
      }),
    ],
    enter: startLunge,
    step: stepLunge,
  },
} satisfies Record<string, MoveDef>;
