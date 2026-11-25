import type { StageDef } from "../../types/campaign";
import { glacierApproach, glacierSummit } from "./layout";

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
  areas: [glacierApproach, glacierSummit],
};
