import type { StageDef } from "../../types/campaign";
import { nightfall } from "./layout";

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
  areas: [nightfall],
};
