import type { HeroSkin } from "../../../types/character";
import { SAND_RAMP, SAND_SPARKS } from "../constants/palette";
import { ZAFIR_BLADE } from "./blade";
import { ZAFIR_COLORS } from "./colors";
import { drawShoulderDrape } from "./drape";
import { ZAFIR_HEAD, ZAFIR_HEAD_BACK } from "./head";
import { drawZafirHead } from "./headPart";
import { drawZafirArm, drawZafirLeg } from "./limbs";
import { drawZafirTorso } from "./torso";
import { drawZafirTrails } from "./trails";
import { drawZafirWraps } from "./wraps";

/**
 * How Zafir looks on the shared rig: a desert blade dancer in layered saffron wraps over cream, a head wrap with dark
 * curls, a turquoise sash with long ends, gold bangles, soft boots and a broad scimitar. He wears his own parts all over.
 */
export const ZAFIR_SKIN: HeroSkin = {
  colors: ZAFIR_COLORS,
  head: ZAFIR_HEAD,
  headBack: ZAFIR_HEAD_BACK,
  blade: ZAFIR_BLADE,
  scarfAt: "belt",
  parts: {
    trails: (s, rig) => drawZafirTrails(s, rig.tail, rig.scarf),
    arm: (s, shoulder, elbow, hand, front) => drawZafirArm(s, shoulder, elbow, hand, front),
    leg: (s, hip, foot, toe, far) => drawZafirLeg(s, hip, foot, toe, far),
    coatTails: drawZafirWraps,
    torso: drawZafirTorso,
    head: (s, rig) => drawZafirHead(s, rig, rig.back ? ZAFIR_HEAD_BACK : ZAFIR_HEAD),
  },
  extras: [{ layer: "overTorso", draw: drawShoulderDrape }],
  ramp: SAND_RAMP,
  glow: SAND_RAMP[4],
  sparks: SAND_SPARKS,
};
