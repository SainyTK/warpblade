import type { TouchButtonAction } from "../../../types/touch";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt } from "./iconArt";
import { JUMP, NOVA } from "./sharedArt";

const IRON = hex("#b4bcc4");
const IRON_DARK = hex("#78828c");
const WRAP = hex("#d8c8ac");
const RUST = hex("#ff5f6d");
const RUST_DARK = hex("#c43848");
const PALE = hex("#ffc2b8");

/** an iron gauntlet's fist side on, knuckle studs leading, the wrist wrapped */
const FIST: IconArt = {
  rows: ["...IIIII..", "..IIIIIIW.", "WWIIIIIIIW", "WWIDDDIIW.", "WWIIIIII..", "...IIII..."],
  colors: { I: IRON, D: IRON_DARK, W: WRAP },
};

/** a shoulder lowered behind speed lines */
const RUSH: IconArt = {
  rows: ["....RRRR.", "RR.RRRRRR", "...RRRRRR", "RRR.RRRR.", "....DDD..", "RR..DDD.."],
  colors: { R: RUST, D: RUST_DARK },
};

/** two open hands closing round a body */
const GRAB: IconArt = {
  rows: ["II.....II", "II.....II", ".II.F.II.", "..IIFII..", "...FFF...", "...F.F..."],
  colors: { I: IRON, F: PALE },
};

/** rings rolling out from an open mouth */
const BELLOW: IconArt = {
  rows: ["...P...P..", "..P...P...", ".P.MM.P..P", ".P.MM.P..P", "..P...P...", "...P...P.."],
  colors: { P: PALE, M: RUST },
};

/** a fist on a chest with a ring around it */
const TAUNT: IconArt = {
  rows: ["..GGGGG..", ".G.....G.", "G..III..G", "G..IWI..G", ".G.....G.", "..GGGGG.."],
  colors: { G: hex("#e0ac48"), I: IRON, W: ICON_WHITE },
};

/** Hulda's buttons: the fist, the rush, the grab, the bellow and the taunt */
export function huldaArt(action: TouchButtonAction): IconArt {
  switch (action) {
    case "attack":
      return FIST;
    case "up":
      return JUMP;
    case "dash":
      return RUSH;
    case "warp":
      return GRAB;
    case "cast":
      return BELLOW;
    case "cycle":
      return TAUNT;
    case "ultimate":
      return NOVA;
  }
}
