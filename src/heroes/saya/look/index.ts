import type { HeroSkin } from "../../../types/character";
import { SAYA_BLADE } from "./blade";
import { SAYA_COLORS } from "./colors";
import { drawSayaTrails } from "./hair";
import { SAYA_HEAD, SAYA_HEAD_BACK } from "./head";
import { drawSayaHead } from "./headPart";
import { INK_RAMP, INK_SPARKS } from "./ramp";
import { drawRobe, drawSkirt } from "./robe";
import { SAYA_SCABBARD } from "./scabbard";
import { drawSleeveArm } from "./sleeve";
import { drawTrouserLeg } from "./trousers";

/**
 * How Saya looks on the shared rig: a moon-white short robe with wide sleeves over flared indigo trousers, a cord sash
 * whose ends trail from the belt, a long tail tied high, the katana and its black lacquer scabbard at her hip, and ink
 * effects with a white edge.
 */
export const SAYA_SKIN: HeroSkin = {
  colors: SAYA_COLORS,
  head: SAYA_HEAD,
  headBack: SAYA_HEAD_BACK,
  blade: SAYA_BLADE,
  offhand: SAYA_SCABBARD,
  scarfAt: "belt",
  parts: {
    trails: drawSayaTrails,
    arm: (s, shoulder, elbow, hand, front) => drawSleeveArm(s, shoulder, elbow, hand, front),
    leg: (s, hip, foot, toe, far) => drawTrouserLeg(s, hip, foot, toe, far),
    coatTails: drawSkirt,
    torso: drawRobe,
    head: (s, rig) => drawSayaHead(s, rig, rig.back ? SAYA_HEAD_BACK : SAYA_HEAD),
  },
  ramp: INK_RAMP,
  glow: INK_RAMP[4],
  sparks: INK_SPARKS,
};
