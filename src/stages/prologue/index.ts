import type { StageDef } from "../../types/campaign";
import { rung } from "../geometry";
import { firstSteps } from "./firstSteps";
import { sunlit } from "./sunlit";

export const prologue: StageDef = {
  id: "prologue",
  name: "Sunlit Ruins",
  mapBlurb: "Where the first rift opened.",
  era: "day",
  ladder: [
    ...rung(1, "slime", "bat"),
    ...rung(2, "thornback", "moth"),
    ...rung(3, "vinelash"),
    ...rung(4, "amberwasp"),
    ...rung(5, "ruinsentinel"),
    ...rung(6, "ivygargoyle"),
    ...rung(7, "rootcaller"),
    ...rung(8, "sunbasilisk"),
  ],
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
