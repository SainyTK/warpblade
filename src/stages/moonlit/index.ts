import type { StageDef } from "../../types/campaign";
import { rung } from "../geometry";
import { graveRow } from "./graveRow";
import { createMoonlitHazard } from "./hazard";
import { lanternWalk } from "./lanternWalk";
import { nightfall } from "./nightfall";

const AREAS = [graveRow, lanternWalk, nightfall] as const;

export const moonlit: StageDef = {
  id: "moonlit",
  name: "Moonlit Ruins",
  mapBlurb: "A shepherd herds the husks of the old city.",
  era: "night",
  ladder: [
    ...rung(1, "rattleskull", "wickling"),
    ...rung(2, "husk", "wisp"),
    ...rung(3, "lanternshade"),
    ...rung(4, "gravedigger"),
    ...rung(5, "keenwraith"),
    ...rung(6, "barrowhound"),
    ...rung(7, "tollbell"),
    ...rung(8, "barrowlord"),
  ],
  boss: "shepherd",
  mini: {
    name: "Gravewarden",
    epithet: "Who Walks the Grave Rows",
    base: "husk",
    light: 0xc8d4ff,
    power: 1,
    moves: ["pillars", "call"],
    adds: ["wisp", "lanternshade"],
  },
  twist: { name: "Gloam Tithe", text: "More gold, fewer hearts.", coins: 1.5, heartChance: 0.5 },
  grantsArt: "gloamlantern",
  weakTo: "inkwave",
  areas: AREAS,
  hazard: createMoonlitHazard(AREAS),
};
