import type { StageDef } from "../../types/campaign";
import { rung } from "../geometry";
import { blightHazard } from "./hazard";
import { BLIGHT_AREAS } from "./layout";

export const blight: StageDef = {
  id: "blight",
  name: "Blightroot Hollow",
  mapBlurb: "The rot grows toward the light.",
  kind: "rift",
  era: "blight",
  ladder: [
    ...rung(1, "moldmite", "sporegnat"),
    ...rung(2, "rotcrawler", "sporepuff"),
    ...rung(3, "spitbloom"),
    ...rung(4, "rotboar"),
    ...rung(5, "cordywasp"),
    ...rung(6, "hyphamancer"),
    ...rung(7, "bloatcap"),
    ...rung(8, "rotbear"),
  ],
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
