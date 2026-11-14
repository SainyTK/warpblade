import type { HeroSkin } from "../../../types/character";
import { PHOSPHOR, PHOSPHOR_SPARKS } from "../constants/colors";
import { drawCalderArm } from "./arm";
import { BANDOLIER } from "./bandolier";
import { CALDER_BLADE } from "./blade";
import { drawDuster } from "./coat";
import { CALDER_COLORS } from "./colors";
import { GOGGLES } from "./goggles";
import { CALDER_HEAD, CALDER_HEAD_BACK } from "./head";
import { drawNeckScarf } from "./scarf";

/**
 * How Calder looks on the shared rig: his colours, head rows and chamber sword, his own duster, sleeves and neck scarf in
 * place of the shared coat tails, arms and trails, and his bandolier and goggles as extras. He wears the shared torso,
 * legs and head.
 */
export const CALDER_SKIN: HeroSkin = {
  colors: CALDER_COLORS,
  head: CALDER_HEAD,
  headBack: CALDER_HEAD_BACK,
  blade: CALDER_BLADE,
  parts: {
    trails: drawNeckScarf,
    arm: (s, shoulder, elbow, hand, front) => drawCalderArm(s, shoulder, elbow, hand, front),
    coatTails: drawDuster,
  },
  extras: [BANDOLIER, GOGGLES],
  ramp: PHOSPHOR,
  glow: PHOSPHOR[4],
  sparks: PHOSPHOR_SPARKS,
};
