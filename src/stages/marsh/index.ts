import type { StageDef } from "../../types/campaign";
import { rung } from "../geometry";
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
  ladder: [
    ...rung(1, "bogling", "fenmidge"),
    ...rung(2, "mire", "stormkite"),
    ...rung(3, "bogleech"),
    ...rung(4, "mossback"),
    ...rung(5, "voltfly"),
    ...rung(6, "reedseer"),
    ...rung(7, "thunderray"),
    ...rung(8, "stormgator"),
  ],
  boss: "boghulk",
  mini: {
    name: "The Mire King",
    epithet: "Croaker in the Deep Reeds",
    base: "mire",
    light: 0x7fd0ff,
    power: 1,
    moves: ["spikes", "call"],
    adds: ["bogleech", "stormkite"],
  },
  twist: { name: "Swarming Fen", text: "More foes crowd each surge.", crowd: 1.3 },
  grantsArt: "mirespit",
  weakTo: "sporeburst",
  areas: AREAS,
  hazard: createMarshHazard(AREAS),
};
