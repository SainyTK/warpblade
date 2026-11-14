import type { Color } from "../../../types/color";
import type { IconArt } from "../../../types/heroModule";
import type { TouchButtonAction } from "../../../types/touch";
import { ICON_WHITE } from "../../../ui/touch/icons/iconArt";
import { DODGE, JUMP } from "../../../ui/touch/icons/sharedArt";
import { hex } from "../../../utils/color";
import { ABILITY_COLOR, CERISE_ABILITIES } from "../constants/abilities";
import type { CeriseAbility } from "../types/ability";

const ROSE = hex("#ff8fb0");
const SILVER = hex("#c4cadc");

/** her rapier on a slant: a needle blade, the curled guard and the rose crystal */
const RAPIER: IconArt = {
  rows: [
    "............W",
    "...........W.",
    "..........W..",
    ".........W...",
    "........W....",
    ".......W.....",
    "......W......",
    "..S..W.......",
    "...SR........",
    "..S.SS.......",
    ".H...S.......",
    "H............",
    ".............",
  ],
  colors: { W: ICON_WHITE, S: SILVER, R: ROSE, H: hex("#3c1f33") },
};

/** her guard: the rapier raised point up, a spark off its edge */
const GUARD: IconArt = {
  rows: [
    "......W..",
    ".....W.P.",
    ".....W..P",
    "....W.P..",
    "....W....",
    "...W.....",
    ".SRS.....",
    "..S......",
    ".H.......",
  ],
  colors: { W: ICON_WHITE, S: SILVER, R: ROSE, H: hex("#3c1f33"), P: hex("#ffe1eb") },
};

/** each ability's face */
const ABILITY_ART: Record<CeriseAbility, IconArt> = {
  flurry: {
    rows: [
      ".........",
      "..WWWWWW.",
      ".........",
      "WWWWWWWWW",
      ".........",
      "..WWWWWW.",
      ".........",
      ".WWWWWWW.",
      ".........",
    ],
    colors: { W: ABILITY_COLOR.flurry },
  },
  line: {
    rows: [
      ".........",
      ".........",
      ".........",
      "C......W.",
      "CCCCCCCWW",
      "C......W.",
      ".........",
      ".........",
      ".........",
    ],
    colors: { W: ICON_WHITE, C: ABILITY_COLOR.line },
  },
  bloom: {
    rows: [
      "....P....",
      ".P..W..P.",
      "..P.P.P..",
      "...PPP...",
      "PWPPWPPWP",
      "...PPP...",
      "..P.P.P..",
      ".P..W..P.",
      "....P....",
    ],
    colors: { W: ICON_WHITE, P: ABILITY_COLOR.bloom },
  },
  needle: {
    rows: [
      "N...N...N",
      "N...N...N",
      "N...N...N",
      "N...N...N",
      "N...N...N",
      "W...W...W",
      ".........",
      "PPPPPPPPP",
      ".........",
    ],
    colors: { W: ICON_WHITE, N: ABILITY_COLOR.needle, P: ROSE },
  },
  mirror: {
    rows: [
      "..MMMMM..",
      ".M.....M.",
      "M...W...M",
      "M...W...M",
      "M...W...M",
      "M..SRS..M",
      "M...S...M",
      ".M.....M.",
      "..MMMMM..",
    ],
    colors: { W: ICON_WHITE, M: ABILITY_COLOR.mirror, S: SILVER, R: ROSE },
  },
};

/** Rose Tempest: a fan of streaks closing on a point */
const TEMPEST: IconArt = {
  rows: [
    "P........",
    "PPP......",
    "..PPP....",
    "....PPP..",
    "WWWWWWWWW",
    "....PPP..",
    "..PPP....",
    "PPP......",
    "P........",
  ],
  colors: { W: ICON_WHITE, P: ROSE },
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

/** the switch button: a dot per ability she holds round a ring, the selected one white */
function abilityRing(selected: CeriseAbility, known: readonly string[]): IconArt {
  const rows = Array.from({ length: 9 }, () => Array<string>(9).fill("."));
  CERISE_ABILITIES.forEach((a, i) => {
    if (!known.includes(a)) return;
    const [x, y] = RING_DOTS[i];
    rows[y][x] = a === selected ? "W" : RING_KEYS[i];
  });
  const colors: Record<string, Color> = { W: ICON_WHITE };
  CERISE_ABILITIES.forEach((a, i) => {
    colors[RING_KEYS[i]] = ABILITY_COLOR[a];
  });
  return { rows: rows.map((r) => r.join("")), colors };
}

/** Cerise's button art, per action, selected ability and the abilities she holds */
export function ceriseArt(action: TouchButtonAction, ability: CeriseAbility, known: readonly string[]): IconArt {
  switch (action) {
    case "attack":
      return RAPIER;
    case "up":
      return JUMP;
    case "dash":
      return DODGE;
    case "guard":
      return GUARD;
    case "cast":
      return ABILITY_ART[ability] ?? ABILITY_ART.flurry;
    case "cycle":
      return abilityRing(ability, known);
    case "ultimate":
      return TEMPEST;
  }
}
