import { ELEMENTS } from "../../../constants/combat";
import { ELEMENT_COLOR } from "../../../constants/palette";
import type { Element } from "../../../types/spell";
import type { TouchButtonAction } from "../../../types/touch";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt, ringArt } from "./iconArt";
import { JUMP, NOVA } from "./sharedArt";

const SWORD: IconArt = {
  rows: [
    "............W",
    "...........WC",
    "..........WC.",
    ".........WC..",
    "........WC...",
    ".......WC....",
    "...B..WC.....",
    "....BWC......",
    ".....B.......",
    "....G.B......",
    "...G...B.....",
    "..G..........",
    ".P...........",
  ],
  colors: { W: ICON_WHITE, C: hex("#7fe3ff"), B: hex("#e0ac48"), G: hex("#7a5236"), P: hex("#ffd27a") },
};

const DASH: IconArt = {
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

const WARP: IconArt = {
  rows: [
    "....W....",
    "...WAC...",
    "..WAACC..",
    ".WAACCCB.",
    "WAACCCCBB",
    ".ACCCCBB.",
    "..CCCBB..",
    "...CBB...",
    "....B....",
  ],
  colors: { W: ICON_WHITE, A: hex("#a8ecff"), C: hex("#5ec8ef"), B: hex("#2f86c4") },
};

const SPELLS: Record<Element, IconArt> = {
  fire: {
    rows: [
      "....F....",
      "...FF....",
      "...FOF.F.",
      "..FOOFFF.",
      ".FOYYOOF.",
      ".FOYWYOF.",
      "FOYWWWYOF",
      ".FOYWYOF.",
      "..FFOFF..",
    ],
    colors: { F: hex("#f2561d"), O: hex("#ff8a2a"), Y: hex("#ffe26b"), W: hex("#fff3a6") },
  },
  ice: {
    rows: [
      "....W....",
      ".W..C..W.",
      "..W.C.W..",
      "...CCC...",
      "WCCCWCCCW",
      "...CCC...",
      "..W.C.W..",
      ".W..C..W.",
      "....W....",
    ],
    colors: { W: ICON_WHITE, C: hex("#8fd3f2") },
  },
  volt: {
    rows: [
      "....WWW..",
      "...WYY...",
      "..WYY....",
      ".WYYYYYY.",
      "....YYV..",
      "...YYV...",
      "..YYV....",
      "..YV.....",
      ".V.......",
    ],
    colors: { W: ICON_WHITE, Y: hex("#a9c8ff"), V: hex("#6f8bff") },
  },
};

/** Kael's button art, per action and selected element */
export function kaelArt(action: TouchButtonAction, element: Element): IconArt {
  switch (action) {
    case "attack":
      return SWORD;
    case "up":
      return JUMP;
    case "dash":
      return DASH;
    case "warp":
      return WARP;
    case "cast":
      return SPELLS[element];
    case "cycle":
      return ringArt(ELEMENTS.indexOf(element), [ELEMENT_COLOR.fire, ELEMENT_COLOR.ice, ELEMENT_COLOR.volt]);
    case "ultimate":
      return NOVA;
  }
}
