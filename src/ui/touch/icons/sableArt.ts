import type { TouchButtonAction } from "../../../types/touch";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt } from "./iconArt";
import { JUMP, NOVA } from "./sharedArt";

const JADE = hex("#6ee0a0");
const PALE = hex("#c4ffd8");
const WOOD = hex("#5a3a24");
const STEEL = hex("#9ad8b8");
const BONE = hex("#ccb88c");

/** a crossbow side on: stock, limbs and a bolt on the rail */
const CROSSBOW: IconArt = {
  rows: ["........L...", ".......L....", "WWWWWWWWBBBP", "SSSSSSSL....", "SS.....L....", "S.......L..."],
  colors: { W: WOOD, S: WOOD, L: STEEL, B: JADE, P: ICON_WHITE },
};

/** a hop back: an arc to the left over a bolt flying right */
const HOP: IconArt = {
  rows: ["..AAAA...", ".A....A..", "A......A.", "VA.......", ".........", "...BBBP..", "........."],
  colors: { A: JADE, V: PALE, B: JADE, P: ICON_WHITE },
};

/** a boot driving forward */
const KICK: IconArt = {
  rows: ["..BB.....", "..BB.....", "..BBB....", "..BBBBBWW", "..BBBBBBW", "...DDDDD."],
  colors: { B: BONE, D: WOOD, W: ICON_WHITE },
};

/** open jaws of a snare with a glowing plate */
const SNARE: IconArt = {
  rows: ["T.T...T.T", "TTT...TTT", ".T.....T.", ".SSSPSSS.", "SSSSSSSSS"],
  colors: { T: ICON_WHITE, S: hex("#8a9aa0"), P: hex("#e88a4c") },
};

/** the crank turning: a circle of arrows */
const RELOAD: IconArt = {
  rows: ["..PPPP...", ".P....PP.", "P.....PPP", "P........", "P.....P..", ".P...P...", "..PPP...."],
  colors: { P: PALE },
};

/** Sable's buttons: the crossbow, the hop, the kick, the snare and the reload */
export function sableArt(action: TouchButtonAction): IconArt {
  switch (action) {
    case "attack":
      return CROSSBOW;
    case "up":
      return JUMP;
    case "dash":
      return HOP;
    case "guard":
      return KICK;
    case "cast":
      return SNARE;
    case "cycle":
      return RELOAD;
    case "ultimate":
      return NOVA;
  }
}
