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
  mini: {
    name: "Forge Marshal",
    epithet: "Warden of the Anvil Gate",
    base: "forgeguard",
    light: 0xff8a2a,
    power: 1,
    moves: ["pillars", "spikes"],
    adds: ["slagling", "emberbat"],
  },
  twist: { name: "Hot Forge", text: "Foes hit harder and break sooner.", foeHp: 0.8, foeDamage: 1.2 },
  grantsArt: "forgeflare",
  weakTo: "mirespit",
  areas: [catwalks, furnaceHalls, smithy],
  hazard: foundryVents,
};
