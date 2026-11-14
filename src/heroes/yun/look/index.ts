import type { HeroSkin } from "../../../types/character";
import { YUN_BLADE } from "./blade";
import { JADE, JADE_SPARKS, YUN_COLORS } from "./colors";
import { YUN_HEAD, YUN_HEAD_BACK } from "./head";
import { drawRobeFlap, drawRobeSkirt, drawRobeTorso, drawSleeveArm, drawWrappedLeg } from "./robe";
import { drawYunTrails } from "./trails";

export { JADE, JADE_SPARKS } from "./colors";

/**
 * How Yun looks on the shared rig: layered pale robes with long sleeves and a jade sash, slate trousers with shin wraps,
 * black hair in a topknot whose long ends trail, and the jian with its tassel. His own parts replace the coat,
 * breastplate, pauldron, plated sleeves and boots of the shared ones.
 */
export const YUN_SKIN: HeroSkin = {
  colors: YUN_COLORS,
  head: YUN_HEAD,
  headBack: YUN_HEAD_BACK,
  blade: YUN_BLADE,
  scarfAt: "belt",
  parts: {
    trails: drawYunTrails,
    arm: (s, shoulder, elbow, hand, front) => drawSleeveArm(s, shoulder, elbow, hand, front),
    leg: (s, hip, foot, toe, far) => drawWrappedLeg(s, hip, foot, toe, far),
    coatTails: drawRobeSkirt,
    torso: drawRobeTorso,
  },
  extras: [{ layer: "underTorso", draw: drawRobeFlap }],
  ramp: JADE,
  glow: JADE[3],
  sparks: JADE_SPARKS,
};
