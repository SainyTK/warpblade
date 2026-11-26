import type { IconArt } from "../../../types/heroModule";
import { hex } from "../../../utils/color";
import { ICON_WHITE } from "./iconArt";

/** the front dodge looks the same for every hero: a chevron with speed lines */
export const DODGE: IconArt = {
  rows: [
    "....W....",
    "....WW...",
    "VV..WWW..",
    "...VWWWW.",
    "VVVVWWWWW",
    "...VWWWW.",
    "VV..WWW..",
    "....WW...",
    "....W....",
  ],
  colors: { W: ICON_WHITE, V: hex("#b4a8ff") },
};

export const WARP_STRIKE: IconArt = {
  rows: [
    ".......WW",
    "......WCW",
    ".....WCW.",
    "C...WCW..",
    ".C.WCW...",
    "..GWW....",
    ".CGG.....",
    "C..CC....",
    "...C.C...",
  ],
  colors: { W: ICON_WHITE, C: hex("#7fe3ff"), G: hex("#b4a8ff") },
};

/** the jump and the ultimate look the same for every hero */
export const JUMP: IconArt = {
  rows: ["....W....", "...WWW...", "..WW.WW..", ".WW...WW.", "....M....", "...MMM...", "..MM.MM..", ".MM...MM."],
  colors: { W: ICON_WHITE, M: hex("#9a94c4") },
};

export const NOVA: IconArt = {
  rows: [
    "....W....",
    ".K..P..K.",
    "...PWP...",
    "..PWWWP..",
    "WPPWWWPPW",
    "..PWWWP..",
    "...PWP...",
    ".K..P..K.",
    "....W....",
  ],
  colors: { W: ICON_WHITE, P: hex("#ff7ae0"), K: hex("#ffc8f2") },
};
