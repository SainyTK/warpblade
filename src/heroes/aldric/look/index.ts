import type { HeroSkin } from "../../../types/character";
import { DAWN_RAMP, DAWN_SPARKS } from "../constants/light";
import { ALDRIC_BLADE } from "./blade";
import { drawCape } from "./cape";
import { ALDRIC_COLORS } from "./colors";
import { ALDRIC_HEAD, ALDRIC_HEAD_BACK } from "./head";
import { ALDRIC_SHIELD, RAISED_SHIELD } from "./shield";
import { drawAldricTorso } from "./torso";

/** How Aldric looks on the shared rig: plate over a white tabard, a half cape, his arming sword and kite shield. */
export const ALDRIC_SKIN: HeroSkin = {
  colors: ALDRIC_COLORS,
  head: ALDRIC_HEAD,
  headBack: ALDRIC_HEAD_BACK,
  blade: ALDRIC_BLADE,
  offhand: ALDRIC_SHIELD,
  parts: { trails: drawCape, torso: drawAldricTorso },
  extras: [RAISED_SHIELD],
  ramp: DAWN_RAMP,
  glow: DAWN_RAMP[4],
  sparks: DAWN_SPARKS,
};
