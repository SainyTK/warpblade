import type { HeroSkin } from "../../../types/character";
import { CRIMSON, CRIMSON_SPARKS } from "../constants/colors";
import { BRYNN_BLADE } from "./blade";
import { BRYNN_COLORS } from "./colors";
import { BRYNN_HEAD, BRYNN_HEAD_BACK } from "./head";
import { BRYNN_EXTRAS, BRYNN_PARTS } from "./parts";

/**
 * How Brynn looks on the shared rig: her colours, head rows and Anvilheart; her own arms, legs, torso, head, headband
 * tails and sash; and the greatsword carried behind her shoulder as an extra.
 */
export const BRYNN_SKIN: HeroSkin = {
  colors: BRYNN_COLORS,
  head: BRYNN_HEAD,
  headBack: BRYNN_HEAD_BACK,
  blade: BRYNN_BLADE,
  parts: BRYNN_PARTS,
  extras: BRYNN_EXTRAS,
  scarfAt: "belt",
  ramp: CRIMSON,
  glow: CRIMSON[4],
  sparks: CRIMSON_SPARKS,
};
