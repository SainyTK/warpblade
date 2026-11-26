import type { StageDef } from "../../types/campaign";
import { foundryVents } from "./hazard";
import { catwalks, furnaceHalls, smithy } from "./layout";

export const foundry: StageDef = {
  id: "foundry",
  name: "Cinder Foundry",
  mapBlurb: "The forges never went cold.",
  kind: "rift",
  era: "foundry",
  ground: "slagling",
  flyer: "emberbat",
  boss: "cindersmith",
  grantsArt: "forgeflare",
  weakTo: "mirespit",
  areas: [catwalks, furnaceHalls, smithy],
  hazard: foundryVents,
};
