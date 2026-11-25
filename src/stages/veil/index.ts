import type { StageDef } from "../../types/campaign";
import { veil as veilLayout } from "./layout";

export const veil: StageDef = {
  id: "veil",
  name: "Veil Spires",
  mapBlurb: "The towers where the rifts are kept.",
  kind: "rift",
  era: "twilight",
  ground: "golem",
  flyer: "sprite",
  boss: "warden",
  grantsArt: "riftlance",
  weakTo: "gloamlantern",
  areas: [veilLayout],
};
