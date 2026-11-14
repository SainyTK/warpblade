import type { Color } from "../../../types/color";
import type { IconArt } from "../../../types/heroModule";
import type { TouchButtonAction } from "../../../types/touch";
import { ICON_WHITE } from "../../../ui/touch/icons/iconArt";
import { DODGE, JUMP } from "../../../ui/touch/icons/sharedArt";
import { hex } from "../../../utils/color";
import { ABILITY_COLOR, VESPER_ABILITIES } from "../constants/abilities";
import type { VesperAbility } from "../types/ability";

const PALE = hex("#e2def4");
const VIOLET = hex("#b8a0ff");
const DARK = hex("#4e4870");
const SILVER = hex("#bdb8d6");
const GRIP = hex("#6a4e66");

/** the attack button: the long blade rising to the right, the short blade crossing low */
const BLADES: IconArt = {
  rows: [
    "............W",
    "...........WP",
    "..........WP.",
    ".........WP..",
    "........WP...",
    ".......WP....",
    "...S..WP.....",
    "....SVP......",
    ".....S..E....",
    "....G..E.....",
    "...G..ED.....",
    "..G..ED.S....",
    ".......S.....",
  ],
  colors: { W: ICON_WHITE, P: PALE, V: VIOLET, S: SILVER, G: GRIP, E: VIOLET, D: DARK },
};

/** the guard: both blades crossed in an X, a spark at the cross */
const GUARD: IconArt = {
  rows: [
    "W.......D",
    ".P.....D.",
    "..P...E..",
    "...PWE...",
    "....W....",
    "...EWP...",
    "..E...P..",
    ".S.....S.",
    "G.......G",
  ],
  colors: { W: ICON_WHITE, P: PALE, E: VIOLET, D: DARK, S: SILVER, G: GRIP },
};

/** the ultimate: a ring of cuts with a spark in it */
const WALTZ: IconArt = {
  rows: [
    "...VVV...",
    ".V.....V.",
    "V...W...V",
    "V..WWW..V",
    "V.W.W.W.V",
    "V...W...V",
    "V.......V",
    ".V.....V.",
    "...VVV...",
  ],
  colors: { W: ICON_WHITE, V: VIOLET },
};

const ABILITY_ART: Record<VesperAbility, IconArt> = {
  crescent: {
    rows: [
      ".C.......",
      "..CC.....",
      "....CC...",
      "......CW.",
      ".....WW..",
      "......NW.",
      "....NN...",
      "..NN.....",
      ".N.......",
    ],
    colors: { W: ICON_WHITE, C: ABILITY_COLOR.crescent, N: DARK },
  },
  stitch: {
    rows: [
      "W.......W",
      ".S.....S.",
      "..S...S..",
      "...S.S...",
      "....W....",
      "...S.S...",
      "..S...S..",
      ".S.....S.",
      "W.......W",
    ],
    colors: { W: ICON_WHITE, S: ABILITY_COLOR.stitch },
  },
  moon: {
    rows: [
      "..MMM....",
      ".MM......",
      "MM.......",
      "MM.......",
      ".MM......",
      "..MMM....",
      ".........",
      "..R...R..",
      "...RRR...",
    ],
    colors: { M: ABILITY_COLOR.moon, R: VIOLET },
  },
  gale: {
    rows: [
      "..GGGG...",
      ".G....G..",
      "...GG..G.",
      "..G..G.G.",
      "..G.W..G.",
      "...GG.G..",
      "......G..",
      "..GGGG...",
      ".........",
    ],
    colors: { W: ICON_WHITE, G: ABILITY_COLOR.gale },
  },
  thread: {
    rows: [
      ".......FF",
      "......FFF",
      ".....T.F.",
      "....T....",
      "...T.....",
      "..T......",
      ".T.......",
      "W........",
      ".........",
    ],
    colors: { W: ICON_WHITE, T: ABILITY_COLOR.thread, F: VIOLET },
  },
};

/** where each ability's dot sits on the switch button's ring, in the order O turns through them */
const RING_DOTS: readonly [number, number][] = [
  [4, 0],
  [8, 3],
  [6, 8],
  [2, 8],
  [0, 3],
];
const RING_KEYS = ["A", "B", "C", "D", "E"] as const;

/** the switch button: a dot per ability she holds round a ring, in its own colour, the selected one white */
function abilityRing(selected: VesperAbility, known: readonly VesperAbility[]): IconArt {
  const rows = Array.from({ length: 9 }, () => Array<string>(9).fill("."));
  VESPER_ABILITIES.forEach((a, i) => {
    if (!known.includes(a)) return;
    const [x, y] = RING_DOTS[i];
    rows[y][x] = a === selected ? "W" : RING_KEYS[i];
  });
  const colors: Record<string, Color> = { W: ICON_WHITE };
  VESPER_ABILITIES.forEach((a, i) => {
    colors[RING_KEYS[i]] = ABILITY_COLOR[a];
  });
  return { rows: rows.map((r) => r.join("")), colors };
}

/** Vesper's button art, per action, selected ability and the abilities she holds */
export function vesperArt(action: TouchButtonAction, ability: VesperAbility, known: readonly VesperAbility[]): IconArt {
  switch (action) {
    case "attack":
      return BLADES;
    case "up":
      return JUMP;
    case "dash":
      return DODGE;
    case "guard":
      return GUARD;
    case "cast":
      return ABILITY_ART[ability] ?? ABILITY_ART.crescent;
    case "cycle":
      return abilityRing(ability, known);
    case "ultimate":
      return WALTZ;
  }
}
