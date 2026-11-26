import type { StageDef } from "../../types/campaign";
import { glacierHazard } from "./hazard";
import { frozenCorridor, icicleCavern, lynxDen } from "./layout";

export const glacier: StageDef = {
  id: "glacier",
  name: "Frostglass Caverns",
  mapBlurb: "Ice that remembers every footstep.",
  kind: "rift",
  era: "glacier",
  ground: "rimehound",
  flyer: "shardling",
  boss: "rimeclaw",
  grantsArt: "rimefang",
  weakTo: "forgeflare",
  areas: [frozenCorridor, icicleCavern, lynxDen],
  hazard: glacierHazard,
};
