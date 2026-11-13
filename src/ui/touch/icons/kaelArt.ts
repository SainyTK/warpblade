import { ABILITY_COLOR } from "../../../constants/palette";
import { KAEL_ABILITIES } from "../../../constants/spells";
import type { Color } from "../../../types/color";
import type { KaelAbility } from "../../../types/spell";
import type { TouchButtonAction } from "../../../types/touch";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt } from "./iconArt";
import { DODGE, JUMP, NOVA } from "./sharedArt";

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

/** Kael's guard: the crystal sword raised upright, a riposte spark off its edge */
const GUARD: IconArt = {
  rows: [
    "....W..S.",
    "....WC...",
    "....WC.S.",
    "....WC...",
    "....WC...",
    "....WC...",
    "..BBBBB..",
    "....G....",
    "....P....",
  ],
  colors: {
    W: ICON_WHITE,
    C: hex("#7fe3ff"),
    B: hex("#e0ac48"),
    G: hex("#7a5236"),
    P: hex("#ffd27a"),
    S: hex("#a8ecff"),
  },
};

const SPELLS: Record<KaelAbility, IconArt> = {
  lance: {
    rows: [
      ".........",
      "....C....",
      ".....CC..",
      "......CW.",
      "WWWWWWCWW",
      "......CW.",
      ".....CC..",
      "....C....",
      ".........",
    ],
    colors: { W: ICON_WHITE, C: hex("#7fe3ff") },
  },
  burst: {
    rows: [
      "....W....",
      ".C..C..C.",
      "..C...C..",
      ".........",
      "WC..W..CW",
      ".........",
      "..C...C..",
      ".C..C..C.",
      "....W....",
    ],
    colors: { W: ICON_WHITE, C: hex("#a8ecff") },
  },
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

/** where each ability's dot sits on the switch button, in rotation order round a ring */
const RING_DOTS: readonly (readonly [number, number])[] = [
  [4, 0],
  [8, 3],
  [6, 8],
  [2, 8],
  [0, 3],
];
const RING_KEYS = ["A", "B", "C", "D", "E"] as const;

/** the switch button: a dot per ability Kael holds round a ring, in its own colour, the selected one with a white core */
function abilityRing(selected: KaelAbility, known: readonly KaelAbility[]): IconArt {
  const rows = Array.from({ length: 9 }, () => Array<string>(9).fill("."));
  KAEL_ABILITIES.forEach((a, i) => {
    if (!known.includes(a)) return;
    const [x, y] = RING_DOTS[i];
    rows[y][x] = a === selected ? "W" : RING_KEYS[i];
  });
  const colors: Record<string, Color> = { W: ICON_WHITE };
  KAEL_ABILITIES.forEach((a, i) => {
    colors[RING_KEYS[i]] = ABILITY_COLOR[a];
  });
  return { rows: rows.map((r) => r.join("")), colors };
}

/** Kael's button art, per action, selected ability and the abilities he holds */
export function kaelArt(action: TouchButtonAction, ability: KaelAbility, known: readonly KaelAbility[]): IconArt {
  switch (action) {
    case "attack":
      return SWORD;
    case "up":
      return JUMP;
    case "dash":
      return DODGE;
    case "guard":
      return GUARD;
    case "cast":
      return SPELLS[ability];
    case "cycle":
      return abilityRing(ability, known);
    case "ultimate":
      return NOVA;
  }
}
