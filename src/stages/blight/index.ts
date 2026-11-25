import type { StageDef } from "../../types/campaign";
import { blightHazard } from "./hazard";
import { BLIGHT_AREAS } from "./layout";

export const blight: StageDef = {
  id: "blight",
  name: "Blightroot Hollow",
  mapBlurb: "The rot grows toward the light.",
  kind: "rift",
  era: "blight",
  ground: "rotcrawler",
  flyer: "sporepuff",
  boss: "sporeheart",
  grantsArt: "sporeburst",
  weakTo: "riftlance",
  areas: BLIGHT_AREAS,
  hazard: blightHazard,
};
