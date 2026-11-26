import type { StageDef } from "../../types/campaign";
import { graveRow } from "./graveRow";
import { createMoonlitHazard } from "./hazard";
import { lanternWalk } from "./lanternWalk";
import { nightfall } from "./nightfall";

const AREAS = [graveRow, lanternWalk, nightfall] as const;

export const moonlit: StageDef = {
  id: "moonlit",
  name: "Moonlit Ruins",
  mapBlurb: "A shepherd herds the husks of the old city.",
  kind: "rift",
  era: "night",
  ground: "husk",
  flyer: "wisp",
  boss: "shepherd",
  grantsArt: "gloamlantern",
  weakTo: "inkwave",
  areas: AREAS,
  hazard: createMoonlitHazard(AREAS),
};
