import type { HeroSkin } from "../../../types/character";
import { CERISE_BLADE } from "./blade";
import { CERISE_COLORS } from "./colors";
import { CERISE_HEAD, CERISE_HEAD_BACK } from "./head";
import { drawCeriseArm } from "./parts/arm";
import { CAPE_EXTRA } from "./parts/cape";
import { drawCeriseCoatTails } from "./parts/coatTails";
import { drawCeriseLeg } from "./parts/leg";
import { drawCeriseTorso } from "./parts/torso";
import { drawCeriseTrails } from "./parts/trails";
import { ROSE_GLOW, ROSE_RAMP, ROSE_SPARKS } from "./rose";

/**
 * How Cerise looks on the shared rig: her colours, head rows and rapier, her own fencing coat, sleeves, breeches and
 * boots, coat tails and side tail, and the short cape over the sword-side shoulder, all lit in rose.
 */
export const CERISE_SKIN: HeroSkin = {
  colors: CERISE_COLORS,
  head: CERISE_HEAD,
  headBack: CERISE_HEAD_BACK,
  blade: CERISE_BLADE,
  parts: {
    trails: drawCeriseTrails,
    arm: (s, shoulder, elbow, hand, front) => drawCeriseArm(s, shoulder, elbow, hand, front),
    leg: (s, hip, foot, toe, far) => drawCeriseLeg(s, hip, foot, toe, far),
    coatTails: drawCeriseCoatTails,
    torso: drawCeriseTorso,
  },
  extras: [CAPE_EXTRA],
  ramp: ROSE_RAMP,
  glow: ROSE_GLOW,
  sparks: ROSE_SPARKS,
};
