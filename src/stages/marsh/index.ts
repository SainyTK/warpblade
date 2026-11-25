import type { StageDef } from "../../types/campaign";
import { createMarshHazard } from "./hazard";
import { leechFen } from "./leechFen";
import { reedwade } from "./reedwade";
import { storm } from "./storm";

const AREAS = [reedwade, leechFen, storm] as const;

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
  areas: AREAS,
  hazard: createMarshHazard(AREAS),
};
