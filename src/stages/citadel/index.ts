import type { StageDef } from "../../types/campaign";
import { depths } from "./depths";
import { lastWatch } from "./last-watch";
import { threshold } from "./threshold";

export const citadel: StageDef = {
  id: "citadel",
  name: "Abyss Citadel",
  mapBlurb: "Every rift leads here.",
  kind: "citadel",
  era: "abyss",
  ground: "stalker",
  flyer: "eye",
  boss: "unblinking",
  areas: [threshold, depths, lastWatch],
};
