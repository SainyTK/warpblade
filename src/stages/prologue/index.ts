import type { StageDef } from "../../types/campaign";
import { rung } from "../geometry";
import { firstSteps } from "./firstSteps";
import { sunlit } from "./sunlit";

export const prologue: StageDef = {
  id: "prologue",
  name: "Sunlit Ruins",
  mapBlurb: "Where the first rift opened.",
  kind: "prologue",
  era: "day",
  ladder: [...rung(15, 12, "thornback"), ...rung(15, 6, "moth")],
  boss: "oakheart",
  mini: {
    name: "Bramble Tusk",
    epithet: "Eldest of the Thornbacks",
    base: "thornback",
    light: 0xff7a5a,
    power: 1,
    moves: ["spikes", "call"],
    adds: ["thornback", "moth"],
  },
  twist: { name: "Kind Sun", text: "Foes hit softer.", foeDamage: 0.6 },
  areas: [firstSteps, sunlit],
};
