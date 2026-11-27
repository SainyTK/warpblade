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
  mini: {
    name: "Rot Queen",
    epithet: "Mother of the Crawling Root",
    base: "rotcrawler",
    light: 0x9fe05a,
    power: 1,
    moves: ["spikes", "call"],
    adds: ["sporepuff", "rotcrawler"],
  },
  twist: { name: "Rot Bloom", text: "Hearts never drop.", heartChance: 0 },
  grantsArt: "sporeburst",
  weakTo: "riftlance",
  areas: BLIGHT_AREAS,
  hazard: blightHazard,
};
