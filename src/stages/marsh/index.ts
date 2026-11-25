import type { StageDef } from "../../types/campaign";
import { storm } from "./layout";

export const marsh: StageDef = {
  id: "marsh",
  name: "Storm Marsh",
  mapBlurb: "Rain, mud and the thing that sleeps in it.",
  kind: "rift",
  era: "rain",
  ground: "mire",
  flyer: "stormkite",
  boss: "boghulk",
  grantsArt: "mirespit",
  weakTo: "sporeburst",
  areas: [storm],
};
