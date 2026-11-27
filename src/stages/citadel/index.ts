import type { StageDef } from "../../types/campaign";
import { rung } from "../geometry";
import { breach } from "./breach";
import { depths } from "./depths";
import { lastWatch } from "./last-watch";
import { threshold } from "./threshold";

export const citadel: StageDef = {
  id: "citadel",
  name: "Abyss Citadel",
  mapBlurb: "Every rift leads here.",
  kind: "citadel",
  era: "abyss",
  ladder: [...rung(2, "stalker"), ...rung(2, "eye")],
  boss: "sovereign",
  mini: {
    name: "Void Reaver",
    epithet: "First Hound of the Abyss",
    base: "stalker",
    light: 0xd060ff,
    power: 1,
    moves: ["pillars", "spikes"],
    adds: ["stalker", "eye"],
  },
  twist: { name: "Black Sun", text: "Foes move and strike faster.", foePace: 1.2 },
  areas: [threshold, breach, depths, lastWatch],
};
