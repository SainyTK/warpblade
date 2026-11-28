import type { StageDef } from "../../types/campaign";
import { rung } from "../geometry";
import { glacierHazard } from "./hazard";
import { frozenCorridor, icicleCavern, lynxDen } from "./layout";

export const glacier: StageDef = {
  id: "glacier",
  name: "Frostglass Caverns",
  mapBlurb: "Ice that remembers every footstep.",
  era: "glacier",
  ladder: [
    ...rung(1, "frostmite", "snowflit"),
    ...rung(2, "rimehound", "shardling"),
    ...rung(3, "cryomancer"),
    ...rung(4, "hoarback"),
    ...rung(5, "hoarwraith"),
    ...rung(6, "rimetusk"),
    ...rung(7, "frostbell"),
    ...rung(8, "frostcolossus"),
  ],
  boss: "rimeclaw",
  mini: {
    name: "Rime Oracle",
    epithet: "Voice of the Frozen Choir",
    base: "cryomancer",
    light: 0x8fd3f2,
    power: 1,
    moves: ["pillars", "call"],
    adds: ["shardling", "rimehound"],
  },
  twist: { name: "Hard Ice", text: "Foes last longer and hit softer.", foeHp: 1.25, foeDamage: 0.85 },
  grantsArt: "rimefang",
  weakTo: "forgeflare",
  areas: [frozenCorridor, icicleCavern, lynxDen],
  hazard: glacierHazard,
};
